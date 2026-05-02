import { StudioContext } from '../context/StudioContext';
import { useContext } from 'react';
import { RendererMonitor } from './RendererMonitor';
import './RenderingView.scss';

export const RenderingView = () => {
  const { state, cancel, svgContent, originalDim, targetDim, rendererRef } =
    useContext(StudioContext)!;

  return (
    <>
      <RendererMonitor rendererRef={rendererRef} />

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
          {svgContent && (
            <div className="progress-overlay">
              <div className="meta-grid">
                <div className="meta-item">
                  <strong>Source</strong> {originalDim.width}x
                  {originalDim.height}
                </div>
                <div className="meta-item">
                  <strong>Export</strong> {targetDim.width}x{targetDim.height}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
