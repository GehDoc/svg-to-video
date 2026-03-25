import type { Meta, StoryObj } from '@storybook/react-vite';
import SvgRenderer from './index';

const meta: Meta<typeof SvgRenderer> = {
  title: 'Components/SvgRenderer',
  component: SvgRenderer,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof SvgRenderer>;

export const Default: Story = {
  args: {},
};
