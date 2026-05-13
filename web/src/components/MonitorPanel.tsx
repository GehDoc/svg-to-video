import { StudioContext } from '../context/StudioContext';
import { useContext } from 'react';
import { SuccessView } from './SuccessView';
import { RenderingView } from './RenderingView';
import { LandingView } from './LandingView';
import './MonitorPanel.scss';

export const MonitorPanel = () => {
  const {
    svgContent,
    renderedUrl,
    state,
    fileName,
    fileSize,
    downloadResult,
    setRenderedUrl,
    format,
    isTransparent,
  } = useContext(StudioContext)!;

  const handleDownload = () => {
    if (typeof umami !== 'undefined') {
      umami.track('download-result', { format, isTransparent });
    }
    downloadResult();
  };

  const handleBack = () => {
    if (typeof umami !== 'undefined') {
      umami.track('back-to-studio', { format, isTransparent });
    }
    setRenderedUrl(null);
  };

  return (
    <section className="monitor-panel">
      {renderedUrl ? (
        <SuccessView
          fileName={fileName}
          fileSize={fileSize}
          renderedUrl={renderedUrl}
          onDownload={handleDownload}
          onBack={handleBack}
        />
      ) : svgContent || state.isRendering ? (
        <RenderingView />
      ) : (
        <LandingView />
      )}
    </section>
  );
};
