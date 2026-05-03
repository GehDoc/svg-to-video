import './ErrorView.scss';

interface ErrorViewProps {
  message: string;
  onClose: () => void;
}

export const ErrorView = ({ message, onClose }: ErrorViewProps) => {
  return (
    <div className="error-container">
      <div className="error-card">
        <h3>Error</h3>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
