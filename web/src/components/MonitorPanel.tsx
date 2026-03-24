import { StudioContext } from '../context/StudioContext';
import { useContext } from 'react';
import SvgRenderer from './SvgRenderer';
import { FaGithub } from 'react-icons/fa';
import pkg from '../../../package.json';

export const MonitorPanel = () => {
  const {
    svgContent,
    fileName,
    fileSize,
    renderedUrl,
    setRenderedUrl,
    originalDim,
    targetDim,
    state,
    cancel,
    downloadResult,
    rendererRef,
  } = useContext(StudioContext)!;

  return (
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
                <button className="cancel-button" onClick={cancel}>
                  Cancel
                </button>
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
                  </div>
                </div>
              ) : (
                <div
                  style={{ color: 'var(--text-muted)', textAlign: 'center' }}
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
                  <div
                    className="footer-mini"
                    style={{ borderTop: 'none', marginTop: '2rem' }}
                  >
                    <p>
                      Local processing only. Files never leave your browser.
                    </p>
                    <a
                      href="https://github.com/GehDoc/svg-to-video"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="github-link"
                    >
                      <FaGithub size={16} /> <span>v{pkg.version}</span>
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
};
