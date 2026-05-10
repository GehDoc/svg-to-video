// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './ConfigPanel.stories';
import { ConfigPanel } from './ConfigPanel';
import {
  StudioContext,
  type StudioContextType,
} from '../context/StudioContext';

afterEach(cleanup);

const { Default } = composeStories(stories);

test('ConfigPanel dependency: MP4 disables transparency toggle', () => {
  const mockContext: StudioContextType = {
    ...Default.args,
    svgContent: '<svg></svg>',
    fileName: 'test.mp4',
    setSvgContent: vi.fn(),
    setFileName: vi.fn(),
    duration: 5,
    setDuration: vi.fn(),
    hold: 0,
    setHold: vi.fn(),
    fps: 60,
    setFps: vi.fn(),
    preset: '1080p',
    setPreset: vi.fn(),
    scale: 1,
    setScale: vi.fn(),
    backgroundColor: '#ffffff',
    setBackgroundColor: vi.fn(),
    format: 'mp4',
    setFormat: vi.fn(),
    isTransparent: false,
    setIsTransparent: vi.fn(),
    captureMethod: 'optimal',
    setCaptureMethod: vi.fn(),
    isDragging: false,
    setIsDragging: vi.fn(),
    renderedUrl: null,
    setRenderedUrl: vi.fn(),
    fileSize: null,
    setFileSize: vi.fn(),
    originalDim: { width: 500, height: 500, isDimensionsDetected: true },
    targetDim: { width: 500, height: 500 },
    state: { isRendering: false, status: 'Idle', progress: 0 },
    handleStartRender: vi.fn(),
    cancel: vi.fn(),
    clearError: vi.fn(),
    downloadResult: vi.fn(),
    rendererRef: { current: null },
  };

  render(
    <StudioContext.Provider value={mockContext}>
      <ConfigPanel />
    </StudioContext.Provider>
  );

  const checkbox = screen.getByLabelText(/Transparent Background/i);
  expect(checkbox).toBeDisabled();
});

test('ConfigPanel dependency: WebM enables transparency toggle', () => {
  const mockContext: StudioContextType = {
    ...Default.args,
    svgContent: '<svg></svg>',
    fileName: 'test.webm',
    setSvgContent: vi.fn(),
    setFileName: vi.fn(),
    duration: 5,
    setDuration: vi.fn(),
    hold: 0,
    setHold: vi.fn(),
    fps: 60,
    setFps: vi.fn(),
    preset: '1080p',
    setPreset: vi.fn(),
    scale: 1,
    setScale: vi.fn(),
    backgroundColor: '#ffffff',
    setBackgroundColor: vi.fn(),
    format: 'webm',
    setFormat: vi.fn(),
    isTransparent: false,
    setIsTransparent: vi.fn(),
    captureMethod: 'optimal',
    setCaptureMethod: vi.fn(),
    isDragging: false,
    setIsDragging: vi.fn(),
    renderedUrl: null,
    setRenderedUrl: vi.fn(),
    fileSize: null,
    setFileSize: vi.fn(),
    originalDim: { width: 500, height: 500, isDimensionsDetected: true },
    targetDim: { width: 500, height: 500 },
    state: { isRendering: false, status: 'Idle', progress: 0 },
    handleStartRender: vi.fn(),
    cancel: vi.fn(),
    clearError: vi.fn(),
    downloadResult: vi.fn(),
    rendererRef: { current: null },
  };

  render(
    <StudioContext.Provider value={mockContext}>
      <ConfigPanel />
    </StudioContext.Provider>
  );

  const checkbox = screen.getByLabelText(/Transparent Background/i);
  expect(checkbox).not.toBeDisabled();
});
