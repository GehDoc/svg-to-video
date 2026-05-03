import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropzone } from './Dropzone';

const meta: Meta<typeof Dropzone> = {
  title: 'Components/Dropzone',
  component: Dropzone,
};

export default meta;
type Story = StoryObj<typeof Dropzone>;

export const Default: Story = {
  args: {
    svgContent: null,
    isDragging: false,
  },
};

export const HasContent: Story = {
  args: {
    svgContent: '<svg></svg>',
    isDragging: false,
  },
};
