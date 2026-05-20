import type { Meta, StoryObj } from '@storybook/react-vite';
import { SuccessView } from './SuccessView';
import { userEvent, within, fn } from 'storybook/test';

const meta: Meta<typeof SuccessView> = {
  title: 'Components/SuccessView',
  component: SuccessView,
  args: {
    fileName: 'animation.mp4',
    fileSize: '2.5 MB',
    renderedUrl: 'https://example.com/video.mp4',
    onDownload: fn(),
    onBack: fn(),
    onCopyOverride: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof SuccessView>;

export const Default: Story = {};

export const CopySuccess: Story = {
  args: {
    onCopyOverride: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return true;
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const copyBtn = canvas.getByRole('button', { name: /Copy Data URL/i });
    await userEvent.click(copyBtn);
  },
};

export const CopyError: Story = {
  args: {
    onCopyOverride: async () => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return false;
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const copyBtn = canvas.getByRole('button', { name: /Copy Data URL/i });
    await userEvent.click(copyBtn);
  },
};
