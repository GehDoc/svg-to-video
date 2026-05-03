import type { Meta, StoryObj } from '@storybook/react-vite';
import { SuccessView } from './SuccessView';
import { MockStudioProvider } from '../context/MockStudioProvider';

const meta: Meta<typeof SuccessView> = {
  title: 'Components/SuccessView',
  component: SuccessView,
};

export default meta;
type Story = StoryObj<typeof SuccessView>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <MockStudioProvider
        mockValues={{
          renderedUrl: '', // Using empty string to test UI state
          fileName: 'animation.mp4',
          fileSize: '2.5 MB',
        }}
      >
        {Story()}
      </MockStudioProvider>
    ),
  ],
};
