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

  const rendererRef = useRef<RendererHandle>(null);
  const { render, cancel, state } = useRenderer(
    rendererRef as React.RefObject<RendererHandle>
  );

  // Derived State for Preview
  let originalDim = { width: 0, height: 0 };
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
      /* ignore invalid svg for preview */
    }
  }

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
      const reader = new FileReader();
      reader.onload = (event) => {
        setSvgContent(event.target?.result as string);
        const baseName = file.name.replace(/\.svg$/i, '');
        setFileName(`${baseName}.mp4`);
      };
      reader.readAsText(file);
    }
  };

  const handleStartRender = async () => {
    if (!svgContent) return;

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
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // Error handled by hook state
    }
  };

  if (isCompatible === false) {
    return (
      <div className="error-container">
        <h1>❌ Unsupported Browser</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (isCompatible === null) {
    return <div>Checking compatibility...</div>;
  }

  return (
    <div className="app-container">
      <header>
        <h1>SVG to Video</h1>
        <p>High-fidelity, client-side MP4 rendering</p>
      </header>

      <main>
        <div className="settings-card">
          <section className="input-group">
            <label htmlFor="svg-upload">1. Upload SVG</label>
            <input
              type="file"
              id="svg-upload"
              accept=".svg"
              onChange={handleFileChange}
              disabled={state.isRendering}
            />
          </section>

          <div className="grid-2">
            <section className="input-group">
              <label htmlFor="resolution">2. Resolution</label>
              <select
                id="resolution"
                value={preset}
                onChange={(e) => setPreset(e.target.value as ResolutionPreset)}
                disabled={state.isRendering}
              >
                <option value="original">Original SVG Size</option>
                <option value="720p">720p (1280x720)</option>
                <option value="1080p">1080p (1920x1080)</option>
              </select>
            </section>

            {preset === 'original' && (
              <section className="input-group">
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
                />
              </section>
            )}
          </div>

          <div className="grid-2">
            <section className="input-group">
              <label htmlFor="duration">3. Duration (sec)</label>
              <input
                type="number"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                min={1}
                disabled={state.isRendering}
              />
            </section>

            <section className="input-group">
              <label htmlFor="hold">Hold End (sec)</label>
              <input
                type="number"
                id="hold"
                value={hold}
                onChange={(e) => setHold(parseFloat(e.target.value))}
                min={0}
                step={0.5}
                disabled={state.isRendering}
              />
            </section>
          </div>

          <section className="input-group">
            <label htmlFor="fps">4. FPS</label>
            <input
              type="number"
              id="fps"
              value={fps}
              onChange={(e) => setFps(parseInt(e.target.value))}
              min={1}
              max={60}
              disabled={state.isRendering}
            />
          </section>

          <section className="input-group">
            <label htmlFor="bg-color">5. Background Color</label>
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
          </section>

          <section className="input-group">
            <label htmlFor="capture-method">6. Capture Method</label>
            <select
              id="capture-method"
              value={captureMethod}
              onChange={(e) =>
                setCaptureMethod(e.target.value as 'optimal' | 'high-fidelity')
              }
              disabled={state.isRendering}
            >
              <option value="optimal">Optimal (Fast)</option>
              <option value="high-fidelity">High Fidelity (Slow)</option>
            </select>
            <p className="hint-text">
              {captureMethod === 'optimal'
                ? 'Faster, but might miss complex CSS animations.'
                : 'Exhaustive style cloning. Captures everything, but very slow.'}
            </p>
          </section>

          {svgContent && !state.isRendering && (
            <div className="meta-info preview-info">
              <p>
                <strong>Detected SVG:</strong> {originalDim.width}x
                {originalDim.height}
              </p>
              <p>
                <strong>Target Video:</strong> {targetDim.width}x
                {targetDim.height}
              </p>
              <p>
                <strong>Best Codec:</strong> {codec || 'Detecting...'}
              </p>
            </div>
          )}

          {state.isRendering ? (
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${state.progress}%` }}
                ></div>
              </div>
              <p className="status-text">{state.status}</p>

              {state.meta && (
                <div className="meta-info">
                  <p>
                    <strong>Original Size:</strong> {state.meta.originalSize}
                  </p>
                  <p>
                    <strong>Target Size:</strong> {state.meta.finalSize}
                  </p>
                  <p>
                    <strong>Codec:</strong> {state.meta.codec}
                  </p>
                </div>
              )}

              <button className="cancel-button" onClick={cancel}>
                Cancel Render
              </button>
            </div>
          ) : (
            <button
              className="render-button"
              onClick={handleStartRender}
              disabled={!svgContent}
            >
              Render & Download MP4
            </button>
          )}
        </div>
      </main>

      <SvgRenderer ref={rendererRef} />

      <footer>
        <p>Zero servers involved. Your privacy is respected.</p>
      </footer>
    </div>
  );
}

export default App;
