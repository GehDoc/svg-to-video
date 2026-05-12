import { render, cleanup } from '@testing-library/react';
import { expect, test, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './SvgRenderer.stories';
import { createRef } from 'react';
import type { RendererHandle } from '.';

afterEach(cleanup);

const {
  SMILAnimation,
  AnimationStressTest,
  FilterFidelity,
  TransparentBackgroundTest,
  CSSAnimation,
  StrippedTagsAnimation,
} = composeStories(stories);

const DEFAULT_TEST_TIMEOUT = 10000;

/**
 * Helper to capture a frame from the renderer and return it as a Data URL.
 * Handles ImageBitmap transfer to canvas and cleanup.
 */
async function captureFrameAsDataUrl(
  ref: React.RefObject<RendererHandle | null>,
  method: 'optimal' | 'high-fidelity' = 'optimal',
  transparent: boolean = false
): Promise<string> {
  const bitmap = await ref.current!.capture(method, transparent);
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('bitmaprenderer');
  if (ctx) {
    ctx.transferFromImageBitmap(bitmap);
  }
  const dataUrl = canvas.toDataURL();
  bitmap.close();
  return dataUrl;
}

test('SMIL Animation - Frame Comparison and Visual Regression', async () => {
  const ref = createRef<RendererHandle>();

  // Render the SMILAnimation story
  render(<SMILAnimation ref={ref} />);

  // Wait for the renderer to be ready (READY signal)
  await vi.waitFor(() => expect(ref.current?.isReady()).toBe(true), {
    timeout: DEFAULT_TEST_TIMEOUT,
  });

  // Capture the initial frame (at time 0)
  const initialDataUrl = await captureFrameAsDataUrl(ref);

  // Seek to the midpoint of the animation (2s duration, so 1000ms)
  // The SMILAnimation story uses an SVG with dur="2s"
  await ref.current!.seek(1000);

  // Capture the midway frame
  const midwayDataUrl = await captureFrameAsDataUrl(ref);

  // Assert that the initial frame is different from the midway frame, proving animation
  expect(initialDataUrl).not.toBe(midwayDataUrl);

  // Snapshot the initial frame
  expect(initialDataUrl).toMatchSnapshot('SMIL Animation - Initial Frame');

  // Keep the snapshot assertion for the midway frame
  expect(midwayDataUrl).toMatchSnapshot('SMIL Animation - Midway Frame');
});

test('Animation Stress Test - Visual Regression', async () => {
  const ref = createRef<RendererHandle>();

  render(<AnimationStressTest ref={ref} />);

  // Wait for the renderer to be ready (READY signal)
  await vi.waitFor(() => expect(ref.current?.isReady()).toBe(true), {
    timeout: DEFAULT_TEST_TIMEOUT,
  });

  // The original test sought to 1000ms. We use the exposed seek method.
  // Seeking also returns a promise that resolves on the SEEKED signal.
  await ref.current!.seek(1000);

  const dataUrl = await captureFrameAsDataUrl(ref);

  expect(dataUrl).toMatchSnapshot();
});

test('Filter Fidelity - Visual Regression', async () => {
  const ref = createRef<RendererHandle>();

  render(<FilterFidelity ref={ref} />);

  // Wait for the renderer to be ready (READY signal)
  await vi.waitFor(() => expect(ref.current?.isReady()).toBe(true), {
    timeout: DEFAULT_TEST_TIMEOUT,
  });

  const dataUrl = await captureFrameAsDataUrl(ref);

  expect(dataUrl).toMatchSnapshot();
});

test('Transparent Background Test - Visual Regression', async () => {
  const ref = createRef<RendererHandle>();

  render(<TransparentBackgroundTest ref={ref} />);

  // Wait for the renderer to be ready (READY signal)
  await vi.waitFor(() => expect(ref.current?.isReady()).toBe(true), {
    timeout: DEFAULT_TEST_TIMEOUT,
  });

  // Capture with transparency enabled
  const dataUrl = await captureFrameAsDataUrl(ref, 'optimal', true);

  expect(dataUrl).toMatchSnapshot();
});

test('CSS Animation Test - Frame Comparison and Visual Regression', async () => {
  const ref = createRef<RendererHandle>();

  render(<CSSAnimation ref={ref} />);

  // Wait for the renderer to be ready (READY signal)
  await vi.waitFor(() => expect(ref.current?.isReady()).toBe(true), {
    timeout: DEFAULT_TEST_TIMEOUT,
  });

  // Capture the initial frame (at time 0, after readiness)
  const initialDataUrl = await captureFrameAsDataUrl(ref);

  // Seek to the midpoint of the animation (2s duration, so 1000ms)
  await ref.current!.seek(1000);

  // Capture the frame after the delay
  const midwayDataUrl = await captureFrameAsDataUrl(ref);

  // Assert that the initial frame is different from the frame after the delay, proving animation
  expect(initialDataUrl).not.toBe(midwayDataUrl);

  // Snapshot the initial frame
  expect(initialDataUrl).toMatchSnapshot('CSS Animation - Initial Frame');

  // Keep the snapshot assertion for the midway frame
  expect(midwayDataUrl).toMatchSnapshot('CSS Animation - Midway Frame');
});

test('Stripped Tags Animation (set, animateMotion) - Frame Comparison', async () => {
  const ref = createRef<RendererHandle>();

  render(<StrippedTagsAnimation ref={ref} />);

  // Wait for the renderer to be ready
  await vi.waitFor(() => expect(ref.current?.isReady()).toBe(true), {
    timeout: DEFAULT_TEST_TIMEOUT,
  });

  // 1. Initial Frame (at 0s)
  const initialDataUrl = await captureFrameAsDataUrl(ref);

  // 2. Seek to 1.5s (set should have triggered, animateMotion should be midway)
  await ref.current!.seek(1500);
  const midwayDataUrl = await captureFrameAsDataUrl(ref);

  // Assert visual difference
  expect(initialDataUrl).not.toBe(midwayDataUrl);

  // Snapshots
  expect(initialDataUrl).toMatchSnapshot('Stripped Tags - Initial Frame');
  expect(midwayDataUrl).toMatchSnapshot('Stripped Tags - Midway Frame');
});
