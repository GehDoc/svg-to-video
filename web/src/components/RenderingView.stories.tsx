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
    svgContent: `
      <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
        <rect width="500" height="500" fill="#f8fafc" />
        <circle cx="250" cy="250" r="120" fill="#6366f1" opacity="0.8" />
        <text x="250" y="260" font-family="sans-serif" font-size="40" font-weight="bold" text-anchor="middle" fill="white">SVG</text>
      </svg>
    `,
    originalDim: { width: 500, height: 500 },
    targetDim: { width: 1000, height: 1000 },
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
    targetDim: { width: 1000, height: 1000 },
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
