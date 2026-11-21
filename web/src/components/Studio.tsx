import { useCallback, useMemo, useRef, useEffect } from 'react';
import type { RendererHandle } from './SvgRenderer/index';
import {
  useRenderer,
  calculateFinalDimensions,
  type RenderSettings,
} from '../hooks/useRenderer';
import { getMimeTypeById } from '../utils/discoverFormats';
import {
  analyzeSvgAnimation,
  parseSvgDimensions,
} from '@shared/analyzeSvgAnimation.js';
import type { SamplePreset } from '../utils/samples';
import { formatRegistry } from '../utils/encoders/Registry';
import { Header } from './Header';
import { ConfigPanel } from './ConfigPanel';
import { MonitorPanel } from './MonitorPanel';
import { SampleModal } from './SampleModal/SampleModal';
import { trackEvent } from '../utils/analytics';
import { trackFileLoad } from '../utils/tracking/fileTracking';
import { useStudioState } from '../hooks/useStudioState';

export const Studio = () => {
  const rendererRef = useRef<RendererHandle>(null);
  const {
    state: studioState,
    resetStudio,
    updateConfig,
    setFileName,
    loadSource,
    loadSample,
    setRenderResult,
    setSampleModalOpen,
    setIsDragging,
    setSupportError,
  } = useStudioState();

  const {
    source,
    config,
    renderedUrl,
    fileSize,
    isSampleModalOpen,
    isDragging,
    supportError,
  } = studioState;
  const { svgContent, fileName, originalDim } = source;
  const {
    duration,
    hold,
    fps,
    preset,
    scale,
    backgroundColor,
    format,
    isTransparent,
    captureMethod,
    metadata,
  } = config;

  const { render, cancel, clearError, state } = useRenderer(rendererRef);

  const mimeType = useMemo(() => getMimeTypeById(format), [format]);

  const targetDim = useMemo(() => {
    return calculateFinalDimensions(originalDim.width, originalDim.height, {
      preset,
      scale,
    });
  }, [originalDim, preset, scale]);

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
  }, [format, targetDim, svgContent, supportError, setSupportError]);

  const validationError = useMemo(() => {
    if (!svgContent) return null;
    if (duration <= 0) return 'Duration must be greater than 0s';
    if (fps <= 0) return 'FPS must be at least 1';
    if (fps > 60) return 'FPS cannot exceed 60';
    return supportError;
  }, [svgContent, duration, fps, supportError]);

  const handleStartRender = useCallback(async () => {
    if (!svgContent || validationError) return;
    setRenderResult(null, null);

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
        const response = await fetch(url);
        const blob = await response.blob();
        setRenderResult(url, `${(blob.size / (1024 * 1024)).toFixed(2)} MB`);
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
    setRenderResult,
  ]);

  const handleDownload = useCallback(() => {
    if (renderedUrl) {
      trackEvent('download-result', { format, isTransparent });
      const a = document.createElement('a');
      a.href = renderedUrl;
      a.download = fileName;
      a.click();
    }
  }, [renderedUrl, fileName, format, isTransparent]);

  const handleBack = useCallback(() => {
    trackEvent('back-to-studio', { format, isTransparent });
    setRenderResult(null, null);
  }, [format, isTransparent, setRenderResult]);

  const handleHome = useCallback(
    (location: 'header' | 'config-source' = 'header') => {
      trackEvent('click-home', { location });
      if (state.isRendering) {
        cancel();
      }
      clearError();
      resetStudio();
    },
    [state.isRendering, cancel, clearError, resetStudio]
  );

  const handleOpenSamples = useCallback(
    (location: 'config-source' = 'config-source') => {
      trackEvent('open-samples', { location });
      setSampleModalOpen(true);
    },
    [setSampleModalOpen]
  );

  const handleCloseSamples = useCallback(() => {
    setSampleModalOpen(false);
  }, [setSampleModalOpen]);

  const handleSelectSample = useCallback(
    (sample: SamplePreset) => {
      let dim;
      try {
        dim = parseSvgDimensions(sample.svgContent);
      } catch {
        dim = {
          width: 0,
          height: 0,
          isDimensionsDetected: false,
        };
      }

      const detectedDuration = analyzeSvgAnimation(sample.svgContent);
      loadSample(sample, dim);
      trackFileLoad('sample', dim, detectedDuration ?? sample.duration);
    },
    [loadSample]
  );

  const handleSvgContentChange = useCallback(
    (
      content: string,
      name: string,
      method: 'file-picker' | 'drag-and-drop'
    ) => {
      let dim;
      try {
        dim = parseSvgDimensions(content);
      } catch {
        dim = {
          width: 0,
          height: 0,
          isDimensionsDetected: false,
        };
      }

      const detectedDuration = analyzeSvgAnimation(content);
      loadSource(content, name, dim, detectedDuration);
      trackFileLoad(method, dim, detectedDuration);
    },
    [loadSource]
  );

  return (
    <div className="app-container">
      <Header onHome={() => handleHome('header')} />
      <main className="studio-layout">
        <ConfigPanel
          svgContent={svgContent}
          onSvgContentChange={handleSvgContentChange}
          fileName={fileName}
          onFileNameChange={setFileName}
          duration={duration}
          onDurationChange={(d) => updateConfig({ duration: d })}
          hold={hold}
          onHoldChange={(h) => updateConfig({ hold: h })}
          fps={fps}
          onFpsChange={(f) => updateConfig({ fps: f })}
          preset={preset}
          onPresetChange={(p) => updateConfig({ preset: p })}
          scale={scale}
          onScaleChange={(s) => updateConfig({ scale: s })}
          backgroundColor={backgroundColor}
          onBackgroundColorChange={(c) => updateConfig({ backgroundColor: c })}
          format={format}
          onFormatChange={(f) => updateConfig({ format: f })}
          isTransparent={isTransparent}
          onIsTransparentChange={(t) => updateConfig({ isTransparent: t })}
          captureMethod={captureMethod}
          onCaptureMethodChange={(m) => updateConfig({ captureMethod: m })}
          isDragging={isDragging}
          onIsDraggingChange={setIsDragging}
          state={state}
          onStartRender={handleStartRender}
          validationError={validationError}
          originalDim={originalDim}
          targetDim={targetDim}
          renderedUrl={renderedUrl}
          metadata={metadata}
          onMetadataChange={(m) => updateConfig({ metadata: m })}
          onOpenSamples={() => handleOpenSamples('config-source')}
          onClearSvg={() => handleHome('config-source')}
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
          format={format}
          onSelectSample={handleSelectSample}
        />
      </main>
      <SampleModal
        isOpen={isSampleModalOpen}
        onClose={handleCloseSamples}
        onSelectSample={handleSelectSample}
      />
    </div>
  );
};
