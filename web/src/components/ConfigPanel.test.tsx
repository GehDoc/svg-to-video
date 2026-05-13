// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { ConfigPanel } from './ConfigPanel';

afterEach(cleanup);

const defaultProps = {
  svgContent: null,
  onSvgContentChange: vi.fn(),
  fileName: 'animation.mp4',
  onFileNameChange: vi.fn(),
  duration: 5,
  onDurationChange: vi.fn(),
  hold: 0,
  onHoldChange: vi.fn(),
  fps: 60,
  onFpsChange: vi.fn(),
  preset: 'original' as const,
  onPresetChange: vi.fn(),
  scale: 1,
  onScaleChange: vi.fn(),
  backgroundColor: '#ffffff',
  onBackgroundColorChange: vi.fn(),
  format: 'mp4' as const,
  onFormatChange: vi.fn(),
  isTransparent: false,
  onIsTransparentChange: vi.fn(),
  captureMethod: 'optimal' as const,
  onCaptureMethodChange: vi.fn(),
  isDragging: false,
  onIsDraggingChange: vi.fn(),
  state: { isRendering: false, status: 'Idle', progress: 0 },
  onStartRender: vi.fn(),
  originalDim: { width: 0, height: 0, isDimensionsDetected: false },
  renderedUrl: null,
};

test('ConfigPanel dependency: MP4 disables transparency toggle', () => {
  render(
    <ConfigPanel
      {...defaultProps}
      svgContent="<svg></svg>"
      format="mp4"
      isTransparent={false}
    />
  );

  const checkbox = screen.getByLabelText(/Transparent Background/i);
  expect(checkbox).toBeDisabled();
});

test('ConfigPanel dependency: WebM enables transparency toggle', () => {
  render(
    <ConfigPanel
      {...defaultProps}
      svgContent="<svg></svg>"
      format="webm"
      isTransparent={false}
    />
  );

  const checkbox = screen.getByLabelText(/Transparent Background/i);
  expect(checkbox).not.toBeDisabled();
});
