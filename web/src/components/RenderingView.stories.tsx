import type { Meta, StoryObj } from '@storybook/react-vite';
import { RenderingView } from './RenderingView';
import { MockStudioProvider } from '../context/MockStudioProvider';

const meta: Meta<typeof RenderingView> = {
  title: 'Components/RenderingView',
  component: RenderingView,
};

export default meta;
type Story = StoryObj<typeof RenderingView>;

export const Rendering: Story = {
  decorators: [
    (Story) => (
      <MockStudioProvider
        mockValues={{
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
          svgContent: '<svg></svg>',
        }}
      >
        {Story()}
      </MockStudioProvider>
    ),
  ],
};

export const IdleWithSvg: Story = {
  decorators: [
    (Story) => (
      <MockStudioProvider
        mockValues={{
          state: {
            isRendering: false,
            status: 'Idle',
            progress: 0,
            meta: undefined,
          },
          svgContent: '<svg></svg>',
          originalDim: { width: 500, height: 500, isDimensionsDetected: true },
          targetDim: { width: 1920, height: 1080 },
        }}
      >
        {Story()}
      </MockStudioProvider>
    ),
  ],
};
