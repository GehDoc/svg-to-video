import { StudioContext } from '../context/StudioContext';
import { useContext } from 'react';
import { Button } from './Button/Button';
import './SuccessView.scss';

export const SuccessView = () => {
  const { fileName, fileSize, renderedUrl, setRenderedUrl, downloadResult } =
    useContext(StudioContext)!;

  const handleDownload = () => {
    if (typeof umami !== 'undefined') {
      umami.track('download-mp4');
    }
    downloadResult();
  };

  const handleBack = () => {
    if (typeof umami !== 'undefined') {
      umami.track('back-to-studio');
    }
    setRenderedUrl(null);
  };

  return (
    <div className="success-card">
      <div className="success-icon">✓</div>
      <h3>Render Complete</h3>
      <p className="success-meta">
        {fileName} • {fileSize}
      </p>
      <div className="success-preview">
        <video src={renderedUrl!} controls autoPlay loop />
      </div>
      <div className="success-actions">
        <Button variant="primary" onClick={handleDownload}>
          Download
        </Button>
        <Button variant="secondary" onClick={handleBack}>
          Back to Studio
        </Button>
      </div>
    </div>
  );
};
