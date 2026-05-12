import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { within, expect, waitFor } from 'storybook/test';
import './SvgRenderer.stories.scss';
import SvgRenderer, { type RendererHandle } from './index';

interface WrapperProps {
  backgroundColor: string;
  svgContent: string;
  width: number;
  height: number;
  seekTime: number;
  isTransparent?: boolean;
}

const Wrapper = forwardRef<RendererHandle, WrapperProps>(
  (
    { backgroundColor, svgContent, width, height, seekTime, isTransparent },
    ref
  ) => {
    const rendererRef = useRef<RendererHandle>(null);

    useImperativeHandle(ref, () => ({
      loadSvg: (s, w, h) => rendererRef.current!.loadSvg(s, w, h),
      seek: (t) => rendererRef.current!.seek(t),
      capture: (m) => rendererRef.current!.capture(m, false),
      isReady: () => rendererRef.current!.isReady(),
    }));

    useEffect(() => {
      if (rendererRef.current) {
        rendererRef.current.loadSvg(svgContent, width, height);
      }
    }, [svgContent, width, height]);

    useEffect(() => {
      if (rendererRef.current) {
        rendererRef.current.seek(seekTime);
      }
    }, [seekTime]);

    return (
      <div className="svg-renderer-story-wrapper">
        <SvgRenderer
          ref={rendererRef}
          backgroundColor={backgroundColor}
          isTransparent={isTransparent}
        />
      </div>
    );
  }
);
Wrapper.displayName = 'Wrapper';

const meta = {
  title: 'Components/SvgRenderer',
  component: Wrapper,
  args: {
    backgroundColor: '#0f172a',
    width: 500,
    height: 500,
    seekTime: 0,
    isTransparent: false,
    svgContent:
      '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg"><polygon points="0,0 500,0 0,500" fill="blue" opacity="0.8" /><circle cx="350" cy="150" r="100" fill="yellow"><animate attributeName="r" from="50" to="150" dur="2s" repeatCount="indefinite" /></circle></svg>',
  },
} satisfies Meta<typeof Wrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BackgroundTest: Story = {
  name: 'Background Color Test',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const renderer = canvas.getByTestId('svg-renderer');
    await expect(renderer).toBeInTheDocument();
  },
};

export const TransparentBackgroundTest: Story = {
  args: {
    backgroundColor: '#0f172a',
    isTransparent: true,
    svgContent:
      '<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg"><circle cx="250" cy="250" r="100" fill="red" /></svg>',
  },
};

export const SMILAnimation: Story = {
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

export const CSSAnimation: Story = {
  args: {
    backgroundColor: '#ffffff',
    width: 400,
    height: 100,
    svgContent: `
      <svg width="400" height="100" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg">
        <style>
          @keyframes slide {
            from { transform: translateX(0); }
            to { transform: translateX(300px); }
          }
          circle {
            animation: slide 2s infinite alternate ease-in-out;
          }
        </style>
        <rect width="100%" height="100%" fill="#eee" />
        <circle cx="50" cy="50" r="20" fill="#f43f5e" />
      </svg>
    `,
  },
};

type WindowExtensionXss = Window & { xss_executed?: boolean };

export const MaliciousXSS: Story = {
  args: {
    backgroundColor: '#ffffff',
    width: 400,
    height: 200,
    svgContent: `
      <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fee2e2" />
        <circle cx="200" cy="80" r="50" fill="red" />
        <script>window.xss_executed = true;</script>
        <rect x="0" y="0" width="100" height="100" fill="transparent" onload="window.xss_executed = true;" />
        <text x="20" y="180" font-size="16" font-weight="bold" fill="red">No JS execution allowed here ?</text>
      </svg>
    `,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const renderer = canvas.getByTestId('svg-renderer');

    // Wait until the renderer has injected the iframe with the blob src
    await waitFor(
      () => {
        const iframe = renderer.querySelector('iframe');
        if (!iframe || !iframe.src.startsWith('blob:')) {
          throw new Error('Renderer not ready');
        }
      },
      { timeout: 2000 }
    );

    // Wait for internal script execution
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await expect((window as WindowExtensionXss).xss_executed).toBeUndefined();

    // Teardown
    (window as WindowExtensionXss).xss_executed = undefined;
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

export const StrippedTagsAnimation: Story = {
  args: {
    backgroundColor: '#ffffff',
    width: 400,
    height: 200,
    svgContent: `
      <svg width="400" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8fafc" />
        
        <!-- set tag test -->
        <rect x="50" y="50" width="50" height="50" fill="blue">
          <set attributeName="fill" to="red" begin="1s" />
        </rect>

        <!-- animateMotion test -->
        <circle r="15" fill="green">
          <animateMotion 
            path="M 50 150 L 350 150" 
            dur="2s" 
            repeatCount="indefinite" />
        </circle>
      </svg>
    `,
  },
};
