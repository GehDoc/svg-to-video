// @vitest-environment jsdom
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { test, expect, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { SampleCard } from './SampleCard';
import type { SamplePreset } from '../utils/samples';

afterEach(cleanup);

const mockSample: SamplePreset = {
  id: 'test-sample',
  name: 'Test Animation',
  description: 'A test animated SVG description',
  category: 'Test',
  format: 'smil',
  duration: 3,
  fps: 30,
  isTransparent: true,
  svgContent:
    '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" /></svg>',
};

test('SampleCard renders sample name, format tag, description, and preview', () => {
  render(<SampleCard sample={mockSample} />);

  expect(screen.getByText('Test Animation')).toBeInTheDocument();
  expect(screen.getByText('SMIL')).toBeInTheDocument();
  expect(
    screen.getByText('A test animated SVG description')
  ).toBeInTheDocument();

  const preview = document.querySelector('.sample-preview');
  expect(preview).toBeInTheDocument();
  expect(preview?.querySelector('svg')).toBeInTheDocument();
});

test('SampleCard triggers onSelectSample when clicking Try This Sample button', () => {
  const onSelectSample = vi.fn();
  render(<SampleCard sample={mockSample} onSelectSample={onSelectSample} />);

  const button = screen.getByRole('button', {
    name: /Test Test Animation sample/i,
  });
  fireEvent.click(button);

  expect(onSelectSample).toHaveBeenCalledTimes(1);
  expect(onSelectSample).toHaveBeenCalledWith(mockSample);
});

test('SampleCard pauses SVG on mount, unpauses on hover/focus, and pauses on leave/blur', () => {
  const pauseMock = vi.fn();
  const unpauseMock = vi.fn();
  window.SVGSVGElement.prototype.pauseAnimations = pauseMock;
  window.SVGSVGElement.prototype.unpauseAnimations = unpauseMock;

  render(<SampleCard sample={mockSample} />);

  // Should pause on mount
  expect(pauseMock).toHaveBeenCalledTimes(1);
  expect(unpauseMock).not.toHaveBeenCalled();

  const card = document.querySelector('.sample-card')!;
  expect(card).toBeInTheDocument();

  // Hover starts animations
  fireEvent.mouseEnter(card);
  expect(unpauseMock).toHaveBeenCalledTimes(1);

  // Leaving stops animations
  fireEvent.mouseLeave(card);
  expect(pauseMock).toHaveBeenCalledTimes(2);

  // Focus starts animations
  fireEvent.focus(card);
  expect(unpauseMock).toHaveBeenCalledTimes(2);

  // Blur stops animations
  fireEvent.blur(card);
  expect(pauseMock).toHaveBeenCalledTimes(3);
});

test('SampleCard gracefully handles missing or throwing pauseAnimations methods', () => {
  // SVG element without pauseAnimations / unpauseAnimations
  Reflect.deleteProperty(window.SVGSVGElement.prototype, 'pauseAnimations');
  Reflect.deleteProperty(window.SVGSVGElement.prototype, 'unpauseAnimations');

  expect(() => {
    const { unmount } = render(<SampleCard sample={mockSample} />);
    const card = document.querySelector('.sample-card')!;
    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);
    unmount();
  }).not.toThrow();
});
