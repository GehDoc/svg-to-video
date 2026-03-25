import type { Meta, StoryObj } from '@storybook/react-vite';
import SvgRenderer from './index';

const meta: Meta<typeof SvgRenderer> = {
  title: 'Components/SvgRenderer',
  component: SvgRenderer,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    backgroundColor: { control: 'color' },
    captureMethod: {
      control: 'select',
      options: ['optimal', 'high-fidelity'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SvgRenderer>;

export const Default: Story = {
  args: {
    // These args would pass to the SvgRenderer if it accepted them as props.
    // Since it's a forwardRef, we use the `play` function to interact.
  },
  play: async () => {
    // We can use the play function to interact with the component once it's rendered
    // e.g., calling ref.current.loadSvg()
  },
};
