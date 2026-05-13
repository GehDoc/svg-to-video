import { useRef, useContext } from 'react';
import type { RendererHandle } from './components/SvgRenderer';
import { StudioProvider } from './context/StudioProvider';
import { StudioContext } from './context/StudioContext';
import { Header } from './components/Header';
import { ConfigPanel } from './components/ConfigPanel';
import { MonitorPanel } from './components/MonitorPanel';
import './App.css';

const StudioLayout = () => {
  const {
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
    state,
    handleStartRender,
    originalDim,
    targetDim,
    renderedUrl,
    setRenderedUrl,
    fileSize,
    downloadResult,
    cancel,
    clearError,
    rendererRef,
  } = useContext(StudioContext)!;

  const handleDownload = () => {
    if (typeof umami !== 'undefined') {
      umami.track('download-result', { format, isTransparent });
    }
    downloadResult();
  };

  const handleBack = () => {
    if (typeof umami !== 'undefined') {
      umami.track('back-to-studio', { format, isTransparent });
    }
    setRenderedUrl(null);
  };

  return (
    <div className="app-container">
      <Header />
      <main className="studio-layout">
        <ConfigPanel
          svgContent={svgContent}
          onSvgContentChange={(content, name) => {
            setSvgContent(content);
            setFileName(name);
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

function App() {
  const rendererRef = useRef<RendererHandle>(null);

  return (
    <StudioProvider rendererRef={rendererRef}>
      <StudioLayout />
    </StudioProvider>
  );
}

export default App;
