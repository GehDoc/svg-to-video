import { type RefObject } from 'react';
import SvgRenderer, { type RendererHandle } from './SvgRenderer';
import './RendererMonitor.scss';

export const RendererMonitor = ({
  rendererRef,
}: {
  rendererRef: RefObject<RendererHandle | null>;
}) => {
  return (
    <div className="monitor-wrapper">
      <SvgRenderer ref={rendererRef} />
    </div>
  );
};
