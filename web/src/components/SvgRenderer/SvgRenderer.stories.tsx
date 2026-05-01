import { useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect, fn } from 'storybook/test';
import SvgRenderer from './index';
import type { RendererHandle } from './index';

interface WrapperProps {
  backgroundColor: string;
  svgContent: string;
  width: number;
  height: number;
  seekTime: number;
  onCapture?: (data: {
    method: string;
    width: number;
    height: number;
    dataUrl: string;
  }) => void;
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
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('bitmaprenderer');
      if (ctx) ctx.transferFromImageBitmap(bitmap);
      const dataUrl = canvas.toDataURL();
      onCapture?.({
        method,
        width: bitmap.width,
        height: bitmap.height,
        dataUrl,
      });
      return dataUrl;
    }
    return null;
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
          data-testid="capture-optimal"
        >
          Capture (Optimal)
        </button>
        <button
          onClick={() => handleCapture('high-fidelity')}
          data-testid="capture-hifi"
        >
          Capture (High-Fidelity)
        </button>
        <span style={{ fontSize: '12px', color: '#666' }}>
          Current Seek: {seekTime}ms
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
      '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 500,0 0,500" fill="blue" opacity="0.8" /><circle cx="350" cy="150" r="100" fill="yellow"><animate attributeName="r" from="50" to="150" dur="2s" repeatCount="indefinite" /></circle></svg>',
  },
} satisfies Meta<typeof Wrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const renderer = canvas.getByTestId('svg-renderer');
    await expect(renderer).toBeInTheDocument();
  },
};

export const LoopSynchronizedCapture: Story = {
  args: {
    backgroundColor: '#f0f0f0',
    svgContent: `
      <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#eee" />
        <circle cx="50" cy="50" r="20" fill="#3b82f6">
          <animate attributeName="cx" from="50" to="350" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    `,
    width: 400,
    height: 100,
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
          text { font-family: 'Hiragino Kaku Gothic ProN', 'Microsoft YaHei', 'Malgun Gothic', 'Noto Sans CJK JP', 'Noto Sans CJK SC', 'Noto Sans CJK KR', sans-serif; font-size: 24px; fill: #333; }
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
          <circle r="20" fill="none" stroke="hsl(0, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle r="32" fill="none" stroke="hsl(18, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1.2s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle r="44" fill="none" stroke="hsl(36, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1.4s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle r="56" fill="none" stroke="hsl(54, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1.6s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle r="68" fill="none" stroke="hsl(72, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="1.8s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle r="80" fill="none" stroke="hsl(90, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="4.5s" repeatCount="indefinite" />
          </circle>
          <circle r="92" fill="none" stroke="hsl(108, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2.2s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="5s" repeatCount="indefinite" />
          </circle>
          <circle r="104" fill="none" stroke="hsl(126, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2.4s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="5.5s" repeatCount="indefinite" />
          </circle>
          <circle r="116" fill="none" stroke="hsl(144, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2.6s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite" />
          </circle>
          <circle r="128" fill="none" stroke="hsl(162, 70%, 60%)" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0, 1000" to="1000, 0" dur="2.8s" repeatCount="indefinite" />
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="6.5s" repeatCount="indefinite" />
          </circle>
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
