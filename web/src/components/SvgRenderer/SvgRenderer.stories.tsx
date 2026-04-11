import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within, userEvent, waitFor, fn } from 'storybook/test';
import SvgRenderer from './index';
import type { RendererHandle } from './index';

interface WrapperProps {
  backgroundColor: string;
  svgContent: string;
  width: number;
  height: number;
  seekTime: number;
  onCapture?: (data: { method: string; width: number; height: number }) => void;
}

const Wrapper = ({
  backgroundColor,
  svgContent,
  width,
  height,
  seekTime,
  onCapture,
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
      onCapture?.({
        method,
        width: bitmap.width,
        height: bitmap.height,
      });
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => handleCapture('optimal')}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Capture (Optimal)
        </button>
        <button
          onClick={() => handleCapture('high-fidelity')}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Capture (High-Fidelity)
        </button>
        <span style={{ fontSize: '12px', color: '#666' }}>
          Check "Actions" panel for capture results
        </span>
      </div>

      <div
        style={{
          display: 'inline-block',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <SvgRenderer ref={ref} />
      </div>
    </div>
  );
};

const meta = {
  title: 'Components/SvgRenderer',
  component: Wrapper,
  tags: ['autodocs'],
  args: {
    onCapture: fn(),
    backgroundColor: '#ffffff',
    width: 500,
    height: 500,
    seekTime: 0,
    svgContent:
      '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="blue" /><circle cx="250" cy="250" r="100" fill="yellow"><animate attributeName="r" from="50" to="150" dur="2s" repeatCount="indefinite" /></circle></svg>',
  },
  argTypes: {
    backgroundColor: { control: 'color' },
    width: { control: { type: 'range', min: 100, max: 1920, step: 10 } },
    height: { control: { type: 'range', min: 100, max: 1080, step: 10 } },
    seekTime: { control: { type: 'range', min: 0, max: 10000, step: 100 } },
    svgContent: { control: 'text' },
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
  play: async ({ canvasElement, step, args }) => {
    const canvas = within(canvasElement);

    await step('Load and Seek', async () => {
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

      await userEvent.click(optimalBtn);
      await waitFor(
        () =>
          expect(args.onCapture).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'optimal' })
          ),
        { timeout: 3000 }
      );

      await userEvent.click(hiFiBtn);
      await waitFor(
        () =>
          expect(args.onCapture).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'high-fidelity' })
          ),
        { timeout: 3000 }
      );
    });
  },
};

export const TypographySuite: Story = {
  args: {
    backgroundColor: '#ffffff',
    width: 500,
    height: 300,
    svgContent: `
      <svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8f9fa" />
        <style>
          text { font-family: sans-serif; font-size: 24px; fill: #333; }
        </style>
        <text x="20" y="50">English: Hello World</text>
        <text x="20" y="100">Japanese: こんにちは世界 (Konnichiwa)</text>
        <text x="20" y="150">Chinese: 你好世界 (Nǐ hǎo)</text>
        <text x="20" y="200">Korean: 안녕하세요 (Annyeong)</text>
        <text x="20" y="250">Emojis: 🚀 🎨 🐳 ✅</text>
      </svg>
    `,
  },
};

export const AnimationStressTest: Story = {
  args: {
    backgroundColor: '#ffffff',
    width: 600,
    height: 600,
    svgContent: `
      <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#1a1a1a" />
        <g transform="translate(300, 300)">
          ${Array.from({ length: 20 })
            .map(
              (_, i) => `
            <circle r="${20 + i * 12}" fill="none" stroke="hsl(${i * 18}, 70%, 60%)" stroke-width="2">
              <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="${1 + i * 0.2}s" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="rotate" from="0" to="${i % 2 === 0 ? 360 : -360}" dur="${2 + i * 0.5}s" repeatCount="indefinite" />
            </circle>
          `
            )
            .join('')}
        </g>
      </svg>
    `,
  },
};

export const FilterFidelity: Story = {
  args: {
    backgroundColor: '#ffffff',
    width: 500,
    height: 300,
    svgContent: `
      <svg width="500" height="300" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
          </filter>
          <filter id="colorMatrix">
            <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="#eee" />
        <circle cx="100" cy="150" r="50" fill="red" filter="url(#blur)" />
        <circle cx="250" cy="150" r="50" fill="green" filter="url(#colorMatrix)" />
        <rect x="350" y="100" width="100" height="100" fill="blue">
          <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite" />
        </rect>
      </svg>
    `,
  },
};
