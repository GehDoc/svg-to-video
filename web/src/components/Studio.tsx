import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import type { RendererHandle } from './SvgRenderer/index';
import {
  useRenderer,
  parseSvgDimensions,
  calculateFinalDimensions,
  type ResolutionPreset,
  type RenderSettings,
} from '../hooks/useRenderer';
import { getMimeTypeById } from '../utils/discoverFormats';
import { analyzeSvgAnimation } from '@shared/analyzeSvgAnimation.js';
import type { VideoMetadata } from '@shared/metadata';
import { formatRegistry } from '../utils/encoders/Registry';
import { Header } from './Header';
import { ConfigPanel } from './ConfigPanel';
import { MonitorPanel } from './MonitorPanel';

export const Studio = () => {
  const rendererRef = useRef<RendererHandle>(null);

  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('animation.mp4');
  const [duration, setDuration] = useState(5);
  const [hold, setHold] = useState(0);
  const [fps, setFps] = useState(24);
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
  const [metadata, setMetadata] = useState<VideoMetadata>({
    title: '',
    comment: '',
  });

  const { render, cancel, clearError, state } = useRenderer(rendererRef);

  const mimeType = useMemo(() => getMimeTypeById(format), [format]);

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

  const [supportError, setSupportError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    if (!svgContent) {
      if (supportError) {
        Promise.resolve().then(() => {
          if (!ignore) setSupportError(null);
        });
      }
      return;
    }

    const checkSupport = async () => {
      const { width, height } = targetDim;
      const formatObj = formatRegistry.getFormat(format);

      if (formatObj) {
        const isSupported = await formatObj.isSupported({ width, height });
        if (!ignore) {
          setSupportError(
            isSupported
              ? null
              : `The selected format is not supported at ${width}x${height} in this browser.`
          );
        }
      }
    };

    checkSupport();
    return () => {
      ignore = true;
    };
  }, [format, targetDim, svgContent, supportError]);

  const validationError = useMemo(() => {
    if (!svgContent) return null;
    if (duration <= 0) return 'Duration must be greater than 0s';
    if (fps <= 0) return 'FPS must be at least 1';
    if (fps > 60) return 'FPS cannot exceed 60';
    return supportError;
  }, [svgContent, duration, fps, supportError]);

  const handleStartRender = useCallback(async () => {
    if (!svgContent || validationError) return;
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
      metadata,
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
    validationError,
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
    metadata,
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
            if (detectedDuration !== undefined && detectedDuration > 0) {
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
          validationError={validationError}
          originalDim={originalDim}
          renderedUrl={renderedUrl}
          metadata={metadata}
          onMetadataChange={setMetadata}
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
          mimeType={mimeType}
        />
      </main>
    </div>
  );
};
