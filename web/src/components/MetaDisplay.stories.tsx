import type { Meta, StoryObj } from '@storybook/react-vite';
import { MetaDisplay } from './MetaDisplay';

const meta: Meta<typeof MetaDisplay> = {
  title: 'Components/MetaDisplay',
  component: MetaDisplay,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MetaDisplay>;

export const WithMeta: Story = {
  args: {
    meta: {
      originalSize: '100x100',
      finalSize: '1920x1080',
      codec: 'h264',
      eta: 5,
    },
  },
};

export const WithDimensions: Story = {
  args: {
    dimensions: {
      width: 500,
      height: 500,
      targetWidth: 1080,
      targetHeight: 1080,
    },
  },
};

export const Empty: Story = {
  args: {},
};
