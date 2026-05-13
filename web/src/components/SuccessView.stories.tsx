import type { Meta, StoryObj } from '@storybook/react-vite';
import { SuccessView } from './SuccessView';

const meta: Meta<typeof SuccessView> = {
  title: 'Components/SuccessView',
  component: SuccessView,
  args: {
    fileName: 'animation.mp4',
    fileSize: '2.5 MB',
    renderedUrl: 'https://example.com/video.mp4',
    onDownload: () => console.log('Download clicked'),
    onBack: () => console.log('Back clicked'),
  },
};

export default meta;
type Story = StoryObj<typeof SuccessView>;

export const Default: Story = {};
