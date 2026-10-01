import Logo from '../assets/logo.svg?react';
import { ECOSYSTEM_LINKS } from '../utils/constants';
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
          Convert SVG animations to high-quality videos (MP4, WebM, MKV, MOV) or
          optimized animated images (aPNG, GIF) with perfect alpha-channel
          transparency and custom metadata directly in your browser, via CLI, or
          through Model Context Protocol (MCP) AI agent integrations.
        </p>

        <div className="loader">
          <div className="loader-bar" />
          <p>Initializing Studio...</p>
        </div>

        <div className="splash-links">
          <a
            href={ECOSYSTEM_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
          <span className="separator">•</span>
          <a
            href={ECOSYSTEM_LINKS.npm}
            target="_blank"
            rel="noopener noreferrer"
          >
            npm Package
          </a>
          <span className="separator">•</span>
          <a
            href={ECOSYSTEM_LINKS.docker}
            target="_blank"
            rel="noopener noreferrer"
          >
            Docker Hub
          </a>
          <span className="separator">•</span>
          <a
            href={ECOSYSTEM_LINKS.mcpDocs}
            target="_blank"
            rel="noopener noreferrer"
          >
            MCP Registry Server
          </a>
          <span className="separator">•</span>
          <a
            href={ECOSYSTEM_LINKS.license}
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
