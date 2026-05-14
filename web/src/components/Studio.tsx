import { useCallback, useMemo, useState, useRef } from 'react';
import type { RendererHandle } from './SvgRenderer/index';
import {
  useRenderer,
  parseSvgDimensions,
  calculateFinalDimensions,
  type ResolutionPreset,
  type RenderSettings,
} from '../hooks/useRenderer';
import { analyzeSvgAnimation } from '../utils/analyzeSvgAnimation';
import { Header } from './Header';
import { ConfigPanel } from './ConfigPanel';
import { MonitorPanel } from './MonitorPanel';

export const Studio = () => {
  const rendererRef = useRef<RendererHandle>(null);

  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('animation.mp4');
  const [duration, setDuration] = useState(5);
  const [hold, setHold] = useState(0);
  const [fps, setFps] = useState(60);
  const [preset, setPreset] = useState<ResolutionPreset>('original');
  const [scale, setScale] = useState(1);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [format, setFormat] = useState<string>('mp4');
  const [isTransparent, setIsTransparent] = useState(false);
  const [captureMethod, setCaptureMethod] = useState<
    'optimal' | 'high-fidelity'
  >('high-fidelity');
  const [isDragging, setIsDragging] = useState(false);
  const [renderedUrl, setRenderedUrl] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const { render, cancel, clearError, state } = useRenderer(rendererRef);

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

  const handleDownload = useCallback(() => {
    if (renderedUrl) {
      if (typeof umami !== 'undefined') {
        umami.track('download-result', { format, isTransparent });
      }
      const a = document.createElement('a');
      a.href = renderedUrl;
      a.download = fileName;
      a.click();
    }
  }, [renderedUrl, fileName, format, isTransparent]);

  const handleBack = useCallback(() => {
    if (typeof umami !== 'undefined') {
      umami.track('back-to-studio', { format, isTransparent });
    }
    setRenderedUrl(null);
  }, [format, isTransparent]);

  return (
    <div className="app-container">
      <Header />
      <main className="studio-layout">
        <ConfigPanel
          svgContent={svgContent}
          onSvgContentChange={(content, name) => {
            setSvgContent(content);
            setFileName(name);
            const detectedDuration = analyzeSvgAnimation(content);
            if (detectedDuration !== null && detectedDuration > 0) {
              setDuration(detectedDuration);
            }
          }}
          fileName={fileName}
          onFileNameChange={setFileName}
          duration={duration}
          onDurationChange={setDuration}
          hold={hold}
          onHoldChange={setHold}
          fps={fps}
          onFpsChange={setFps}
          preset={preset}
          onPresetChange={setPreset}
          scale={scale}
          onScaleChange={setScale}
          backgroundColor={backgroundColor}
          onBackgroundColorChange={setBackgroundColor}
          format={format}
          onFormatChange={setFormat}
          isTransparent={isTransparent}
          onIsTransparentChange={setIsTransparent}
          captureMethod={captureMethod}
          onCaptureMethodChange={setCaptureMethod}
          isDragging={isDragging}
          onIsDraggingChange={setIsDragging}
          state={state}
          onStartRender={handleStartRender}
          originalDim={originalDim}
          renderedUrl={renderedUrl}
        />
        <MonitorPanel
          svgContent={svgContent}
          renderedUrl={renderedUrl}
          state={state}
          fileName={fileName}
          fileSize={fileSize}
          onDownload={handleDownload}
          onBack={handleBack}
          originalDim={originalDim}
          targetDim={targetDim}
          rendererRef={rendererRef}
          backgroundColor={backgroundColor}
          isTransparent={isTransparent}
          onCancel={cancel}
          onClearError={clearError}
        />
      </main>
    </div>
  );
};
