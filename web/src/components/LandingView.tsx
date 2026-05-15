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
        <p>Local processing only. Files never leave your browser.</p>
        <p className="footer-links">
          <a
            href="https://github.com/GehDoc/svg-to-video/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
          {' • '}
          <a
            href="https://github.com/GehDoc/svg-to-video/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT License
          </a>
          {' • '}
          <a href="https://umami.is" target="_blank" rel="noopener noreferrer">
            Umami Analytics
          </a>
        </p>
        <p className="legal-disclaimer">
          Software provided "as is", without warranty of any kind.
        </p>
      </footer>
    </div>
  );
};
