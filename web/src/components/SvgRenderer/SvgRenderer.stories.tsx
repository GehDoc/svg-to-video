import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import SvgRenderer from './index';
import type { RendererHandle } from './index';

const Wrapper = ({ backgroundColor }: { backgroundColor: string }) => {
  const ref = useRef<RendererHandle>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.loadSvg(
        '<svg width="500" height="500"><rect width="100%" height="100%" fill="blue" /></svg>',
        500,
        500,
        backgroundColor
      );
    }
  }, [backgroundColor]);

  return (
    <div style={{ backgroundColor, padding: '10px' }}>
      <SvgRenderer ref={ref} />
    </div>
  );
};

const meta = {
  title: 'Components/SvgRenderer',
  component: Wrapper,
  tags: ['test'],
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} satisfies Meta<typeof Wrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    backgroundColor: '#ffffff',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Wait for the "Live Monitor" label to appear
    const monitorLabel = await canvas.findByText('Live Monitor');
    await expect(monitorLabel).toBeInTheDocument();
  },
};
