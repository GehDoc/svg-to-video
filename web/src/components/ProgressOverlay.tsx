import { Button } from './Button/Button';
import { FaLayerGroup } from 'react-icons/fa';
import './ProgressOverlay.scss';

interface ProgressOverlayProps {
  status?: string;
  progress?: number;
  onCancel?: () => void;
  onOpenSamples?: () => void;
  children?: React.ReactNode;
}

export const ProgressOverlay = ({
  status,
  progress,
  onCancel,
  onOpenSamples,
  children,
}: ProgressOverlayProps) => {
  return (
    <div className="progress-overlay">
      <div className="progress-header">
        <span className="status-text">{status || 'Ready'}</span>
        <div className="progress-actions">
          {onCancel ? (
            <Button variant="error" onClick={onCancel}>
              Cancel
            </Button>
          ) : onOpenSamples ? (
            <Button
              variant="secondary"
              className="progress-samples-btn"
              onClick={onOpenSamples}
              type="button"
              aria-label="Browse sample SVG animations"
            >
              <FaLayerGroup size={11} className="btn-icon" /> Samples
            </Button>
          ) : (
            <div className="invisible">
              <Button variant="error">Cancel</Button>
            </div>
          )}
        </div>
        <span className="progress-percentage">
          {progress !== undefined ? `${progress}%` : '--%'}
        </span>
      </div>

      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress ?? 0}%` }}
        ></div>
      </div>

      <div className="children-container">{children}</div>
    </div>
  );
};
