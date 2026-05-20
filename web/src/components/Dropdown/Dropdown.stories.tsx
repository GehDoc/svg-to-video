import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';
import {
  FaBug,
  FaGithub,
  FaTag,
  FaBalanceScale,
  FaCopy,
  FaFile,
} from 'react-icons/fa';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
};

export default meta;

export const FullCapability: StoryObj<typeof Dropdown> = {
  args: {
    sections: [
      {
        label: 'Actions',
        items: [
          {
            label: 'Copy as Data URL',
            onClick: () => console.log('Data URL'),
            icon: <FaCopy />,
          },
          {
            label: 'Copy as Video File',
            onClick: () => console.log('Video File'),
            icon: <FaFile />,
          },
        ],
      },
      {
        label: 'Project',
        items: [
          {
            label: 'View Source Code',
            href: 'https://github.com/GehDoc/svg-to-video',
            target: '_blank',
            icon: <FaGithub />,
          },
          {
            label: 'Report an Issue',
            href: 'https://github.com/GehDoc/svg-to-video/issues',
            target: '_blank',
            icon: <FaBug />,
          },
        ],
      },
      {
        label: 'About',
        items: [
          {
            label: 'Version',
            isMeta: true,
            icon: <FaTag />,
            rightElement: (
              <span className="dropdown-version-tag">
                v0.11.3 <span className="dropdown-arrow">↗</span>
              </span>
            ),
          },
          {
            label: 'License',
            isMeta: true,
            icon: <FaBalanceScale />,
            rightElement: (
              <span className="dropdown-version-tag">
                MIT <span className="dropdown-arrow">↗</span>
              </span>
            ),
          },
        ],
      },
    ],
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: '240px', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};
