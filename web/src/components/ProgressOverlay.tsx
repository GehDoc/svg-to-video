import { Button } from './Button/Button';
import './ProgressOverlay.scss';

interface ProgressOverlayProps {
  status?: string;
  progress?: number;
  onCancel?: () => void;
  children?: React.ReactNode;
}

export const ProgressOverlay = ({
  status,
  progress,
  onCancel,
  children,
}: ProgressOverlayProps) => {
  return (
    <div className="progress-overlay">
      <div className="progress-header">
        <span className="status-text">{status || 'Ready'}</span>
        <div className="progress-actions">
          <div className={!onCancel ? 'invisible' : ''}>
            <Button variant="error" onClick={onCancel || (() => {})}>
              Cancel
            </Button>
          </div>
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
