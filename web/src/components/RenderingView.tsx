import { StudioContext } from '../context/StudioContext';
import { useContext } from 'react';
import { RendererMonitor } from './RendererMonitor';
import { ProgressOverlay } from './ProgressOverlay';
import './RenderingView.scss';

export const RenderingView = () => {
  const { state, cancel, svgContent, originalDim, targetDim, rendererRef } =
    useContext(StudioContext)!;

  return (
    <>
      <RendererMonitor rendererRef={rendererRef} />

      {state.isRendering ? (
        <ProgressOverlay
          status={state.status}
          progress={state.progress}
          onCancel={cancel}
        >
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
        </ProgressOverlay>
      ) : (
        <>
          {svgContent && (
            <ProgressOverlay>
              <div className="meta-grid">
                <div className="meta-item">
                  <strong>Source</strong> {originalDim.width}x
                  {originalDim.height}
                </div>
                <div className="meta-item">
                  <strong>Export</strong> {targetDim.width}x{targetDim.height}
                </div>
              </div>
            </ProgressOverlay>
          )}
        </>
      )}
    </>
  );
};
