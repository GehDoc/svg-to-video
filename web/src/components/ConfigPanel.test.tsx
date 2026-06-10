// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { ConfigPanel } from './ConfigPanel';
import * as discoverFormats from '../utils/discoverFormats';
import * as isTransparencySupported from '../utils/isTransparencySupported';

afterEach(cleanup);

vi.mock('../utils/discoverFormats', () => ({
  getFormatById: vi.fn(),
  discoverFormats: vi.fn().mockResolvedValue([]),
}));

vi.mock('../utils/isTransparencySupported', () => ({
  isTransparencySupported: vi.fn(),
}));

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
  metadata: { title: '', comment: '' },
  onMetadataChange: vi.fn(),
};

test('ConfigPanel: GIF with transparent background enables background color selector', () => {
  vi.mocked(discoverFormats.getFormatById).mockReturnValue({
    id: 'gif',
    label: 'GIF',
    extension: '.gif',
    mimeType: 'image/gif',
    supportsAlpha: true,
    supportsMetadata: false,
    needsColorKeying: true,
  });
  vi.mocked(isTransparencySupported.isTransparencySupported).mockReturnValue(
    true
  );

  render(
    <ConfigPanel
      {...defaultProps}
      svgContent="<svg></svg>"
      format="gif"
      isTransparent={true}
    />
  );

  const bgColorInput = screen.getByLabelText(/Background color hex code/i);
  expect(bgColorInput).not.toBeDisabled();
});

test('ConfigPanel dependency: MP4 disables transparency toggle', () => {
  vi.mocked(isTransparencySupported.isTransparencySupported).mockReturnValue(
    false
  );
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
  vi.mocked(isTransparencySupported.isTransparencySupported).mockReturnValue(
    true
  );
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
