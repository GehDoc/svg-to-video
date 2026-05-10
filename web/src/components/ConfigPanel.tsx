import { StudioContext } from '../context/StudioContext';
import { useContext, type ChangeEvent } from 'react';
import type { ResolutionPreset } from '../hooks/useRenderer';
import { isTransparencySupported } from '../hooks/isTransparencySupported';
import { Dropzone } from './Dropzone';
import { Button } from './Button/Button';
import './ConfigPanel.scss';

export const ConfigPanel = () => {
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
    renderedUrl,
  } = useContext(StudioContext)!;

  const isRenderingOrSuccess = state.isRendering || !!renderedUrl;
  const isOptionsDisabled = isRenderingOrSuccess || !svgContent;

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSvgContent(content);
      const baseName = file.name.replace(/\.svg$/i, '');
      setFileName(`${baseName}.mp4`);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (
      e.dataTransfer.files?.[0] &&
      e.dataTransfer.files[0].type === 'image/svg+xml'
    ) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <aside className="config-panel">
      <section
        className={`config-section ${isRenderingOrSuccess ? 'is-locked' : ''}`}
      >
        <h2>1. Source</h2>
        <Dropzone
          svgContent={svgContent}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          onFileChange={handleFileChange}
          onDrop={handleDrop}
          disabled={isRenderingOrSuccess}
        />
      </section>

      <section
        className={`config-section ${isOptionsDisabled ? 'is-locked' : ''}`}
      >
        <h2>2. Format</h2>
        <div className="input-group">
          <label htmlFor="format">Output Format</label>
          <select
            id="format"
            value={format}
            onChange={(e) => {
              setFormat(e.target.value as 'mp4' | 'webm');
              const newName = fileName.replace(
                /\.[^/.]+$/,
                `.${e.target.value}`
              );
              setFileName(newName);
            }}
            disabled={isOptionsDisabled}
          >
            <option value="mp4">MP4</option>
            <option value="webm">WebM</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="resolution">Resolution</label>
          <select
            id="resolution"
            value={!originalDim.isDimensionsDetected ? '1080p' : preset}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setPreset(e.target.value as ResolutionPreset)
            }
            disabled={isOptionsDisabled || !originalDim.isDimensionsDetected}
          >
            <option value="original">Original Size</option>
            <option value="720p">720p (Fit)</option>
            <option value="1080p">1080p (Fit)</option>
          </select>
          {svgContent && !originalDim.isDimensionsDetected && (
            <p className="hint-text" style={{ color: 'var(--error)' }}>
              Warning: Could not detect SVG dimensions. Defaulting to 1080p.
            </p>
          )}
        </div>

        {preset === 'original' && (
          <div className="input-group">
            <label htmlFor="scale">Scale ({scale}x)</label>
            <input
              type="range"
              id="scale"
              min="1"
              max="4"
              step="0.5"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              disabled={isOptionsDisabled}
              style={{ width: '100%' }}
            />
          </div>
        )}

        <div className="grid-3">
          <div className="input-group">
            <label htmlFor="duration">Dur. (s)</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              min={1}
              disabled={isOptionsDisabled}
            />
          </div>
          <div className="input-group">
            <label htmlFor="hold">Hold (s)</label>
            <input
              type="number"
              id="hold"
              value={hold}
              onChange={(e) => setHold(parseFloat(e.target.value))}
              min={0}
              step={0.5}
              disabled={isOptionsDisabled}
            />
          </div>
          <div className="input-group">
            <label htmlFor="fps">FPS</label>
            <input
              type="number"
              id="fps"
              value={fps}
              onChange={(e) => setFps(parseInt(e.target.value))}
              min={1}
              max={60}
              disabled={isOptionsDisabled}
            />
          </div>
        </div>
      </section>

      <section
        className={`config-section ${isOptionsDisabled ? 'is-locked' : ''}`}
      >
        <h2>3. Canvas</h2>
        <div className="input-group">
          <label htmlFor="transparent">
            <input
              type="checkbox"
              id="transparent"
              checked={isTransparent}
              onChange={(e) => setIsTransparent(e.target.checked)}
              disabled={isOptionsDisabled || !isTransparencySupported(format)}
            />
            Transparent Background
          </label>
          {!isTransparencySupported(format) && (
            <p className="hint-text" style={{ color: 'var(--secondary)' }}>
              Transparency only supported for WebM
            </p>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="bg-color">Background</label>
          <div className="color-picker-wrapper">
            <input
              type="color"
              id="bg-color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              disabled={isOptionsDisabled || isTransparent}
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              disabled={isOptionsDisabled || isTransparent}
              className="color-text-input"
              aria-label="Background color hex code"
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="capture-method">Capture Method</label>
          <select
            id="capture-method"
            value={captureMethod}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setCaptureMethod(e.target.value as 'optimal' | 'high-fidelity')
            }
            disabled={isOptionsDisabled}
          >
            <option value="optimal">Optimal (Fast)</option>
            <option value="high-fidelity">High Fidelity (Slow)</option>
          </select>
        </div>
      </section>

      <div className="render-actions">
        <Button
          variant="primary"
          onClick={handleStartRender}
          disabled={!svgContent || isRenderingOrSuccess}
        >
          {state.isRendering
            ? 'Processing...'
            : `Export ${format.toUpperCase()}`}
        </Button>
      </div>
    </aside>
  );
};
