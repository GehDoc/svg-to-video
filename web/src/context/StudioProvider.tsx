import { useCallback, useMemo, useState, type ReactNode } from 'react';
import type { RendererHandle } from '../components/SvgRenderer';
import { StudioContext } from './StudioContext';
import {
  useRenderer,
  parseSvgDimensions,
  calculateFinalDimensions,
  type ResolutionPreset,
  type RenderSettings,
} from '../hooks/useRenderer';

export const StudioProvider = ({
  children,
  rendererRef,
}: {
  children: ReactNode;
  rendererRef: React.RefObject<RendererHandle | null>;
}) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('animation.mp4');
  const [duration, setDuration] = useState(5);
  const [hold, setHold] = useState(0);
  const [fps, setFps] = useState(60);
  const [preset, setPreset] = useState<ResolutionPreset>('original');
  const [scale, setScale] = useState(1);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [format, setFormat] = useState<'mp4' | 'webm'>('mp4');
  const [isTransparent, setIsTransparent] = useState(false);
  const [captureMethod, setCaptureMethod] = useState<
    'optimal' | 'high-fidelity'
  >('optimal');
  const [isDragging, setIsDragging] = useState(false);
  const [renderedUrl, setRenderedUrl] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const { render, cancel, clearError, state } = useRenderer(rendererRef);

  console.log('render');

  const originalDim = useMemo(() => {
    if (!svgContent)
      return { width: 0, height: 0, isDimensionsDetected: false };
    try {
      const result = parseSvgDimensions(svgContent);
      return {
        width: result.width,
        height: result.height,
        isDimensionsDetected: result.isDimensionsDetected,
      };
    } catch {
      return { width: 0, height: 0, isDimensionsDetected: false };
    }
  }, [svgContent]);

  const targetDim = useMemo(() => {
    return calculateFinalDimensions(originalDim.width, originalDim.height, {
      preset,
      scale,
    });
  }, [originalDim, preset, scale]);

  const handleStartRender = useCallback(async () => {
    if (!svgContent) return;
    setRenderedUrl(null);
    setFileSize(null);

    const settings: RenderSettings = {
      duration,
      fps,
      preset,
      scale,
      backgroundColor,
      format,
      isTransparent,
      captureMethod,
      hold,
    };
    try {
      const url = await render(svgContent, settings);
      if (url) {
        setRenderedUrl(url);
        const response = await fetch(url);
        const blob = await response.blob();
        setFileSize(`${(blob.size / (1024 * 1024)).toFixed(2)} MB`);
      }
    } catch {
      /* error handled by state */
    }
  }, [
    svgContent,
    duration,
    fps,
    preset,
    scale,
    backgroundColor,
    format,
    isTransparent,
    captureMethod,
    hold,
    render,
  ]);

  const downloadResult = useCallback(() => {
    if (renderedUrl) {
      const a = document.createElement('a');
      a.href = renderedUrl;
      a.download = fileName;
      a.click();
    }
  }, [renderedUrl, fileName]);

  const contextValue = useMemo(
    () => ({
      svgContent,
      setSvgContent,
      fileName,
      setFileName,
      duration,
      setDuration,
      hold,
      setHold,
      fps,
      setFps,
      preset,
      setPreset,
      scale,
      setScale,
      backgroundColor,
      setBackgroundColor,
      format,
      setFormat,
      isTransparent,
      setIsTransparent,
      captureMethod,
      setCaptureMethod,
      isDragging,
      setIsDragging,
      renderedUrl,
      setRenderedUrl,
      fileSize,
      setFileSize,
      originalDim,
      targetDim,
      state,
      handleStartRender,
      cancel,
      clearError,
      downloadResult,
      rendererRef,
    }),
    [
      svgContent,
      fileName,
      duration,
      hold,
      fps,
      preset,
      scale,
      backgroundColor,
      format,
      isTransparent,
      captureMethod,
      isDragging,
      renderedUrl,
      fileSize,
      originalDim,
      targetDim,
      state,
      handleStartRender,
      cancel,
      clearError,
      downloadResult,
      rendererRef,
    ]
  );

  return (
    <StudioContext.Provider value={contextValue}>
      {children}
    </StudioContext.Provider>
  );
};
