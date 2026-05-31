import { useState, useCallback, useRef } from 'react';
import type { RendererHandle } from '../components/SvgRenderer';
import type { VideoMetadata } from '../../../shared/metadata';
import { mergeMetadataComments } from '../../../shared/metadata';
import pkg from '../../../package.json';
import * as Mediabunny from 'mediabunny';

import { getFormatById } from '../utils/discoverFormats';
import { ApngEncoder } from '../utils/encoders/ApngEncoder';
import { GifEncoder } from '../utils/encoders/GifEncoder';

export type ResolutionPreset = 'original' | '720p' | '1080p';
export type CaptureMethod = 'optimal' | 'high-fidelity';

export interface RenderSettings {
  duration: number;
  fps: number;
  preset: ResolutionPreset;
  scale: number;
  backgroundColor: string;
  format: string;
  isTransparent: boolean;
  captureMethod: CaptureMethod;
  hold: number;
  metadata?: VideoMetadata;
}

export interface RenderState {
  isRendering: boolean;
  progress: number;
  status: string;
  meta?: {
    originalSize: string;
    finalSize: string;
    codec: string;
    eta: number; // in seconds
  };
}

export const parseSvgDimensions = (svgContent: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svg = doc.querySelector('svg');

  if (!svg) throw new Error('Invalid SVG content');

  let width = parseFloat(svg.getAttribute('width') || '');
  let height = parseFloat(svg.getAttribute('height') || '');
  const viewBox = svg.getAttribute('viewBox');

  let isDimensionsDetected = !(isNaN(width) || isNaN(height));

  if (!isDimensionsDetected && viewBox) {
    const parts = viewBox.trim().split(/\s+/).map(parseFloat);
    if (parts.length === 4) {
      width = parts[2];
      height = parts[3];
      isDimensionsDetected = true;
    }
  }

  if (isNaN(width) || isNaN(height)) {
    width = 1920;
    height = 1080;
    isDimensionsDetected = false;
  }

  return { width, height, isDimensionsDetected };
};

export const calculateFinalDimensions = (
  origWidth: number,
  origHeight: number,
  settings: { preset: ResolutionPreset; scale: number }
) => {
  let width = origWidth;
  let height = origHeight;

  if (settings.preset === '720p') {
    const ratio = Math.min(1280 / origWidth, 720 / origHeight);
    width = origWidth * ratio;
    height = origHeight * ratio;
  } else if (settings.preset === '1080p') {
    const ratio = Math.min(1920 / origWidth, 1080 / origHeight);
    width = origWidth * ratio;
    height = origHeight * ratio;
  } else if (settings.preset === 'original') {
    width *= settings.scale;
    height *= settings.scale;
  }

  width = Math.floor(width / 2) * 2;
  height = Math.floor(height / 2) * 2;

  return { width, height };
};

export const getBestCodec = async (
  width: number,
  height: number,
  formatId: string
) => {
  const format = getFormatById(formatId);
  if (!format) throw new Error(`Unknown format: ${formatId}`);

  const outputFormat = new format.OutputFormatClass();
  return await Mediabunny.getFirstEncodableVideoCodec(
    outputFormat.getSupportedVideoCodecs(),
    {
      width,
      height,
    }
  );
};

