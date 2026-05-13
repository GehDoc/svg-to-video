import type { Meta, StoryObj } from '@storybook/react-vite';
import './ConfigPanel.stories.scss';
import { ConfigPanel } from './ConfigPanel';

const meta: Meta<typeof ConfigPanel> = {
  title: 'Components/ConfigPanel',
  component: ConfigPanel,
  args: {
    svgContent: null,
    onSvgContentChange: (_c, n) => console.log('SVG content change', n),
    fileName: 'animation.mp4',
    onFileNameChange: (n) => console.log('File name change', n),
    duration: 5,
    onDurationChange: (d) => console.log('Duration change', d),
    hold: 0,
    onHoldChange: (h) => console.log('Hold change', h),
    fps: 60,
    onFpsChange: (f) => console.log('FPS change', f),
    preset: 'original',
    onPresetChange: (p) => console.log('Preset change', p),
    scale: 1,
    onScaleChange: (s) => console.log('Scale change', s),
    backgroundColor: '#ffffff',
    onBackgroundColorChange: (c) => console.log('Background color change', c),
    format: 'mp4',
    onFormatChange: (f) => console.log('Format change', f),
    isTransparent: false,
    onIsTransparentChange: (t) => console.log('Is transparent change', t),
    captureMethod: 'optimal',
    onCaptureMethodChange: (m) => console.log('Capture method change', m),
    isDragging: false,
    onIsDraggingChange: (d) => console.log('Is dragging change', d),
    state: { isRendering: false, status: 'Idle', progress: 0 },
    onStartRender: () => console.log('Start render'),
    originalDim: { isDimensionsDetected: false },
    renderedUrl: null,
  },
  decorators: [
    (Story) => (
      <div className="story-wrapper">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSvg: Story = {
  args: {
    svgContent: '<svg></svg>',
    originalDim: { isDimensionsDetected: true },
  },
};

export const TransparentEnabled: Story = {
  args: {
    svgContent: '<svg></svg>',
    format: 'webm',
    isTransparent: true,
    originalDim: { isDimensionsDetected: true },
  },
};

export const TransparentDisabled: Story = {
  args: {
    svgContent: '<svg></svg>',
    format: 'mp4',
    isTransparent: false,
    originalDim: { isDimensionsDetected: true },
  },
};

export const Rendering: Story = {
  args: {
    state: { isRendering: true, status: 'Processing...', progress: 45 },
    svgContent: '<svg></svg>',
    originalDim: { isDimensionsDetected: true },
  },
};

export const WithError: Story = {
  args: {
    svgContent: '<svg></svg>',
    originalDim: { isDimensionsDetected: false },
  },
};
