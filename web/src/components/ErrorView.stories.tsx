import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrorView } from './ErrorView';
import { fn } from 'storybook/test';

const meta: Meta<typeof ErrorView> = {
  title: 'Components/ErrorView',
  component: ErrorView,
  tags: ['autodocs'],
  args: {
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ErrorView>;

export const Default: Story = {
  args: {
    message: 'An unexpected error occurred while rendering the video.',
  },
};

export const ShortMessage: Story = {
  args: {
    message: 'Invalid SVG content.',
  },
};
