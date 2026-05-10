import './Header.scss';
import Logo from '../assets/logo.svg?react';
import { FaGithub } from 'react-icons/fa';
import pkg from '../../../package.json';

export const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">
        <Logo className="header-logo" width="24" height="24" />
        SVG to Video <small className="header-badge">STUDIO</small>
      </h1>

      <nav className="header-nav">
        <a
          href="https://github.com/GehDoc/svg-to-video"
          target="_blank"
          rel="noopener noreferrer"
          className="header-link"
          aria-label="GitHub Repository"
        >
          <FaGithub size={18} />
          <span className="header-version">v{pkg.version}</span>
        </a>
        <a
          href="https://opensource.org/licenses/MIT"
          target="_blank"
          rel="noopener noreferrer"
          className="header-link"
        >
          MIT License
        </a>
      </nav>
    </header>
  );
};
