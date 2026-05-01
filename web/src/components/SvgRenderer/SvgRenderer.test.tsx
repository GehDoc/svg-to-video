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

const DEFAULT_TEST_TIMEOUT = 5000;

/**
 * Helper to wait for a specific signal from the iframe renderer
 */
async function waitForSignal(signal: string, action: () => void) {
  const receivedMessages: string[] = [];
  const handler = (event: MessageEvent) => {
    if (event.data?.type) receivedMessages.push(event.data.type);
  };
  window.addEventListener('message', handler);

  try {
    action();
    await vi.waitFor(
      () => {
        expect(receivedMessages).toContain(signal);
      },
      { timeout: 10000 }
    );
  } finally {
    window.removeEventListener('message', handler);
  }
}

test('Loop Synchronized Capture - Visual Regression', async () => {
  const onCapture = vi.fn();

  await waitForSignal('READY', () => {
    render(<LoopSynchronizedCapture onCapture={onCapture} />);
  });

  screen.getByTestId('capture-optimal').click();
  await vi.waitFor(() => expect(onCapture).toHaveBeenCalled(), {
    timeout: DEFAULT_TEST_TIMEOUT,
  });

  const dataUrl = onCapture.mock.calls[0][0].dataUrl;
  // Snapshoting the base64 string directly
  expect(dataUrl).toMatchSnapshot();
});

test('Typography Suite - Visual Regression', async () => {
  const onCapture = vi.fn();

  await waitForSignal('READY', () => {
    render(<TypographySuite onCapture={onCapture} />);
  });

  screen.getByTestId('capture-optimal').click();
  await vi.waitFor(() => expect(onCapture).toHaveBeenCalled(), {
    timeout: DEFAULT_TEST_TIMEOUT,
  });

  expect(onCapture.mock.calls[0][0].dataUrl).toMatchSnapshot();
});

test('Animation Stress Test - Visual Regression', async () => {
  const onCapture = vi.fn();
  const receivedMessages: string[] = [];

  const handler = (event: MessageEvent) => {
    if (event.data?.type) receivedMessages.push(event.data.type);
  };
  window.addEventListener('message', handler);

  try {
    const { rerender } = render(
      <AnimationStressTest onCapture={onCapture} seekTime={0} />
    );

    await vi.waitFor(
      () => {
        expect(receivedMessages).toContain('READY');
      },
      { timeout: 10000 }
    );

    rerender(<AnimationStressTest onCapture={onCapture} seekTime={1000} />);

    await vi.waitFor(
      () => {
        expect(receivedMessages).toContain('SEEKED');
      },
      { timeout: 10000 }
    );

    screen.getByTestId('capture-optimal').click();
    await vi.waitFor(() => expect(onCapture).toHaveBeenCalled(), {
      timeout: DEFAULT_TEST_TIMEOUT,
    });

    expect(onCapture.mock.calls[0][0].dataUrl).toMatchSnapshot();
  } finally {
    window.removeEventListener('message', handler);
  }
});

test('Filter Fidelity - Visual Regression', async () => {
  const onCapture = vi.fn();

  await waitForSignal('READY', () => {
    render(<FilterFidelity onCapture={onCapture} />);
  });

  screen.getByTestId('capture-optimal').click();
  await vi.waitFor(() => expect(onCapture).toHaveBeenCalled(), {
    timeout: DEFAULT_TEST_TIMEOUT,
  });

  expect(onCapture.mock.calls[0][0].dataUrl).toMatchSnapshot();
});
