import {
  FaGithub,
  FaBug,
  FaCoffee,
  FaTag,
  FaBalanceScale,
} from 'react-icons/fa';
import pkg from '../../package.json';
import './HeaderDropdown.scss';

export const HeaderDropdown = () => {
  const repoUrl = pkg.repository.url
    .replace(/^git\+/, '')
    .replace(/\.git$/, '');

  return (
    <div className="header-dropdown-card">
      <div className="header-menu-section">
        <span className="header-menu-label">Help & Feedback</span>
        <a
          href={pkg.bugs.url}
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
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="header-menu-link"
        >
          <div className="meta-left">
            <FaGithub /> View Source Code
          </div>
        </a>
        <a
          href={pkg.funding.url}
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
          href={`${repoUrl}/releases`}
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
          href={`${repoUrl}/blob/main/LICENSE`}
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
  );
};
