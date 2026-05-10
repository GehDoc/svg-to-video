import { render, cleanup } from '@testing-library/react';
import { expect, test, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './SvgRenderer.stories';
import { createRef } from 'react';
import type { RendererHandle } from '.';

afterEach(cleanup);

const { LoopSynchronizedCapture, AnimationStressTest, FilterFidelity } =
  composeStories(stories);

const DEFAULT_TEST_TIMEOUT = 10000;

test('Loop Synchronized Capture - Visual Regression', async () => {
  const ref = createRef<RendererHandle>();

  render(<LoopSynchronizedCapture ref={ref} />);

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