export const useRenderer = (
  rendererRef: React.RefObject<RendererHandle | null>
) => {
  const [state, setState] = useState<RenderState>({
    isRendering: false,
    progress: 0,
    status: 'Ready',
  });

  const cancelRef = useRef(false);
  const settingsRef = useRef<RenderSettings | null>(null);

  const render = useCallback(
    async (svgContent: string, settings: RenderSettings) => {
      if (!rendererRef.current) return;

      const formatInfo = getFormatById(settings.format);
      if (!formatInfo) throw new Error(`Unknown format: ${settings.format}`);

      cancelRef.current = false;
      settingsRef.current = settings;
      setState({ isRendering: true, progress: 0, status: 'Initializing...' });

      if (typeof umami !== 'undefined') {
        umami.track('conversion-start', {
          format: settings.format,
          isTransparent: settings.isTransparent,
        });
      }

      try {
        const { width: origWidth, height: origHeight } =
          parseSvgDimensions(svgContent);
        const { width, height } = calculateFinalDimensions(
          origWidth,
          origHeight,
          settings
        );

        await rendererRef.current.loadSvg(svgContent, width, height);

        const isCustomFormat = ['apng', 'gif'].includes(settings.format);

        let apngEncoder: ApngEncoder | null = null;
        let gifEncoder: GifEncoder | null = null;
        let target: Mediabunny.BufferTarget | null = null;
        let output: Mediabunny.Output | null = null;
        let source: Mediabunny.CanvasSource | null = null;

        if (settings.format === 'apng') {
          apngEncoder = new ApngEncoder(width, height);
        } else if (settings.format === 'gif') {
          const transColor = settings.isTransparent
            ? settings.backgroundColor
            : undefined;
          gifEncoder = new GifEncoder(width, height, transColor);
        } else {
          target = new Mediabunny.BufferTarget();
          const outputFormat = new formatInfo.OutputFormatClass();
          output = new Mediabunny.Output({
            format: outputFormat,
            target,
          });

          const metadata: VideoMetadata = {};
          if (settings.metadata?.title?.trim()) {
            metadata.title = settings.metadata.title.trim();
          }
          metadata.comment = mergeMetadataComments(
            settings.metadata?.comment?.trim(),
            pkg.version
          );

          output.setMetadataTags(metadata);
        }

        const videoCodec = isCustomFormat
          ? 'N/A'
          : await getBestCodec(width, height, settings.format);
        if (!isCustomFormat && !videoCodec) {
          throw new Error('No supported video codec found.');
        }

        setState((s) => ({
          ...s,
          meta: {
            originalSize: `${origWidth}x${origHeight}`,
            finalSize: `${width}x${height}`,
            codec: videoCodec || 'N/A',
            eta: 0,
          },
        }));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', {
          alpha: settings.isTransparent,
        });
        if (!ctx) throw new Error('Could not get 2D context');

        if (!isCustomFormat) {
          if (!settings.isTransparent) {
            ctx.fillStyle = settings.backgroundColor;
            ctx.fillRect(0, 0, width, height);
          }

          source = new Mediabunny.CanvasSource(canvas, {
            codec: videoCodec as Mediabunny.VideoCodec,
            bitrate: Mediabunny.QUALITY_HIGH,
            alpha: settings.isTransparent ? 'keep' : 'discard',
          });
          output!.addVideoTrack(source);

          await output!.start();
        }

        const totalAnimationFrames = Math.ceil(
          settings.duration * settings.fps
        );
        const totalHoldFrames = Math.ceil(settings.hold * settings.fps);
        const totalFrames = totalAnimationFrames + totalHoldFrames;
        const frameDuration = 1 / settings.fps;
        const startTime = performance.now();

        // 1. Animation Loop
        for (let frame = 1; frame <= totalAnimationFrames; frame++) {
          if (cancelRef.current) {
            setState({ isRendering: false, progress: 0, status: 'Cancelled' });
            return;
          }

          const timeMs = ((frame - 1) / settings.fps) * 1000;
          await rendererRef.current.seek(timeMs);
          const bitmap = await rendererRef.current.capture(
            settings.captureMethod,
            settings.isTransparent
          );
          ctx.clearRect(0, 0, width, height);
          // For GIF, even if transparent, we fill the background with the key color
          if (!settings.isTransparent || settings.format === 'gif') {
            ctx.fillStyle = settings.backgroundColor;
            ctx.fillRect(0, 0, width, height);
          }
          ctx.drawImage(bitmap, 0, 0, width, height);

          if (isCustomFormat) {
            if (apngEncoder) {
              const imageData = ctx.getImageData(0, 0, width, height);
              apngEncoder.addFrame(
                new Uint8Array(imageData.data),
                frameDuration * 1000
              );
            } else if (gifEncoder) {
              gifEncoder.addFrame(ctx, frameDuration * 1000);
            }
          } else {
            await source!.add((frame - 1) * frameDuration, frameDuration);
          }

          bitmap.close();

          const elapsedTime = (performance.now() - startTime) / 1000;
          const eta = Math.round((totalFrames - frame) * (elapsedTime / frame));

          setState((prevState) => ({
            ...prevState,
            isRendering: true,
            progress: Math.round((frame / totalFrames) * 100),
            status: `Rendering animation frame ${frame}/${totalAnimationFrames}...`,
            meta: {
              originalSize: prevState.meta?.originalSize || '',
              finalSize: prevState.meta?.finalSize || '',
              codec: prevState.meta?.codec || '',
              eta,
            },
          }));
        }

        // 2. Hold Frames Loop
        if (totalHoldFrames > 0) {
          await rendererRef.current.seek(settings.duration * 1000);
          const finalBitmap = await rendererRef.current.capture(
            settings.captureMethod,
            settings.isTransparent
          );

          for (let frame = 1; frame <= totalHoldFrames; frame++) {
            if (cancelRef.current) {
              setState({
                isRendering: false,
                progress: 0,
                status: 'Cancelled',
              });
              return;
            }
            const currentFrame = totalAnimationFrames + frame;
            ctx.clearRect(0, 0, width, height);
            // For GIF, even if transparent, we fill the background with the key color
            if (!settings.isTransparent || settings.format === 'gif') {
              ctx.fillStyle = settings.backgroundColor;
              ctx.fillRect(0, 0, width, height);
            }
            ctx.drawImage(finalBitmap, 0, 0, width, height);

            if (isCustomFormat) {
              if (apngEncoder) {
                const imageData = ctx.getImageData(0, 0, width, height);
                apngEncoder.addFrame(
                  new Uint8Array(imageData.data),
                  frameDuration * 1000
                );
              } else if (gifEncoder) {
                gifEncoder.addFrame(ctx, frameDuration * 1000);
              }
            } else {
              await source!.add(
                (currentFrame - 1) * frameDuration,
                frameDuration
              );
            }

            const elapsedTime = (performance.now() - startTime) / 1000;
            const eta = Math.round(
              (totalFrames - currentFrame) * (elapsedTime / currentFrame)
            );

            setState((prevState) => ({
              ...prevState,
              isRendering: true,
              progress: Math.round((currentFrame / totalFrames) * 100),
              status: `Adding hold frame ${frame}/${totalHoldFrames}...`,
              meta: {
                originalSize: prevState.meta?.originalSize || '',
                finalSize: prevState.meta?.finalSize || '',
                codec: prevState.meta?.codec || '',
                eta,
              },
            }));
          }
          finalBitmap.close();
        }

        setState({
          isRendering: true,
          progress: 100,
          status: 'Finalizing video...',
        });

        let blob: Blob;

        if (isCustomFormat) {
          if (apngEncoder) {
            const buffer = await apngEncoder.finalize();
            blob = new Blob([buffer], { type: formatInfo.mimeType });
          } else if (gifEncoder) {
            blob = await gifEncoder.finalize();
          } else {
            throw new Error('No encoder initialized for custom format');
          }
        } else {
          await output!.finalize();
          const resultBuffer = target!.buffer;
          if (!resultBuffer) throw new Error('Output buffer is empty');
          blob = new Blob([resultBuffer], {
            type: formatInfo.mimeType,
          });
        }

        const url = URL.createObjectURL(blob);
        setState({ isRendering: false, progress: 100, status: 'Done!' });

        if (typeof umami !== 'undefined') {
          umami.track('conversion-success', {
            format: settings.format,
            isTransparent: settings.isTransparent,
          });
        }

        return url;
      } catch (err) {
        const error = err as Error;
        setState({
          isRendering: false,
          progress: 0,
          status: `Error: ${error.message}`,
        });

        if (typeof umami !== 'undefined') {
          umami.track('conversion-failed', {
            error: error.message,
            format: settings.format,
            isTransparent: settings.isTransparent,
          });
        }

        throw error;
      }
    },
    [rendererRef]
  );

  const cancel = useCallback(() => {
    cancelRef.current = true;
    setState({ isRendering: false, progress: 0, status: 'Ready' });

    if (typeof umami !== 'undefined' && settingsRef.current) {
      umami.track('conversion-cancel', {
        format: settingsRef.current.format,
        isTransparent: settingsRef.current.isTransparent,
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, status: 'Ready' }));
  }, []);

  return { render, cancel, clearError, state };
};
