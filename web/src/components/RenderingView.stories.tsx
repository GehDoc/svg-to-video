import type { Meta, StoryObj } from '@storybook/react-vite';
import { RenderingView } from './RenderingView';
import { createRef } from 'react';

const meta: Meta<typeof RenderingView> = {
  title: 'Components/RenderingView',
  component: RenderingView,
  args: {
    state: {
      isRendering: false,
      status: 'Ready to Export',
      progress: 0,
      meta: undefined,
    },
    svgContent:
      '<svg width="100" height="100"><rect width="100" height="100" fill="red" /></svg>',
    originalDim: { width: 100, height: 100 },
    targetDim: { width: 500, height: 500 },
    rendererRef: createRef(),
    backgroundColor: '#ffffff',
    isTransparent: false,
    onCancel: () => console.log('Cancel'),
    onClearError: () => console.log('Clear Error'),
  },
};

export default meta;
type Story = StoryObj<typeof RenderingView>;

export const Rendering: Story = {
  args: {
    state: {
      isRendering: true,
      status: 'Processing...',
      progress: 45,
      meta: {
        originalSize: '500x500',
        finalSize: '1920x1080',
        codec: 'h264',
        eta: 12,
      },
    },
  },
};

export const IdleWithSvg: Story = {
  args: {
    state: {
      isRendering: false,
      status: 'Ready to Export',
      progress: 0,
      meta: undefined,
    },
    originalDim: { width: 500, height: 500 },
    targetDim: { width: 1920, height: 1080 },
  },
};

export const ErrorState: Story = {
  args: {
    state: {
      isRendering: false,
      status: 'Error: Failed to render',
      progress: 0,
      meta: undefined,
    },
  },
};
