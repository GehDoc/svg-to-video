import { useState, useCallback, useRef } from 'react';
import type { RendererHandle } from '../components/SvgRenderer';
import {
  Output,
  Mp4OutputFormat,
  CanvasSource,
  BufferTarget,
  QUALITY_HIGH,
  getFirstEncodableVideoCodec,
} from 'mediabunny';

export type ResolutionPreset = 'original' | '720p' | '1080p';
export type CaptureMethod = 'optimal' | 'high-fidelity';

export interface RenderSettings {
  duration: number;
  fps: number;
  preset: ResolutionPreset;
  scale: number;
  backgroundColor: string;
  captureMethod: CaptureMethod;
  hold: number;
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

  // Ensure dimensions are even numbers (requirement for many H.264 encoders)
  width = Math.floor(width / 2) * 2;
  height = Math.floor(height / 2) * 2;

  return { width, height };
};

export const getBestCodec = async (width: number, height: number) => {
  const format = new Mp4OutputFormat();
  return await getFirstEncodableVideoCodec(format.getSupportedVideoCodecs(), {
    width,
    height,
  });
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

  const render = useCallback(
    async (svgContent: string, settings: RenderSettings) => {
      if (!rendererRef.current) return;

      cancelRef.current = false;
      setState({ isRendering: true, progress: 0, status: 'Initializing...' });

      try {
        const { width: origWidth, height: origHeight } =
          parseSvgDimensions(svgContent);
        const { width, height } = calculateFinalDimensions(
          origWidth,
          origHeight,
          settings
        );

        await rendererRef.current.loadSvg(svgContent, width, height);

        const target = new BufferTarget();
        const output = new Output({
          format: new Mp4OutputFormat(),
          target,
        });

        const videoCodec = await getBestCodec(width, height);
        if (!videoCodec) {
          throw new Error(
            'No supported video codec found for this resolution in your browser.'
          );
        }

        setState((s) => ({
          ...s,
          meta: {
            originalSize: `${origWidth}x${origHeight}`,
            finalSize: `${width}x${height}`,
            codec: videoCodec,
            eta: 0,
          },
        }));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2D context');

        const source = new CanvasSource(canvas, {
          codec: videoCodec,
          bitrate: QUALITY_HIGH,
        });
        output.addVideoTrack(source);

        await output.start();

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
            settings.captureMethod
          );
          ctx.fillStyle = settings.backgroundColor;
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(bitmap, 0, 0, width, height);
          bitmap.close();
          await source.add((frame - 1) * frameDuration, frameDuration);

          const elapsedTime = (performance.now() - startTime) / 1000;
          const framesRemaining = totalFrames - frame;
          const eta = Math.round(framesRemaining * (elapsedTime / frame));

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
            await source.add((currentFrame - 1) * frameDuration, frameDuration);
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
        }

        setState({
          isRendering: true,
          progress: 100,
          status: 'Finalizing video...',
        });
        await output.finalize();
        const resultBuffer = target.buffer;
        if (!resultBuffer) throw new Error('Output buffer is empty');
        const blob = new Blob([resultBuffer], { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);
        setState({ isRendering: false, progress: 100, status: 'Done!' });
        return url;
      } catch (err) {
        const error = err as Error;
        setState({
          isRendering: false,
          progress: 0,
          status: `Error: ${error.message}`,
        });
        throw error;
      }
    },
    [rendererRef]
  );

  const cancel = useCallback(() => {
    cancelRef.current = true;
  }, []);

  return { render, cancel, state };
};
