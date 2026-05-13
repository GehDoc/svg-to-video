import { Button } from './Button/Button';
import './SuccessView.scss';

interface SuccessViewProps {
  fileName: string;
  fileSize: string | null;
  renderedUrl: string;
  onDownload: () => void;
  onBack: () => void;
}

export const SuccessView = ({
  fileName,
  fileSize,
  renderedUrl,
  onDownload,
  onBack,
}: SuccessViewProps) => {
  return (
    <div className="success-card">
      <div className="success-icon">✓</div>
      <h3>Render Complete</h3>
      <p className="success-meta">
        {fileName} • {fileSize}
      </p>
      <div className="success-preview">
        <video src={renderedUrl} controls autoPlay loop />
      </div>
      <div className="success-actions">
        <Button variant="primary" onClick={onDownload}>
          Download
        </Button>
        <Button variant="secondary" onClick={onBack}>
          Back to Studio
        </Button>
      </div>
    </div>
  );
};
