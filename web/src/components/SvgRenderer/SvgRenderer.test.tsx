import { render, screen, cleanup } from '@testing-library/react';
import { expect, test, afterEach } from 'vitest';
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
  render(<LoopSynchronizedCapture />);
  const renderer = await screen.findByTestId('svg-renderer');
  await expect.element(renderer).toMatchScreenshot('loop-t0.png');
});

test('Typography Suite - Visual Regression', async () => {
  render(<TypographySuite />);
  const renderer = await screen.findByTestId('svg-renderer');
  await expect.element(renderer).toMatchScreenshot('typography-suite.png');
});

test(
  'Animation Stress Test - Visual Regression',
  { timeout: 60000 },
  async () => {
    render(<AnimationStressTest />);
    const renderer = await screen.findByTestId('svg-renderer');
    await expect.element(renderer).toMatchScreenshot('animation-stress.png');
  }
);

test('Filter Fidelity - Visual Regression', async () => {
  render(<FilterFidelity />);
  const renderer = await screen.findByTestId('svg-renderer');
  await expect.element(renderer).toMatchScreenshot('filter-fidelity.png');
});
