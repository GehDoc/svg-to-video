// @vitest-environment jsdom
import {
  render,
  cleanup,
  waitFor,
  screen,
  fireEvent,
} from '@testing-library/react';
import { test, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Studio } from './Studio';

vi.mock('./SvgRenderer', () => ({
  default: ({
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
  ),
}));

afterEach(cleanup);

test('Studio triggers preview on SvgRenderer when svgContent is set via upload', async () => {
  render(<Studio />);

  // Mock file upload
  const file = new File(['<svg><rect /></svg>'], 'test.svg', {
    type: 'image/svg+xml',
  });
  const input = screen.getByLabelText(/Drop SVG here or click to upload/i);

  fireEvent.change(input, { target: { files: [file] } });

  // Wait for the debounced effect and verify the mock renderer has the content
  await waitFor(
    () => {
      const renderer = screen.getByTestId('mock-svg-renderer');
      expect(renderer).toHaveTextContent('<svg><rect /></svg>');
      expect(renderer).toHaveTextContent('1920x1080'); // Default for unknown dimensions
      expect(renderer).toHaveTextContent('#ffffff');
    },
    { timeout: 1500 }
  );
});

test('Studio updates preview when backgroundColor changes', async () => {
  render(<Studio />);

  // 1. Initial SVG set via upload
  const file = new File(['<svg />'], 'test.svg', { type: 'image/svg+xml' });
  const input = screen.getByLabelText(/Drop SVG here or click to upload/i);
  fireEvent.change(input, { target: { files: [file] } });

  await waitFor(() => {
    expect(screen.getByTestId('mock-svg-renderer')).toHaveTextContent(
      '<svg />'
    );
  });

  // 2. Change Background Color
  const colorInput = screen.getByLabelText(/Background color hex code/i);
  fireEvent.change(colorInput, { target: { value: '#ff0000' } });

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

test('Studio automatically updates duration when animated SVG is uploaded', async () => {
  render(<Studio />);

  // Upload an animated SVG with 3s duration
  const animatedSvg = `
    <svg width="100" height="100">
      <rect>
        <animate attributeName="opacity" dur="3s" repeatCount="1" />
      </rect>
    </svg>
  `;
  const file = new File([animatedSvg], 'animated.svg', {
    type: 'image/svg+xml',
  });
  const input = screen.getByLabelText(/Drop SVG here or click to upload/i);

  fireEvent.change(input, { target: { files: [file] } });

  // Verify that the duration input field is updated to 3
  await waitFor(
    () => {
      const durationInput = screen.getByLabelText(
        /Dur\. \(s\)/i
      ) as HTMLInputElement;
      expect(durationInput.value).toBe('3');
    },
    { timeout: 1500 }
  );
});
