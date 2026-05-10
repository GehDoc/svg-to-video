// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { SuccessView } from './SuccessView';
import { StudioContext } from '../context/StudioContext';
import { createMockStudioContext } from '../../tests/fixtures/studioContext';

afterEach(cleanup);

test('SuccessView renders MP4 success state correctly', () => {
  const mockContext = createMockStudioContext({
    fileName: 'test.mp4',
    renderedUrl: 'blob:test',
  });

  render(
    <StudioContext.Provider value={mockContext}>
      <SuccessView />
    </StudioContext.Provider>
  );

  expect(screen.getByText(/Render Complete/i)).toBeInTheDocument();
  expect(screen.getByText(/test.mp4/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
});

test('SuccessView renders WebM success state correctly', () => {
  const mockContext = createMockStudioContext({
    fileName: 'test.webm',
    renderedUrl: 'blob:test',
  });

  render(
    <StudioContext.Provider value={mockContext}>
      <SuccessView />
    </StudioContext.Provider>
  );

  expect(screen.getByText(/Render Complete/i)).toBeInTheDocument();
  expect(screen.getByText(/test.webm/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Download/i })).toBeInTheDocument();
});
