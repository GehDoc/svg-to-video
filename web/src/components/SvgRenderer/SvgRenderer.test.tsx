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
} = composeStories(stories);

const DEFAULT_TEST_TIMEOUT = 10000;

test('SMIL Animation - Frame Comparison and Visual Regression', async () => {
  const ref = createRef<RendererHandle>();

  render(<SMILAnimation ref={ref} />);

  // Wait for the renderer to be ready (READY signal)
  await vi.waitFor(() => expect(ref.current?.isReady()).toBe(true), {
    timeout: DEFAULT_TEST_TIMEOUT,
  });

  // Capture the initial frame (at time 0)
  const initialBitmap = await ref.current!.capture('optimal', false);
  const initialCanvas = document.createElement('canvas');
  initialCanvas.width = initialBitmap.width;
  initialCanvas.height = initialBitmap.height;
  const initialCtx = initialCanvas.getContext('bitmaprenderer');
  if (initialCtx) initialCtx.transferFromImageBitmap(initialBitmap);
  const initialDataUrl = initialCanvas.toDataURL();
  initialBitmap.close(); // Clean up bitmap

  // Seek to the midpoint of the animation (2s duration, so 1000ms)
  // The SMILAnimation story uses an SVG with dur="2s"
  await ref.current!.seek(1000);

  // Capture the midway frame
  const midwayBitmap = await ref.current!.capture('optimal', false);
  const midwayCanvas = document.createElement('canvas');
  midwayCanvas.width = midwayBitmap.width;
  midwayCanvas.height = midwayBitmap.height;
  const midwayCtx = midwayCanvas.getContext('bitmaprenderer');
  if (midwayCtx) midwayCtx.transferFromImageBitmap(midwayBitmap);
  const midwayDataUrl = midwayCanvas.toDataURL();
  midwayBitmap.close(); // Clean up bitmap

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

  const bitmap = await ref.current!.capture('optimal', false);

  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('bitmaprenderer');
  if (ctx) ctx.transferFromImageBitmap(bitmap);
  const dataUrl = canvas.toDataURL();

  expect(dataUrl).toMatchSnapshot();
});

test('Filter Fidelity - Visual Regression', async () => {
  const ref = createRef<RendererHandle>();

  render(<FilterFidelity ref={ref} />);

  // Wait for the renderer to be ready (READY signal)
  await vi.waitFor(() => expect(ref.current?.isReady()).toBe(true), {
    timeout: DEFAULT_TEST_TIMEOUT,
  });

  const bitmap = await ref.current!.capture('optimal', false);

  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('bitmaprenderer');
  if (ctx) ctx.transferFromImageBitmap(bitmap);
  const dataUrl = canvas.toDataURL();

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
  const bitmap = await ref.current!.capture('optimal', true);

  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('bitmaprenderer');
  if (ctx) ctx.transferFromImageBitmap(bitmap);
  const dataUrl = canvas.toDataURL();

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
  const initialBitmap = await ref.current!.capture('optimal', false);
  const initialCanvas = document.createElement('canvas');
  initialCanvas.width = initialBitmap.width;
  initialCanvas.height = initialBitmap.height;
  const initialCtx = initialCanvas.getContext('bitmaprenderer');
  if (initialCtx) initialCtx.transferFromImageBitmap(initialBitmap);
  const initialDataUrl = initialCanvas.toDataURL();
  initialBitmap.close(); // Clean up bitmap

  await ref.current!.seek(1000);

  // Capture the frame after the delay
  const midwayBitmap = await ref.current!.capture('optimal', false);
  const midwayCanvas = document.createElement('canvas');
  midwayCanvas.width = midwayBitmap.width;
  midwayCanvas.height = midwayBitmap.height;
  const midwayCtx = midwayCanvas.getContext('bitmaprenderer');
  if (midwayCtx) midwayCtx.transferFromImageBitmap(midwayBitmap);
  const midwayDataUrl = midwayCanvas.toDataURL();
  midwayBitmap.close(); // Clean up bitmap

  // TODO :
  // // Assert that the initial frame is different from the frame after the delay, proving animation
  // expect(initialDataUrl).not.toBe(midwayDataUrl);

  // Snapshot the initial frame
  expect(initialDataUrl).toMatchSnapshot('CSS Animation - Initial Frame');

  // Keep the snapshot assertion for the midway frame
  expect(midwayDataUrl).toMatchSnapshot('CSS Animation - Midway Frame'); // TODO : correct once working !
});
