import { useState, useEffect, useRef, type ChangeEvent } from 'react';
import SvgRenderer, { type RendererHandle } from './components/SvgRenderer';
import {
  useRenderer,
  parseSvgDimensions,
  calculateFinalDimensions,
  getBestCodec,
  type ResolutionPreset,
  type RenderSettings,
} from './hooks/useRenderer';
import './App.css';

function App() {
  const [isCompatible, setIsCompatible] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Settings State
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('animation.mp4');
  const [duration, setDuration] = useState(5);
  const [hold, setHold] = useState(0);
  const [fps, setFps] = useState(60);
  const [preset, setPreset] = useState<ResolutionPreset>('original');
  const [scale, setScale] = useState(1);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [codec, setCodec] = useState<string | null>(null);
  const [captureMethod, setCaptureMethod] = useState<
    'optimal' | 'high-fidelity'
  >('optimal');
  const [isDragging, setIsDragging] = useState(false);
  const [renderedUrl, setRenderedUrl] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const rendererRef = useRef<RendererHandle>(null);
  const { render, cancel, state } = useRenderer(
    rendererRef as React.RefObject<RendererHandle>
  );

  // Derived State for Preview
  let originalDim = { width: 0, height: 0, fromViewBox: false };
  let targetDim = { width: 0, height: 0 };
  if (svgContent) {
    try {
      originalDim = parseSvgDimensions(svgContent);
      targetDim = calculateFinalDimensions(
        originalDim.width,
        originalDim.height,
        originalDim.fromViewBox,
        { preset, scale }
      );
    } catch {
      /* ignore invalid svg for preview */
    }
  }

  // Update codec whenever target dimensions change
  useEffect(() => {
    if (targetDim.width > 0 && targetDim.height > 0) {
      getBestCodec(targetDim.width, targetDim.height)
        .then(setCodec)
        .catch(() => setCodec(null));
    }
  }, [targetDim.width, targetDim.height]);

  useEffect(() => {
    const checkCompatibility = () => {
      if (!('VideoEncoder' in window)) {
        setError(
          'Your browser does not support WebCodecs (VideoEncoder). Please use a modern version of Chrome, Edge, or Opera.'
        );
        setIsCompatible(false);
        return;
      }
      setIsCompatible(true);
    };
    checkCompatibility();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSvgContent(content);
      const baseName = file.name.replace(/\.svg$/i, '');
      setFileName(`${baseName}.mp4`);

      // Reset to original if it's viewBox-only
      if (parseSvgDimensions(content).fromViewBox) {
        setPreset('original');
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      processFile(file);
    }
  };

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
        // Get file size from blob
        const response = await fetch(url);
        const blob = await response.blob();
        const sizeMb = (blob.size / (1024 * 1024)).toFixed(2);
        setFileSize(`${sizeMb} MB`);
      }
    } catch {
      // Error handled by hook state
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

  if (isCompatible === false) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h1>❌ Unsupported Browser</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (isCompatible === null) {
    return <div className="error-container">Checking compatibility...</div>;
  }

  return (
    <div className="app-container">
      <header>
        <h1>
          <img
            src="/logo.svg"
            alt=""
            width="24"
            height="24"
            style={{ verticalAlign: 'middle', marginRight: '0.5rem' }}
          />
          SVG to Video{' '}
          <small
            style={{
              opacity: 0.5,
              fontSize: '0.6rem',
              marginLeft: '0.5rem',
              padding: '0.1rem 0.3rem',
              border: '1px solid currentColor',
              borderRadius: '3px',
            }}
          >
            STUDIO
          </small>
        </h1>
        <p>Zero-server high-fidelity rendering</p>
      </header>

      <main className="studio-layout">
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
                  {svgContent
                    ? 'Change SVG'
                    : 'Drop SVG here or click to upload'}
                </label>
                <div className="file-input-wrapper">
                  <input
                    type="file"
                    id="svg-upload"
                    accept=".svg"
                    onChange={handleFileChange}
                    disabled={state.isRendering}
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
                onChange={(e) => setPreset(e.target.value as ResolutionPreset)}
                disabled={state.isRendering || originalDim.fromViewBox}
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
                  disabled={state.isRendering}
                  style={{ width: '100%' }}
                />
              </div>
            )}

            <div className="grid-2">
              <div className="input-group">
                <label htmlFor="duration">Duration (s)</label>
                <input
                  type="number"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(parseFloat(e.target.value))}
                  min={1}
                  disabled={state.isRendering}
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
                  disabled={state.isRendering}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="fps">Frame Rate (FPS)</label>
              <input
                type="number"
                id="fps"
                value={fps}
                onChange={(e) => setFps(parseInt(e.target.value))}
                min={1}
                max={60}
                disabled={state.isRendering}
              />
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
                  disabled={state.isRendering}
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  disabled={state.isRendering}
                  className="color-text-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="capture-method">Capture Method</label>
              <select
                id="capture-method"
                value={captureMethod}
                onChange={(e) =>
                  setCaptureMethod(
                    e.target.value as 'optimal' | 'high-fidelity'
                  )
                }
                disabled={state.isRendering}
              >
                <option value="optimal">Optimal (Fast)</option>
                <option value="high-fidelity">High Fidelity (Slow)</option>
              </select>
              <p className="hint-text">
                {captureMethod === 'optimal'
                  ? 'Fast, curated property cloning.'
                  : 'Exhaustive computed style cloning.'}
              </p>
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

        <section className="monitor-panel">
          {renderedUrl ? (
            <div className="success-card">
              <div className="success-icon">✓</div>
              <h3>Render Complete</h3>
              <p className="success-meta">
                {fileName} • {fileSize}
              </p>
              <div className="success-preview">
                <video src={renderedUrl} controls autoPlay loop />
              </div>
              <div className="success-actions">
                <button className="render-button" onClick={downloadResult}>
                  Download MP4
                </button>
                <button
                  className="secondary-button"
                  onClick={() => setRenderedUrl(null)}
                >
                  Back to Studio
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="monitor-wrapper">
                <SvgRenderer ref={rendererRef} />
              </div>

              {state.isRendering ? (
                <div className="progress-overlay">
                  <div className="progress-status">
                    <span>{state.status}</span>
                    <span>{state.progress}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${state.progress}%` }}
                    ></div>
                  </div>

                  {state.meta && (
                    <div className="meta-grid">
                      <div className="meta-item">
                        <strong>Source</strong> {state.meta.originalSize}
                      </div>
                      <div className="meta-item">
                        <strong>Export</strong> {state.meta.finalSize}
                      </div>
                      <div className="meta-item">
                        <strong>Codec</strong> {state.meta.codec}
                      </div>
                      <div className="meta-item">
                        <strong>ETA</strong> {state.meta.eta}s
                      </div>
                      <div className="meta-item" style={{ textAlign: 'right' }}>
                        <button className="cancel-button" onClick={cancel}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {svgContent ? (
                    <div
                      className="progress-overlay"
                      style={{ background: 'rgba(15, 23, 42, 0.6)' }}
                    >
                      <div className="meta-grid">
                        <div className="meta-item">
                          <strong>Source</strong> {originalDim.width}x
                          {originalDim.height}
                        </div>
                        <div className="meta-item">
                          <strong>Export</strong> {targetDim.width}x
                          {targetDim.height}
                        </div>
                        <div className="meta-item">
                          <strong>Target Codec</strong>{' '}
                          {codec || 'Detecting...'}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        color: 'var(--text-muted)',
                        textAlign: 'center',
                      }}
                    >
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        style={{ opacity: 0.2, marginBottom: '1rem' }}
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <p>Upload an SVG to begin preview</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>
      </main>

      <footer>
        All processing happens locally in your browser. Files never leave your
        computer. |{' '}
        <a
          href="https://github.com/GehDoc/svg-to-video"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub Repository
        </a>
      </footer>
    </div>
  );
}

export default App;
