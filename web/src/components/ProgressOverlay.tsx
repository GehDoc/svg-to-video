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
      {status && progress !== undefined && onCancel && (
        <div className="progress-status">
          <span>{status}</span>
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <span>{progress}%</span>
        </div>
      )}
      {progress !== undefined && (
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      {children}
    </div>
  );
};
