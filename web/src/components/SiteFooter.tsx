import { FaGithub, FaNpm, FaDocker, FaBug, FaCodeBranch } from 'react-icons/fa';
import pkg from '../../package.json';
import { ECOSYSTEM_LINKS } from '../utils/constants';
import { trackEvent } from '../utils/analytics';
import './SiteFooter.scss';

export const SiteFooter = () => {
  const repoUrl = ECOSYSTEM_LINKS.github;

  const rawCommitSha =
    typeof process !== 'undefined'
      ? process.env?.NEXT_PUBLIC_COMMIT_SHA
      : undefined;

  const commitSha = rawCommitSha ? rawCommitSha.slice(0, 7) : '';

  const versionLabel = commitSha
    ? `v${pkg.version} (${commitSha})`
    : `v${pkg.version}`;

  const versionHref = commitSha
    ? `${repoUrl}/commit/${rawCommitSha}`
    : `${repoUrl}/releases`;

  return (
    <footer id="site-footer" className="site-footer" aria-label="Site footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="site-footer__title">
            SVG to Video Studio{' '}
            <a
              href={versionHref}
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer__version"
            >
              {versionLabel} ↗
            </a>
          </span>
          <span className="site-footer__meta">
            100% client-side rendering &middot; Released under the{' '}
            <a
              href={ECOSYSTEM_LINKS.license}
              target="_blank"
              rel="noopener noreferrer"
            >
              MIT License
            </a>
          </span>
        </div>

        <div className="site-footer__nav-column">
          <div className="site-footer__row site-footer__ecosystem">
            <span className="site-footer__label">Explore the Ecosystem</span>
            <nav className="site-footer__links" aria-label="Ecosystem links">
              <a
                href={ECOSYSTEM_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('click-source-code')}
              >
                <FaGithub size={14} /> GitHub ↗
              </a>
              <a
                href={ECOSYSTEM_LINKS.npm}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaNpm size={16} /> npm ↗
              </a>
              <a
                href={ECOSYSTEM_LINKS.docker}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDocker size={14} /> Docker Hub ↗
              </a>
              <a
                href={ECOSYSTEM_LINKS.mcpDocs}
                target="_blank"
                rel="noopener noreferrer"
              >
                MCP Registry ↗
              </a>
              <a
                href={ECOSYSTEM_LINKS.huggingface}
                target="_blank"
                rel="noopener noreferrer"
              >
                HuggingFace Space ↗
              </a>
              <a
                href={ECOSYSTEM_LINKS.glama}
                target="_blank"
                rel="noopener noreferrer"
              >
                Glama.ai MCP ↗
              </a>
            </nav>
          </div>

          <div className="site-footer__row site-footer__contribute">
            <span className="site-footer__label">
              Contribute &amp; Feedback
            </span>
            <nav
              className="site-footer__links"
              aria-label="Contribution and feedback links"
            >
              <a
                href={pkg.bugs.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('click-issue-report')}
              >
                <FaBug size={12} /> Bug or Suggest Improvement ↗
              </a>
              <a
                href={ECOSYSTEM_LINKS.contributing}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaCodeBranch size={12} /> Contributing Guide ↗
              </a>
            </nav>
          </div>
        </div>

        <a href="#top" className="site-footer__top" aria-label="Back to top">
          Back to top &uarr;
        </a>
      </div>
    </footer>
  );
};
