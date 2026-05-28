import Logo from '../assets/logo.svg?react';
import './SeoFallback.scss';

interface SeoFallbackProps {
  isHidden?: boolean;
}

export const SeoFallback = ({ isHidden }: SeoFallbackProps) => {
  return (
    <div className={`seo-fallback ${isHidden ? 'is-hidden' : ''}`}>
      <div className="splash-content">
        <div className="splash-logo" aria-hidden="true">
          <Logo />
        </div>
        <h1>
          SVG to Video <small className="badge">STUDIO</small>
        </h1>
        <p className="description">
          Convert SVG animations to high-quality MP4, WebM, MKV, or MOV videos
          with alpha-channel transparency using <strong>WebCodecs</strong>{' '}
          directly in your browser.
        </p>

        <div className="loader">
          <div className="loader-bar" />
          <p>Initializing Studio...</p>
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
