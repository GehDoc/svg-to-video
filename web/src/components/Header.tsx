import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import {
  FaBars,
  FaTimes,
  FaHeart,
  FaGithub,
  FaBug,
  FaCodeBranch,
} from 'react-icons/fa';
import Logo from '../assets/logo.svg?react';
import pkg from '../../package.json';
import { ECOSYSTEM_LINKS } from '../utils/constants';
import { trackEvent } from '../utils/analytics';
import { StarButton } from './StarButton';
import './Header.scss';

export interface HeaderProps {
  onHome?: () => void;
}

export const Header = ({ onHome }: HeaderProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClickLogo = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsDrawerOpen(false);
    if (onHome) {
      onHome();
    } else {
      window.location.reload();
    }
  };

  const handleKeyDownLogo = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsDrawerOpen(false);
      if (onHome) {
        onHome();
      } else {
        window.location.reload();
      }
    }
  };

  const handleNavLinkClick = () => {
    setIsDrawerOpen(false);
  };

  return (
    <header className="site-header" ref={headerRef}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="site-header__bar">
        <div className="header-title">
          <a
            role="button"
            tabIndex={0}
            aria-label="SVG to Video Home"
            className="header-title-link"
            onClick={handleClickLogo}
            onKeyDown={handleKeyDownLogo}
          >
            <Logo className="header-logo" width="24" height="24" />
            <span>SVG to Video</span>
            <small className="header-badge">STUDIO</small>
          </a>
        </div>

        <nav className="jump-nav" aria-label="Page navigation">
          <a href="#top">Studio</a>
          <a href="#how-to-convert">How It Works</a>
          <a href="#formats">Formats</a>
          <a href="#automation">CLI &amp; MCP</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="header-actions">
          <StarButton className="header-star-btn" location="header" />

          <a
            href={ECOSYSTEM_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            className="header-github-btn"
            aria-label="GitHub repository"
            title="GitHub repository ↗"
            onClick={() => trackEvent('click-source-code')}
          >
            <FaGithub size={18} />
          </a>

          <a
            href={pkg.funding.url}
            target="_blank"
            rel="noopener noreferrer"
            className="header-sponsor-btn"
            title="Sponsor me on GitHub ↗"
            aria-label="Sponsor me on GitHub"
            onClick={() => {
              trackEvent('click-sponsor', { location: 'header' });
            }}
          >
            <FaHeart className="icon-heart" />
            <span className="header-sponsor-btn__label">Sponsor me</span>
          </a>

          <button
            type="button"
            className="header-menu-btn"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            aria-label={isDrawerOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-nav-drawer"
          >
            {isDrawerOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav-drawer"
        className={`mobile-drawer ${isDrawerOpen ? 'is-open' : ''}`}
        aria-label="Mobile navigation"
      >
        <div className="mobile-drawer__section">
          <a href="#top" onClick={handleNavLinkClick}>
            Studio
          </a>
          <a href="#how-to-convert" onClick={handleNavLinkClick}>
            How It Works
          </a>
          <a href="#formats" onClick={handleNavLinkClick}>
            Supported Formats
          </a>
          <a href="#automation" onClick={handleNavLinkClick}>
            CLI &amp; MCP Automation
          </a>
          <a href="#faq" onClick={handleNavLinkClick}>
            FAQ
          </a>
        </div>

        <div className="mobile-drawer__divider" />

        <div className="mobile-drawer__section">
          <a
            href={ECOSYSTEM_LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent('click-source-code');
              handleNavLinkClick();
            }}
          >
            <FaGithub /> GitHub Repository ↗
          </a>
          <a
            href={pkg.funding.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent('click-sponsor', { location: 'mobile-drawer' });
              handleNavLinkClick();
            }}
          >
            <FaHeart className="icon-heart" /> Sponsor me on GitHub ↗
          </a>
          <a
            href={pkg.bugs.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackEvent('click-issue-report');
              handleNavLinkClick();
            }}
          >
            <FaBug /> Bug or Suggest Improvement ↗
          </a>
          <a
            href={ECOSYSTEM_LINKS.contributing}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleNavLinkClick}
          >
            <FaCodeBranch /> Contributing Guide ↗
          </a>
        </div>
      </nav>
    </header>
  );
};
