import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeaderDropdown } from './HeaderDropdown';

const meta: Meta<typeof HeaderDropdown> = {
  title: 'Components/HeaderDropdown',
  component: HeaderDropdown,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: '240px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HeaderDropdown>;

export const Default: Story = {};
