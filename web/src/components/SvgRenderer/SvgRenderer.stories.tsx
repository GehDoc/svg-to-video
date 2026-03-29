import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within, userEvent, waitFor, fn } from 'storybook/test';
import SvgRenderer from './index';
import type { RendererHandle } from './index';

interface WrapperProps {
  backgroundColor: string;
  svgContent?: string;
  width?: number;
  height?: number;
  seekTime?: number;
}

const Wrapper = ({
  backgroundColor,
  svgContent = '<svg width="500" height="500"><rect width="100%" height="100%" fill="blue" /></svg>',
  width = 500,
  height = 500,
  seekTime = 0,
}: WrapperProps) => {
  const ref = useRef<RendererHandle>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.loadSvg(svgContent, width, height, backgroundColor);
    }
  }, [backgroundColor, svgContent, width, height]);

  useEffect(() => {
    if (ref.current) {
      ref.current.seek(seekTime);
    }
  }, [seekTime]);

  const handleCapture = async (method: 'optimal' | 'high-fidelity') => {
    if (ref.current) {
      const bitmap = await ref.current.capture(method);
      console.log(`Captured with ${method}:`, bitmap);
      // In a real app we might show this in a modal or download it
      window.alert(
        `Captured ${bitmap.width}x${bitmap.height} image using ${method} method. Check console for details.`
      );
    }
  };

  return (
    <div style={{ backgroundColor, padding: '20px', border: '1px solid #ccc' }}>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={() => handleCapture('optimal')}>
          Capture (Optimal)
        </button>
        <button onClick={() => handleCapture('high-fidelity')}>
          Capture (High-Fidelity)
        </button>
      </div>
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
    seekTime: { control: { type: 'range', min: 0, max: 5000, step: 100 } },
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

export const LoopSynchronizedCapture: Story = {
  args: {
    backgroundColor: '#f0f0f0',
    svgContent: `
      <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#eee" />
        <circle cx="50" cy="50" r="20" fill="#3b82f6">
          <animate 
            attributeName="cx" 
            from="50" 
            to="350" 
            dur="2s" 
            repeatCount="indefinite" />
        </circle>
      </svg>
    `,
    width: 400,
    height: 100,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const monitorLabel = await canvas.findByText('Live Monitor');
    await expect(monitorLabel).toBeInTheDocument();

    await step('Load and Seek', async () => {
      // The load happens in useEffect, but we can wait for a bit
      await new Promise((r) => setTimeout(r, 1000));

      const renderer = canvas.getByTestId('svg-renderer');
      await expect(renderer).toBeInTheDocument();
    });

    await step('Test Capture Buttons', async () => {
      const optimalBtn = canvas.getByRole('button', {
        name: /Capture \(Optimal\)/i,
      });
      const hiFiBtn = canvas.getByRole('button', {
        name: /Capture \(High-Fidelity\)/i,
      });

      // Use storybook/test fn() to mock alert
      const originalAlert = window.alert;
      const alertMock = fn();
      window.alert = alertMock;

      await userEvent.click(optimalBtn);
      await waitFor(
        () =>
          expect(alertMock).toHaveBeenCalledWith(
            expect.stringContaining('optimal')
          ),
        { timeout: 3000 }
      );

      await userEvent.click(hiFiBtn);
      await waitFor(
        () =>
          expect(alertMock).toHaveBeenCalledWith(
            expect.stringContaining('high-fidelity')
          ),
        { timeout: 3000 }
      );

      // Restore original alert
      window.alert = originalAlert;
    });
  },
};
