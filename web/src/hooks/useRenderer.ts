import { useState, useCallback, useRef } from 'react';
import type { RendererHandle } from '../components/SvgRenderer';
import { getFormatById } from '../utils/discoverFormats';
import { createEncoder } from '../utils/encoders/EncoderFactory';
import type { VideoMetadata } from '@shared/metadata';

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

import { VideoEncoder } from '../utils/encoders/types';

export const useRenderer = (
  rendererRef: React.RefObject<RendererHandle | null>
) => {
  const [state, setState] = useState<RenderState>({
    isRendering: false,
    progress: 0,
    status: 'Ready',
  });

  const cancelRef = useRef(false);
  const activeEncoderRef = useRef<VideoEncoder | null>(null);
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

        const encoder = createEncoder(settings.format);
        activeEncoderRef.current = encoder;

        const backgroundColor =
          !settings.isTransparent || formatInfo.needsColorKeying
            ? settings.backgroundColor
            : undefined;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', {
          alpha: settings.isTransparent,
        });
        if (!ctx) throw new Error('Could not get 2D context');

        await encoder.init(
          {
            width,
            height,
            fps: settings.fps,
            duration: settings.duration,
            backgroundColor,
            isTransparent: settings.isTransparent,
            metadata: settings.metadata,
            format: settings.format,
            mimeType: formatInfo.mimeType,
          },
          canvas
        );

        setState((s) => ({
          ...s,
          meta: {
            originalSize: `${origWidth}x${origHeight}`,
            finalSize: `${width}x${height}`,
            codec: 'In progress...', // Codec info is now inside the encoder
            eta: 0,
          },
        }));

        const totalAnimationFrames = Math.ceil(
          settings.duration * settings.fps
        );
        const totalHoldFrames = Math.ceil(settings.hold * settings.fps);
        const totalFrames = totalAnimationFrames + totalHoldFrames;
        const frameDuration = 1000 / settings.fps;
        const startTime = performance.now();

        // 1. Animation Loop
        for (let frame = 1; frame <= totalAnimationFrames; frame++) {
          if (cancelRef.current) {
            encoder.cancel();
            setState({ isRendering: false, progress: 0, status: 'Cancelled' });
            return;
          }

          const timeMs = (frame - 1) * frameDuration;
          await rendererRef.current.seek(timeMs);
          const bitmap = await rendererRef.current.capture(
            settings.captureMethod,
            settings.isTransparent
          );
          ctx.clearRect(0, 0, width, height);
          if (backgroundColor) {
            if (formatInfo.needsColorKeying) {
              ctx.drawImage(bitmap, 0, 0, width, height);
              ctx.globalCompositeOperation = 'source-in';
            }
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'source-over';
          }
          ctx.drawImage(bitmap, 0, 0, width, height);

          await encoder.addFrame(timeMs, frameDuration);
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
              encoder.cancel();
              setState({
                isRendering: false,
                progress: 0,
                status: 'Cancelled',
              });
              return;
            }
            const currentFrame = totalAnimationFrames + frame;
            const timeMs = (currentFrame - 1) * frameDuration;

            ctx.clearRect(0, 0, width, height);
            if (backgroundColor) {
              if (formatInfo.needsColorKeying) {
                ctx.drawImage(finalBitmap, 0, 0, width, height);
                ctx.globalCompositeOperation = 'source-in';
              }
              ctx.fillStyle = backgroundColor;
              ctx.fillRect(0, 0, width, height);
              ctx.globalCompositeOperation = 'source-over';
            }
            ctx.drawImage(finalBitmap, 0, 0, width, height);

            await encoder.addFrame(timeMs, frameDuration);

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

        const blob = await encoder.finalize();
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
    if (activeEncoderRef.current) {
      activeEncoderRef.current.cancel();
    }
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
