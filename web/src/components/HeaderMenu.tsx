import { useState, useRef, useEffect } from 'react';
import {
  FaBars,
  FaGithub,
  FaBug,
  FaCoffee,
  FaTag,
  FaBalanceScale,
  FaHeart,
} from 'react-icons/fa';
import { FUNDING_URL } from '../../../shared/funding';
import pkg from '../../../package.json';
import './HeaderMenu.scss';

export const HeaderMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="header-menu-container" ref={menuRef}>
      <a
        href={FUNDING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="header-sponsor-btn"
      >
        <FaHeart className="icon-heart" /> Sponsor
      </a>

      <button
        type="button"
        className="header-burger-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <FaBars size={20} />
      </button>

      {isOpen && (
        <div className="header-dropdown-card">
          <div className="header-menu-section">
            <span className="header-menu-label">Help & Feedback</span>
            <a
              href="https://github.com/GehDoc/svg-to-video/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="header-menu-link"
            >
              <div className="meta-left">
                <FaBug /> Report an Issue
              </div>
            </a>
          </div>

          <div className="header-menu-section">
            <span className="header-menu-label">Project</span>
            <a
              href="https://github.com/GehDoc/svg-to-video"
              target="_blank"
              rel="noopener noreferrer"
              className="header-menu-link"
            >
              <div className="meta-left">
                <FaGithub /> View Source Code
              </div>
            </a>
            <a
              href={FUNDING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="header-menu-link"
            >
              <div className="meta-left">
                <FaCoffee /> Buy me a Coffee
              </div>
              <span className="header-link-arrow">↗</span>
            </a>
          </div>

          <div className="header-menu-section">
            <span className="header-menu-label">About</span>
            <a
              href="https://github.com/GehDoc/svg-to-video/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="header-meta-link"
            >
              <div className="meta-left">
                <FaTag /> Version
              </div>
              <span className="header-version-tag">v{pkg.version} ↗</span>
            </a>
            <a
              href="https://github.com/GehDoc/svg-to-video/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="header-meta-link"
            >
              <div className="meta-left">
                <FaBalanceScale /> License
              </div>
              <span className="header-version-tag">MIT ↗</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
