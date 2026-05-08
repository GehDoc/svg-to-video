import { StudioContext } from '../context/StudioContext';
import { useContext } from 'react';
import { RendererMonitor } from './RendererMonitor';
import { ProgressOverlay } from './ProgressOverlay';
import { MetaDisplay } from './MetaDisplay';
import './RenderingView.scss';

export const RenderingView = () => {
  const {
    state,
    cancel,
    svgContent,
    originalDim,
    targetDim,
    rendererRef,
    backgroundColor,
  } = useContext(StudioContext)!;

  return (
    <div className="rendering-view">
      <RendererMonitor
        rendererRef={rendererRef}
        svgContent={svgContent}
        width={targetDim.width}
        height={targetDim.height}
        backgroundColor={backgroundColor}
        isRendering={state.isRendering}
      />

      <ProgressOverlay
        status={state.isRendering ? state.status : 'Ready to Export'}
        progress={state.isRendering ? state.progress : undefined}
        onCancel={state.isRendering ? cancel : undefined}
      >
        <MetaDisplay
          meta={state.meta}
          dimensions={{
            width: originalDim.width,
            height: originalDim.height,
            targetWidth: targetDim.width,
            targetHeight: targetDim.height,
          }}
        />
      </ProgressOverlay>
    </div>
  );
};
