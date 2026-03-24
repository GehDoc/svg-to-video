import { StudioContext } from '../context/StudioContext';
import { useContext, type ChangeEvent } from 'react';
import type { ResolutionPreset } from '../hooks/useRenderer';

export const ConfigPanel = () => {
  const {
    svgContent,
    setSvgContent,
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
    state,
    handleStartRender,
    originalDim,
    renderedUrl,
  } = useContext(StudioContext)!;

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSvgContent(content);
      const baseName = file.name.replace(/\.svg$/i, '');
      setFileName(`${baseName}.mp4`);
      if (originalDim.fromViewBox) setPreset('original');
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
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
    <aside
      className={`config-panel ${state.isRendering || !!renderedUrl ? 'is-locked' : ''}`}
    >
      <section className="config-section">
        <h2>1. Source</h2>
        <div
          className={`dropzone ${isDragging ? 'dragging' : ''} ${svgContent ? 'has-content' : ''}`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label htmlFor="svg-upload">
              {svgContent ? 'Change SVG' : 'Drop SVG here or click to upload'}
            </label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="svg-upload"
                accept=".svg"
                onChange={handleFileChange}
                disabled={state.isRendering || !!renderedUrl}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="config-section">
        <h2>2. Format</h2>
        <div className="input-group">
          <label htmlFor="resolution">Resolution</label>
          <select
            id="resolution"
            value={preset}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setPreset(e.target.value as ResolutionPreset)
            }
            disabled={
              state.isRendering || !!renderedUrl || originalDim.fromViewBox
            }
          >
            <option value="original">Original Size</option>
            <option value="720p" disabled={originalDim.fromViewBox}>
              720p (Fit)
            </option>
            <option value="1080p" disabled={originalDim.fromViewBox}>
              1080p (Fit)
            </option>
          </select>

          {originalDim.fromViewBox && (
            <p className="hint-text">
              SVG has no dimensions; using viewBox. Presets disabled.
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
              disabled={state.isRendering || !!renderedUrl}
              style={{ width: '100%' }}
            />
          </div>
        )}

        <div className="grid-3">
          <div className="input-group">
            <label htmlFor="duration">Duration (s)</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              min={1}
              disabled={state.isRendering || !!renderedUrl}
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
              disabled={state.isRendering || !!renderedUrl}
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
              disabled={state.isRendering || !!renderedUrl}
            />
          </div>
        </div>
      </section>

      <section className="config-section">
        <h2>3. Canvas</h2>
        <div className="input-group">
          <label htmlFor="bg-color">Background</label>
          <div className="color-picker-wrapper">
            <input
              type="color"
              id="bg-color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              disabled={state.isRendering || !!renderedUrl}
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              disabled={state.isRendering || !!renderedUrl}
              className="color-text-input"
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
            disabled={state.isRendering || !!renderedUrl}
          >
            <option value="optimal">Optimal (Fast)</option>
            <option value="high-fidelity">High Fidelity (Slow)</option>
          </select>
        </div>
      </section>

      <div className="render-actions">
        <button
          className="render-button"
          onClick={handleStartRender}
          disabled={!svgContent || state.isRendering || !!renderedUrl}
        >
          {state.isRendering ? 'Processing...' : 'Export MP4'}
        </button>
      </div>
    </aside>
  );
};
