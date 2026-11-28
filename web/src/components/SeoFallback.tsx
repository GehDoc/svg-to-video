import { FaGithub, FaNpm, FaDocker } from 'react-icons/fa';
import { SiModelcontextprotocol, SiHuggingface } from 'react-icons/si';
import Logo from '../assets/logo.svg?react';
import { ECOSYSTEM_LINKS } from '../utils/constants';
import './SeoFallback.scss';

interface SeoFallbackProps {
  isHidden?: boolean;
}

const GlamaIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </svg>
);

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
          optimized animated images (aPNG, GIF) with granular quality and
          bitrate control, perfect alpha-channel transparency, and custom
          metadata directly in your browser, via CLI, or through Model Context
          Protocol (MCP) AI agent integrations.
        </p>

        <div className="loader">
          <div className="loader-bar" />
        </div>

        <div className="splash-links">
          <a
            href={ECOSYSTEM_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="splash-link--icon"
            aria-label="View on GitHub"
            title="GitHub Repository"
          >
            <FaGithub size={20} />
          </a>
          <a
            href={ECOSYSTEM_LINKS.npm}
            target="_blank"
            rel="noopener noreferrer"
            className="splash-link--icon"
            aria-label="View on npm"
            title="npm Package"
          >
            <FaNpm size={22} />
          </a>
          <a
            href={ECOSYSTEM_LINKS.docker}
            target="_blank"
            rel="noopener noreferrer"
            className="splash-link--icon"
            aria-label="View on Docker Hub"
            title="Docker Hub Image"
          >
            <FaDocker size={20} />
          </a>
          <a
            href={ECOSYSTEM_LINKS.mcpDocs}
            target="_blank"
            rel="noopener noreferrer"
            className="splash-link--icon"
            aria-label="View on Model Context Protocol Registry"
            title="MCP Registry Server"
          >
            <SiModelcontextprotocol size={18} />
          </a>
          <a
            href={ECOSYSTEM_LINKS.huggingface}
            target="_blank"
            rel="noopener noreferrer"
            className="splash-link--icon"
            aria-label="View on HuggingFace Spaces"
            title="HuggingFace Space Playground"
          >
            <SiHuggingface size={20} />
          </a>
          <a
            href={ECOSYSTEM_LINKS.glama}
            target="_blank"
            rel="noopener noreferrer"
            className="splash-link--icon"
            aria-label="View on Glama.ai"
            title="Glama.ai MCP Playground"
          >
            <GlamaIcon size={19} />
          </a>
          <span className="separator">•</span>
          <a
            href={ECOSYSTEM_LINKS.license}
            target="_blank"
            rel="noopener noreferrer"
            className="splash-link--text"
          >
            MIT License
          </a>
        </div>
      </div>
    </div>
  );
};
