import './SeoFallback.scss';

export const SeoFallback = () => {
  return (
    <div className="seo-fallback">
      <div className="splash-content">
        <div className="splash-logo" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5e61e6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            <polyline points="7 10 5 12 7 14" />
            <polyline points="10 10 12 12 10 14" />
          </svg>
        </div>
        <h1>
          SVG to Video <small className="badge">STUDIO</small>
        </h1>
        <p className="description">
          Convert SVG animations to high-quality MP4, WebM, MKV, or MOV videos
          with alpha-channel transparency directly in your browser.
        </p>

        <div className="loader">
          <div className="loader-bar" />
          <p>Initializing WebCodecs Studio...</p>
        </div>

        <div className="splash-links">
          <a
            href="https://github.com/GehDoc/svg-to-video"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
          <span className="separator">•</span>
          <a
            href="https://github.com/GehDoc/svg-to-video/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT License
          </a>
        </div>
      </div>
    </div>
  );
};
