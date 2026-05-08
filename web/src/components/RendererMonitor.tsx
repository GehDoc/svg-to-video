import { type RefObject } from 'react';
import SvgRenderer, { type RendererHandle } from './SvgRenderer';
import './RendererMonitor.scss';

export const RendererMonitor = ({
  rendererRef,
  svgContent,
  width,
  height,
  backgroundColor,
  isRendering,
}: {
  rendererRef: RefObject<RendererHandle | null>;
  svgContent?: string | null;
  width?: number;
  height?: number;
  backgroundColor?: string;
  isRendering?: boolean;
}) => {
  return (
    <div className="monitor-wrapper">
      <SvgRenderer
        ref={rendererRef}
        svgContent={svgContent}
        width={width}
        height={height}
        backgroundColor={backgroundColor}
        isRendering={isRendering}
      />
    </div>
  );
};
