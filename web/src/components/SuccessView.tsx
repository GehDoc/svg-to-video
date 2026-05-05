import { StudioContext } from '../context/StudioContext';
import { useContext } from 'react';
import { Button } from './Button/Button';
import './SuccessView.scss';

export const SuccessView = () => {
  const { fileName, fileSize, renderedUrl, setRenderedUrl, downloadResult } =
    useContext(StudioContext)!;

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
        <Button variant="primary" onClick={downloadResult}>
          Download MP4
        </Button>
        <Button variant="secondary" onClick={() => setRenderedUrl(null)}>
          Back to Studio
        </Button>
      </div>
    </div>
  );
};
