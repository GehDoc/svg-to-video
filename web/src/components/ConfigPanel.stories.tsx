import type { Meta, StoryObj } from '@storybook/react-vite';
import './ConfigPanel.stories.scss';
import { ConfigPanel } from './ConfigPanel';
import { MockStudioProvider } from '../context/MockStudioProvider';

const meta: Meta<typeof ConfigPanel> = {
  title: 'Components/ConfigPanel',
  component: ConfigPanel,
  decorators: [
    (Story) => (
      <MockStudioProvider>
        <div className="story-wrapper">
          <Story />
        </div>
      </MockStudioProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

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
        <div className="story-wrapper">
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
        <div className="story-wrapper">
          <Story />
        </div>
      </MockStudioProvider>
    ),
  ],
};
