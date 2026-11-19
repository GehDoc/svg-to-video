import type { Meta, StoryObj } from '@storybook/react-vite';
import { SampleModal } from './SampleModal';

const meta: Meta<typeof SampleModal> = {
  title: 'Components/SampleModal',
  component: SampleModal,
  tags: ['autodocs'],
  args: {
    isOpen: true,
    onClose: () => {},
    onSelectSample: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof SampleModal>;

export const Default: Story = {};
