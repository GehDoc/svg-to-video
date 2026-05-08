import { Button } from './Button/Button';
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
        <p className="error-message">{message}</p>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};
