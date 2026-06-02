import { type RefObject } from 'react';
import SvgRenderer, { type RendererHandle } from './SvgRenderer';

export const RendererMonitor = ({
  rendererRef,
  svgContent,
  width,
  height,
  backgroundColor,
  isTransparent,
  isRendering,
}: {
  rendererRef: RefObject<RendererHandle | null>;
  svgContent?: string | null;
  width?: number;
  height?: number;
  backgroundColor?: string;
  isTransparent?: boolean;
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
        isTransparent={isTransparent}
        isRendering={isRendering}
      />
    </div>
  );
};
