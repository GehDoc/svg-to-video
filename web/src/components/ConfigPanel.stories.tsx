import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfigPanel } from './ConfigPanel';
import { MockStudioProvider } from '../context/MockStudioProvider';

const meta: Meta<typeof ConfigPanel> = {
  title: 'Components/ConfigPanel',
  component: ConfigPanel,
  decorators: [
    (Story) => (
      <MockStudioProvider>
        <div style={{ width: '350px', height: '100vh', display: 'flex' }}>
          <Story />
        </div>
      </MockStudioProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ConfigPanel>;

export const Default: Story = {};

export const WithSvg: Story = {
  decorators: [
    (Story) => (
      <MockStudioProvider
        mockValues={{
          svgContent: '<svg></svg>',
          originalDim: { width: 500, height: 500, isDimensionsDetected: true },
        }}
      >
        <div style={{ width: '350px', height: '100vh', display: 'flex' }}>
          <Story />
        </div>
      </MockStudioProvider>
    ),
  ],
};

export const Rendering: Story = {
  decorators: [
    (Story) => (
      <MockStudioProvider
        mockValues={{
          svgContent: '<svg></svg>',
          state: { isRendering: true, status: 'Processing...', progress: 45 },
        }}
      >
        <div style={{ width: '350px', height: '100vh', display: 'flex' }}>
          <Story />
        </div>
      </MockStudioProvider>
    ),
  ],
};
