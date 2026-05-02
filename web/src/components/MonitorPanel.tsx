import { StudioContext } from '../context/StudioContext';
import { useContext } from 'react';
import { SuccessView } from './SuccessView';
import { RenderingView } from './RenderingView';
import { LandingView } from './LandingView';

export const MonitorPanel = () => {
  const { svgContent, renderedUrl, state } = useContext(StudioContext)!;

  return (
    <section className="monitor-panel">
      {renderedUrl ? (
        <SuccessView />
      ) : svgContent || state.isRendering ? (
        <RenderingView />
      ) : (
        <LandingView />
      )}
    </section>
  );
};
