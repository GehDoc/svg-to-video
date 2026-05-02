import { FaGithub } from 'react-icons/fa';
import pkg from '../../../package.json';
import './LandingView.css';

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
          style={{ opacity: 0.5, marginBottom: '1rem' }}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p>Upload an SVG to begin preview</p>
      </div>

      <footer className="studio-footer">
        <p>Local processing only. Files never leave your browser.</p>
        <p className="legal-disclaimer">
          Licensed under{' '}
          <a
            href="https://opensource.org/licenses/MIT"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT
          </a>
          . Software provided "as is", without warranty of any kind.
        </p>
        <a
          href="https://github.com/GehDoc/svg-to-video"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <FaGithub size={16} /> <span>v{pkg.version}</span>
        </a>
      </footer>
    </div>
  );
};
