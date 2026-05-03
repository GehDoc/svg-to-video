import { StudioContext } from '../context/StudioContext';
import { useContext } from 'react';
import { RendererMonitor } from './RendererMonitor';
import { ProgressOverlay } from './ProgressOverlay';
import { MetaDisplay } from './MetaDisplay';
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
          {state.meta && <MetaDisplay meta={state.meta} />}
        </ProgressOverlay>
      ) : (
        <>
          {svgContent && (
            <ProgressOverlay>
              <MetaDisplay
                dimensions={{
                  width: originalDim.width,
                  height: originalDim.height,
                  targetWidth: targetDim.width,
                  targetHeight: targetDim.height,
                }}
              />
            </ProgressOverlay>
          )}
        </>
      )}
    </>
  );
};
