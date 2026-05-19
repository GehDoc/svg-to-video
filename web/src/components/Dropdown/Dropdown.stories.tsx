import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';
import { FaBug, FaGithub } from 'react-icons/fa';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
};

export default meta;

export const Default: StoryObj<typeof Dropdown> = {
  args: {
    sections: [
      {
        label: 'Section 1',
        items: [
          { label: 'Action 1', onClick: () => console.log('Action 1') },
          { label: 'Link 1', href: '#', icon: <FaGithub /> },
        ],
      },
      {
        label: 'Section 2',
        items: [
          {
            label: 'Action 2',
            onClick: () => console.log('Action 2'),
            icon: <FaBug />,
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
