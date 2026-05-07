import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressOverlay } from './ProgressOverlay';
import { fn } from 'storybook/test';

const meta: Meta<typeof ProgressOverlay> = {
  title: 'Components/ProgressOverlay',
  component: ProgressOverlay,
  tags: ['autodocs'],
  args: {
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ProgressOverlay>;

export const Default: Story = {
  args: {
    status: 'Capturing frames...',
    progress: 45,
  },
};

export const NoStatus: Story = {
  args: {
    progress: 10,
  },
};
