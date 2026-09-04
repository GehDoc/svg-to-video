import {
  FaGithub,
  FaBug,
  FaCoffee,
  FaTag,
  FaBalanceScale,
} from 'react-icons/fa';
import pkg from '../../package.json';
import { Dropdown } from './Dropdown/Dropdown';

export const HeaderDropdown = () => {
  const repoUrl = pkg.repository.url
    .replace(/^git\+/, '')
    .replace(/\.git$/, '');

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
            if (typeof umami !== 'undefined') {
              umami.track('click-issue-report');
            }
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
            if (typeof umami !== 'undefined') {
              umami.track('click-source-code');
            }
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
            if (typeof umami !== 'undefined') {
              umami.track('click-sponsor', { location: 'dropdown' });
            }
          },
        },
      ],
    },
    {
      label: 'About',
      items: [
        {
          label: 'Version',
          href: `${repoUrl}/releases`,
          target: '_blank',
          rel: 'noopener noreferrer',
          icon: <FaTag />,
          isMeta: true,
          rightElement: (
            <span className="dropdown-version-tag">
              v{pkg.version} <span className="dropdown-arrow">↗</span>
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
