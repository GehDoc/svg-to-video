import { FaLock } from 'react-icons/fa';
import './LandingView.scss';

export const LandingView = () => {
  return (
    <div className="monitor-content">
      <div className="upload-placeholder">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <h2>Upload an SVG to begin preview</h2>
      </div>

      <footer className="studio-footer">
        <p>
          <FaLock size={12} className="footer-icon" /> Local processing only —
          files never leave your browser. Released under the MIT License.
        </p>
      </footer>
    </div>
  );
};
