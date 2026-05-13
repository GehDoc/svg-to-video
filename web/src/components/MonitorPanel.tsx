import { type RendererHandle } from './SvgRenderer';
import { SuccessView } from './SuccessView';
import { RenderingView } from './RenderingView';
import { LandingView } from './LandingView';
import { type RenderState } from '../hooks/useRenderer';
import './MonitorPanel.scss';

interface MonitorPanelProps {
  svgContent: string | null;
  renderedUrl: string | null;
  state: RenderState;
  fileName: string;
  fileSize: string | null;
  onDownload: () => void;
  onBack: () => void;
  originalDim: { width: number; height: number };
  targetDim: { width: number; height: number };
  rendererRef: React.RefObject<RendererHandle | null>;
  backgroundColor: string;
  isTransparent: boolean;
  onCancel: () => void;
  onClearError: () => void;
}

export const MonitorPanel = ({
  svgContent,
  renderedUrl,
  state,
  fileName,
  fileSize,
  onDownload,
  onBack,
  originalDim,
  targetDim,
  rendererRef,
  backgroundColor,
  isTransparent,
  onCancel,
  onClearError,
}: MonitorPanelProps) => {
  return (
    <section className="monitor-panel">
      {renderedUrl ? (
        <SuccessView
          fileName={fileName}
          fileSize={fileSize}
          renderedUrl={renderedUrl}
          onDownload={onDownload}
          onBack={onBack}
        />
      ) : svgContent || state.isRendering ? (
        <RenderingView
          state={state}
          svgContent={svgContent}
          originalDim={originalDim}
          targetDim={targetDim}
          rendererRef={rendererRef}
          backgroundColor={backgroundColor}
          isTransparent={isTransparent}
          onCancel={onCancel}
          onClearError={onClearError}
        />
      ) : (
        <LandingView />
      )}
    </section>
  );
};
