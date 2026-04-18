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
  render(<AnimationStressTest onCapture={onCapture} />);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  screen.getByTestId('capture-optimal').click();
  await vi.waitFor(() => expect(onCapture).toHaveBeenCalled(), {
    timeout: 5000,
  });

  expect(onCapture.mock.calls[0][0].dataUrl).toMatchSnapshot();
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
