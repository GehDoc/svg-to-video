import { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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

const meta: Meta<typeof Wrapper> = {
  title: 'Components/SvgRenderer',
  component: Wrapper,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export default meta;
type Story = StoryObj<typeof Wrapper>;

export const Default: Story = {
  args: {
    backgroundColor: '#ffffff',
  },
};
