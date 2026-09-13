import { type ChangeEvent, type DragEvent } from 'react';
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
  mimeType: string;
  format?: string;
  onDownload: () => void;
  onBack: () => void;
  originalDim: { width: number; height: number };
  targetDim: { width: number; height: number };
  rendererRef: React.RefObject<RendererHandle | null>;
  backgroundColor: string;
  isTransparent: boolean;
  onCancel: () => void;
  onClearError: () => void;
  isDragging?: boolean;
  onIsDraggingChange?: (dragging: boolean) => void;
  onFileChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onDrop?: (e: DragEvent) => void;
}

export const MonitorPanel = ({
  svgContent,
  renderedUrl,
  state,
  fileName,
  fileSize,
  mimeType,
  format,
  onDownload,
  onBack,
  originalDim,
  targetDim,
  rendererRef,
  backgroundColor,
  isTransparent,
  onCancel,
  onClearError,
  isDragging,
  onIsDraggingChange,
  onFileChange,
  onDrop,
}: MonitorPanelProps) => {
  return (
    <section className="monitor-panel">
      {renderedUrl ? (
        <SuccessView
          fileName={fileName}
          fileSize={fileSize}
          renderedUrl={renderedUrl}
          mimeType={mimeType}
          format={format}
          isTransparent={isTransparent}
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
        <LandingView
          isDragging={isDragging}
          onIsDraggingChange={onIsDraggingChange}
          onFileChange={onFileChange}
          onDrop={onDrop}
        />
      )}
    </section>
  );
};
