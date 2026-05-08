// @vitest-environment jsdom
import { render, cleanup, waitFor } from '@testing-library/react';
import { test, expect, vi, afterEach, type Mock } from 'vitest';
import { StudioProvider } from './StudioProvider';
import { StudioContext, type StudioContextType } from './StudioContext';
import { useContext, useEffect } from 'react';
import type { RendererHandle } from '../components/SvgRenderer';

afterEach(cleanup);

const MockConsumer = ({
  onReady,
}: {
  onReady: (ctx: StudioContextType) => void;
}) => {
  const context = useContext(StudioContext);
  useEffect(() => {
    if (context) onReady(context);
  }, [context, onReady]);
  return null;
};

test('StudioProvider triggers loadSvg on renderer when svgContent is set', async () => {
  const rendererRef = {
    current: {
      loadSvg: vi.fn().mockResolvedValue(undefined),
      seek: vi.fn().mockResolvedValue(undefined),
      capture: vi.fn(),
      isReady: () => true,
    } as unknown as RendererHandle,
  };

  let studioCtx: StudioContextType | undefined;
  render(
    <StudioProvider rendererRef={rendererRef}>
      <MockConsumer onReady={(ctx) => (studioCtx = ctx)} />
    </StudioProvider>
  );

  // Set SVG content
  studioCtx?.setSvgContent('<svg><rect /></svg>');

  // Wait for the debounced effect (300ms)
  await waitFor(
    () => {
      expect(rendererRef.current.loadSvg).toHaveBeenCalledWith(
        '<svg><rect /></svg>',
        expect.any(Number),
        expect.any(Number),
        '#ffffff'
      );
    },
    { timeout: 1000 }
  );
});

test('StudioProvider updates preview when backgroundColor changes', async () => {
  const rendererRef = {
    current: {
      loadSvg: vi.fn().mockResolvedValue(undefined),
      seek: vi.fn().mockResolvedValue(undefined),
      capture: vi.fn(),
      isReady: () => true,
    } as unknown as RendererHandle,
  };

  let studioCtx: StudioContextType | undefined;
  render(
    <StudioProvider rendererRef={rendererRef}>
      <MockConsumer onReady={(ctx) => (studioCtx = ctx)} />
    </StudioProvider>
  );

  // 1. Initial SVG set
  studioCtx?.setSvgContent('<svg />');
  await waitFor(() =>
    expect(rendererRef.current.loadSvg).toHaveBeenCalledTimes(1)
  );

  // 2. Change Background Color
  (rendererRef.current.loadSvg as Mock).mockClear();
  studioCtx?.setBackgroundColor('#ff0000');

  // Wait for debounce
  await waitFor(
    () => {
      expect(rendererRef.current.loadSvg).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Number),
        expect.any(Number),
        '#ff0000'
      );
    },
    { timeout: 1000 }
  );
});
