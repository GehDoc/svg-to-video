// @vitest-environment jsdom
import { render, cleanup, waitFor, screen } from '@testing-library/react';
import { test, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { StudioProvider } from './StudioProvider';
import { StudioContext, type StudioContextType } from './StudioContext';
import { useContext, useEffect } from 'react';
import { RenderingView } from '../components/RenderingView';

vi.mock('../components/SvgRenderer', () => ({
  default: vi.fn(
    ({
      svgContent,
      width,
      height,
      backgroundColor,
    }: {
      svgContent: string;
      width: number;
      height: number;
      backgroundColor: string;
    }) => (
      <div data-testid="mock-svg-renderer">
        {svgContent} {width}x{height} {backgroundColor}
      </div>
    )
  ),
}));

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

test('StudioProvider triggers preview on SvgRenderer when svgContent is set', async () => {
  const rendererRef = { current: null };

  let studioCtx: StudioContextType | undefined;
  render(
    <StudioProvider rendererRef={rendererRef}>
      <RenderingView />
      <MockConsumer onReady={(ctx) => (studioCtx = ctx)} />
    </StudioProvider>
  );

  // Set SVG content
  studioCtx?.setSvgContent('<svg><rect /></svg>');

  // Wait for the debounced effect and verify the mock renderer has the content
  await waitFor(
    () => {
      const renderer = screen.getByTestId('mock-svg-renderer');
      expect(renderer).toHaveTextContent('<svg><rect /></svg>');
      expect(renderer).toHaveTextContent('1920x1080');
      expect(renderer).toHaveTextContent('#ffffff');
    },
    { timeout: 1500 }
  );
});

test('StudioProvider updates preview when backgroundColor changes', async () => {
  const rendererRef = { current: null };

  let studioCtx: StudioContextType | undefined;
  render(
    <StudioProvider rendererRef={rendererRef}>
      <RenderingView />
      <MockConsumer onReady={(ctx) => (studioCtx = ctx)} />
    </StudioProvider>
  );

  // 1. Initial SVG set
  studioCtx?.setSvgContent('<svg />');
  await waitFor(() => {
    expect(screen.getByTestId('mock-svg-renderer')).toHaveTextContent(
      '<svg />'
    );
  });

  // 2. Change Background Color
  studioCtx?.setBackgroundColor('#ff0000');

  // Wait for debounce and verify color update
  await waitFor(
    () => {
      expect(screen.getByTestId('mock-svg-renderer')).toHaveTextContent(
        '#ff0000'
      );
    },
    { timeout: 1500 }
  );
});
