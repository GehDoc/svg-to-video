import { render, screen, cleanup } from '@testing-library/react';
import { expect, test, afterEach, vi } from 'vitest';
import { composeStories } from '@storybook/react';
import * as stories from './SvgRenderer.stories';

afterEach(cleanup);

const {
  LoopSynchronizedCapture,
  TypographySuite,
  AnimationStressTest,
  FilterFidelity,
} = composeStories(stories);

test('Loop Synchronized Capture - Visual Regression', async () => {
  const onCapture = vi.fn();
  render(<LoopSynchronizedCapture onCapture={onCapture} />);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  screen.getByTestId('capture-optimal').click();
  await vi.waitFor(() => expect(onCapture).toHaveBeenCalled(), {
    timeout: 5000,
  });

  const dataUrl = onCapture.mock.calls[0][0].dataUrl;
  // Snapshoting the base64 string directly
  expect(dataUrl).toMatchSnapshot();
});

test('Typography Suite - Visual Regression', async () => {
  const onCapture = vi.fn();
  render(<TypographySuite onCapture={onCapture} />);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  screen.getByTestId('capture-optimal').click();
  await vi.waitFor(() => expect(onCapture).toHaveBeenCalled(), {
    timeout: 5000,
  });

  expect(onCapture.mock.calls[0][0].dataUrl).toMatchSnapshot();
});

test('Animation Stress Test - Visual Regression', async () => {
  const onCapture = vi.fn();
  const receivedMessages: string[] = [];

  // 1. Attach collector
  const handler = (event: MessageEvent) => {
    if (event.data?.type) receivedMessages.push(event.data.type);
  };
  window.addEventListener('message', handler);

  try {
    // 2. Render with 0 first
    const { rerender } = render(<AnimationStressTest onCapture={onCapture} seekTime={0} />);
    
    // 3. Wait for READY
    await vi.waitFor(() => {
      expect(receivedMessages).toContain('READY');
    }, { timeout: 10000 });

    // 4. Trigger the seek via prop change
    rerender(<AnimationStressTest onCapture={onCapture} seekTime={1000} />);

    // 5. Wait for SEEKED
    await vi.waitFor(() => {
      expect(receivedMessages).toContain('SEEKED');
    }, { timeout: 10000 });

    // 6. Capture
    screen.getByTestId('capture-optimal').click();
    await vi.waitFor(() => expect(onCapture).toHaveBeenCalled(), {
      timeout: 5000,
    });

    expect(onCapture.mock.calls[0][0].dataUrl).toMatchSnapshot();
  } finally {
    window.removeEventListener('message', handler);
  }
});

test('Filter Fidelity - Visual Regression', async () => {
  const onCapture = vi.fn();
  render(<FilterFidelity onCapture={onCapture} />);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  screen.getByTestId('capture-optimal').click();
  await vi.waitFor(() => expect(onCapture).toHaveBeenCalled(), {
    timeout: 5000,
  });

  expect(onCapture.mock.calls[0][0].dataUrl).toMatchSnapshot();
});
