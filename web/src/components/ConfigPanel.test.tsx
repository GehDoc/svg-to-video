// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { ConfigPanel } from './ConfigPanel';
import { StudioContext } from '../context/StudioContext';
import { createMockStudioContext } from '../../tests/fixtures/studioContext';

afterEach(cleanup);

test('ConfigPanel dependency: MP4 disables transparency toggle', () => {
  const mockContext = createMockStudioContext({
    svgContent: '<svg></svg>',
    format: 'mp4',
    isTransparent: false,
  });

  render(
    <StudioContext.Provider value={mockContext}>
      <ConfigPanel />
    </StudioContext.Provider>
  );

  const checkbox = screen.getByLabelText(/Transparent Background/i);
  expect(checkbox).toBeDisabled();
});

test('ConfigPanel dependency: WebM enables transparency toggle', () => {
  const mockContext = createMockStudioContext({
    svgContent: '<svg></svg>',
    format: 'webm',
    isTransparent: false,
  });

  render(
    <StudioContext.Provider value={mockContext}>
      <ConfigPanel />
    </StudioContext.Provider>
  );

  const checkbox = screen.getByLabelText(/Transparent Background/i);
  expect(checkbox).not.toBeDisabled();
});
