import { useState, type ReactNode } from 'react';
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
  const [captureMethod, setCaptureMethod] = useState<
    'optimal' | 'high-fidelity'
  >('optimal');
  const [isDragging, setIsDragging] = useState(false);
  const [renderedUrl, setRenderedUrl] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const { render, cancel, state } = useRenderer(rendererRef);

  let originalDim = { width: 0, height: 0, fromViewBox: false };
  let targetDim = { width: 0, height: 0 };
  if (svgContent) {
    try {
      originalDim = parseSvgDimensions(svgContent);
      targetDim = calculateFinalDimensions(
        originalDim.width,
        originalDim.height,
        { preset, scale }
      );
    } catch {
      /* ignore */
    }
  }

  const handleStartRender = async () => {
    if (!svgContent) return;
    setRenderedUrl(null);
    setFileSize(null);

    const settings: RenderSettings = {
      duration,
      fps,
      preset,
      scale,
      backgroundColor,
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
  };

  const downloadResult = () => {
    if (renderedUrl) {
      const a = document.createElement('a');
      a.href = renderedUrl;
      a.download = fileName;
      a.click();
    }
  };

  return (
    <StudioContext.Provider
      value={{
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
        downloadResult,
        rendererRef,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};
