import type { RendererHandle } from './SvgRenderer';
import { RendererMonitor } from './RendererMonitor';
import { ProgressOverlay } from './ProgressOverlay';
import { MetaDisplay } from './MetaDisplay';
import { ErrorView } from './ErrorView';
import { type RenderState } from '../hooks/useRenderer';
import './RenderingView.scss';

interface RenderingViewProps {
  state: RenderState;
  svgContent: string | null;
  originalDim: { width: number; height: number };
  targetDim: { width: number; height: number };
  rendererRef: React.RefObject<RendererHandle | null>;
  backgroundColor: string;
  isTransparent: boolean;
  needsColorKeying: boolean;
  onCancel: () => void;
  onClearError: () => void;
}

export const RenderingView = ({
  state,
  svgContent,
  originalDim,
  targetDim,
  rendererRef,
  backgroundColor,
  isTransparent,
  needsColorKeying,
  onCancel,
  onClearError,
}: RenderingViewProps) => {
  const isError = state.status.startsWith('Error:');

  return (
    <div className="rendering-view">
      {isError ? (
        <ErrorView message={state.status} onClose={onClearError} />
      ) : (
        <>
          <RendererMonitor
            rendererRef={rendererRef}
            svgContent={svgContent}
            width={targetDim.width}
            height={targetDim.height}
            backgroundColor={backgroundColor}
            isTransparent={isTransparent}
            needsColorKeying={needsColorKeying}
            isRendering={state.isRendering}
          />

          <ProgressOverlay
            status={state.isRendering ? state.status : 'Ready to Export'}
            progress={state.isRendering ? state.progress : undefined}
            onCancel={state.isRendering ? onCancel : undefined}
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
        </>
      )}
    </div>
  );
};
