import {
  FaGithub,
  FaBug,
  FaCoffee,
  FaTag,
  FaBalanceScale,
} from 'react-icons/fa';
import { trackEvent } from '../utils/analytics';
import pkg from '../../package.json';
import { Dropdown } from './Dropdown/Dropdown';

export const HeaderDropdown = () => {
  const repoUrl = pkg.repository.url
    .replace(/^git\+/, '')
    .replace(/\.git$/, '');

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

  const sections = [
    {
      label: 'Help & Feedback',
      items: [
        {
          label: 'Report an Issue',
          href: pkg.bugs.url,
          target: '_blank',
          rel: 'noopener noreferrer',
          icon: <FaBug />,
          onClick: () => {
            trackEvent('click-issue-report');
          },
        },
      ],
    },
    {
      label: 'Project',
      items: [
        {
          label: 'View Source Code',
          href: repoUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          icon: <FaGithub />,
          onClick: () => {
            trackEvent('click-source-code');
          },
        },
        {
          label: 'Buy me a Coffee',
          href: pkg.funding.url,
          target: '_blank',
          rel: 'noopener noreferrer',
          icon: <FaCoffee />,
          rightElement: <span className="dropdown-arrow">↗</span>,
          onClick: () => {
            trackEvent('click-sponsor', { location: 'dropdown' });
          },
        },
      ],
    },
    {
      label: 'About',
      items: [
        {
          label: 'Version',
          href: versionHref,
          target: '_blank',
          rel: 'noopener noreferrer',
          icon: <FaTag />,
          isMeta: true,
          rightElement: (
            <span className="dropdown-version-tag">
              {versionLabel} <span className="dropdown-arrow">↗</span>
            </span>
          ),
          onClick: () => {},
        },
        {
          label: 'License',
          href: `${repoUrl}/blob/main/LICENSE`,
          target: '_blank',
          rel: 'noopener noreferrer',
          icon: <FaBalanceScale />,
          isMeta: true,
          rightElement: (
            <span className="dropdown-version-tag">
              MIT <span className="dropdown-arrow">↗</span>
            </span>
          ),
          onClick: () => {},
        },
      ],
    },
  ];

  return <Dropdown sections={sections} onClose={() => {}} />;
};
