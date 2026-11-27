// @vitest-environment jsdom
import {
  render,
  screen,
  cleanup,
  fireEvent,
  act,
} from '@testing-library/react';
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
  validationError: null,
  originalDim: { width: 0, height: 0, isDimensionsDetected: false },
  renderedUrl: null,
  metadata: { title: '', comment: '' },
  onMetadataChange: vi.fn(),
};

test('ConfigPanel: GIF with transparent background enables background color selector', async () => {
  vi.mocked(discoverFormats.getFormatById).mockReturnValue({
    id: 'gif',
    label: 'GIF',
    extension: '.gif',
    mimeType: 'image/gif',
    supportsAlpha: true,
    supportsMetadata: false,
    supportsLoop: true,
    needsColorKeying: true,
  });
  vi.mocked(isTransparencySupported.isTransparencySupported).mockReturnValue(
    true
  );

  await act(async () => {
    render(
      <ConfigPanel
        {...defaultProps}
        svgContent="<svg></svg>"
        format="gif"
        isTransparent={true}
      />
    );
  });

  const bgColorInput = screen.getByLabelText(/Background color hex code/i);
  expect(bgColorInput).not.toBeDisabled();
});

test('ConfigPanel dependency: MP4 disables transparency toggle', async () => {
  vi.mocked(isTransparencySupported.isTransparencySupported).mockReturnValue(
    false
  );
  await act(async () => {
    render(
      <ConfigPanel
        {...defaultProps}
        svgContent="<svg></svg>"
        format="mp4"
        isTransparent={false}
      />
    );
  });

  const checkbox = screen.getByLabelText(/Transparent Background/i);
  expect(checkbox).toBeDisabled();
});

test('ConfigPanel dependency: WebM enables transparency toggle', async () => {
  vi.mocked(isTransparencySupported.isTransparencySupported).mockReturnValue(
    true
  );
  await act(async () => {
    render(
      <ConfigPanel
        {...defaultProps}
        svgContent="<svg></svg>"
        format="webm"
        isTransparent={false}
      />
    );
  });

  const checkbox = screen.getByLabelText(/Transparent Background/i);
  expect(checkbox).not.toBeDisabled();
});

test('ConfigPanel: displays validation error and disables export button', async () => {
  await act(async () => {
    render(
      <ConfigPanel
        {...defaultProps}
        svgContent="<svg></svg>"
        validationError="Format not supported"
      />
    );
  });

  expect(screen.getByText('Format not supported')).toBeInTheDocument();
  const exportButton = screen.getByRole('button', { name: /Export MP4/i });
  expect(exportButton).toBeDisabled();
});

test('ConfigPanel: duration input handles empty/invalid values by calling onDurationChange with 0', async () => {
  const onDurationChange = vi.fn();
  await act(async () => {
    render(
      <ConfigPanel
        {...defaultProps}
        svgContent="<svg></svg>"
        onDurationChange={onDurationChange}
      />
    );
  });

  const durationInput = screen.getByLabelText(/Dur. \(s\)/i);

  fireEvent.change(durationInput, { target: { value: '' } });
  expect(onDurationChange).toHaveBeenCalledWith(0);
});

test('ConfigPanel: displays calculated target resolution when svgContent and detected dimensions are provided', async () => {
  await act(async () => {
    render(
      <ConfigPanel
        {...defaultProps}
        svgContent="<svg></svg>"
        originalDim={{ width: 1920, height: 1080, isDimensionsDetected: true }}
        targetDim={{ width: 1920, height: 1080 }}
      />
    );
  });

  expect(
    screen.getByText(/Target resolution: 1920 x 1080 px/i)
  ).toBeInTheDocument();
});

test('ConfigPanel: displays Capture Method helper text for Optimal and High Fidelity', async () => {
  let rerenderFn: (ui: React.ReactNode) => void;
  await act(async () => {
    const { rerender } = render(
      <ConfigPanel
        {...defaultProps}
        svgContent="<svg></svg>"
        captureMethod="optimal"
      />
    );
    rerenderFn = rerender;
  });

  expect(
    screen.getByText(/Optimal \(Fast\): Bakes key animation properties/i)
  ).toBeInTheDocument();

  await act(async () => {
    rerenderFn(
      <ConfigPanel
        {...defaultProps}
        svgContent="<svg></svg>"
        captureMethod="high-fidelity"
      />
    );
  });

  expect(
    screen.getByText(/High Fidelity \(Slow\): Bakes all computed SVG/i)
  ).toBeInTheDocument();
});

test('ConfigPanel renders Browse Samples button and triggers onOpenSamples', async () => {
  const onOpenSamples = vi.fn();
  await act(async () => {
    render(<ConfigPanel {...defaultProps} onOpenSamples={onOpenSamples} />);
  });

  const browseBtn = screen.getByRole('button', {
    name: /browse sample svg animations/i,
  });
  expect(browseBtn).toBeInTheDocument();

  fireEvent.click(browseBtn);
  expect(onOpenSamples).toHaveBeenCalledTimes(1);
});

test('ConfigPanel renders Clear SVG button, disabled when svgContent is absent and enabled when present', async () => {
  const onClearSvg = vi.fn();

  // 1. Without svgContent: button is present but disabled
  const { rerender } = render(
    <ConfigPanel {...defaultProps} svgContent={null} onClearSvg={onClearSvg} />
  );
  const clearBtn = screen.getByRole('button', {
    name: /clear active svg and return to home screen/i,
  });
  expect(clearBtn).toBeInTheDocument();
  expect(clearBtn).toBeDisabled();

  // 2. With svgContent: button is enabled and actionable
  rerender(
    <ConfigPanel
      {...defaultProps}
      svgContent="<svg></svg>"
      onClearSvg={onClearSvg}
    />
  );
  expect(clearBtn).not.toBeDisabled();

  fireEvent.click(clearBtn);
  expect(onClearSvg).toHaveBeenCalledTimes(1);
});

test('ConfigPanel renders Loop Animation toggle for formats supporting loop', async () => {
  const onLoopChange = vi.fn();
  vi.mocked(discoverFormats.getFormatById).mockReturnValue({
    id: 'gif',
    label: 'GIF',
    extension: '.gif',
    mimeType: 'image/gif',
    supportsAlpha: true,
    supportsMetadata: true,
    supportsLoop: true,
    needsColorKeying: true,
  });

  render(
    <ConfigPanel
      {...defaultProps}
      svgContent="<svg></svg>"
      format="gif"
      loop={true}
      onLoopChange={onLoopChange}
    />
  );

  const loopCheckbox = screen.getByRole('checkbox', {
    name: /loop animation/i,
  });
  expect(loopCheckbox).toBeInTheDocument();
  expect(loopCheckbox).toBeChecked();

  fireEvent.click(loopCheckbox);
  expect(onLoopChange).toHaveBeenCalledWith(false);
});

test('ConfigPanel does not render Loop Animation toggle for formats without loop support', async () => {
  vi.mocked(discoverFormats.getFormatById).mockReturnValue({
    id: 'mp4',
    label: 'MP4',
    extension: '.mp4',
    mimeType: 'video/mp4',
    supportsAlpha: false,
    supportsMetadata: true,
    supportsLoop: false,
    needsColorKeying: false,
  });

  render(
    <ConfigPanel
      {...defaultProps}
      svgContent="<svg></svg>"
      format="mp4"
      loop={true}
      onLoopChange={vi.fn()}
    />
  );

  expect(
    screen.queryByRole('checkbox', { name: /loop animation/i })
  ).not.toBeInTheDocument();
});

test('ConfigPanel renders duration reset button when detectedDuration differs from duration', async () => {
  const onDurationChange = vi.fn();

  render(
    <ConfigPanel
      {...defaultProps}
      svgContent="<svg></svg>"
      duration={10}
      detectedDuration={3.5}
      onDurationChange={onDurationChange}
    />
  );

  const resetBtn = screen.getByRole('button', { name: /reset/i });
  expect(resetBtn).toBeInTheDocument();

  fireEvent.click(resetBtn);
  expect(onDurationChange).toHaveBeenCalledWith(3.5);
});

test('ConfigPanel renders warning indicator and border when duration exceeds 5 minutes (300s)', async () => {
  const { rerender } = render(
    <ConfigPanel
      {...defaultProps}
      svgContent="<svg></svg>"
      duration={200}
      detectedDuration={200}
    />
  );

  expect(screen.queryByText(/⚠️ > 5 min/i)).not.toBeInTheDocument();
  const durationInput = screen.getByLabelText(/Dur\. \(s\)/i);
  expect(durationInput).not.toHaveClass('input-warning');

  rerender(
    <ConfigPanel
      {...defaultProps}
      svgContent="<svg></svg>"
      duration={350}
      detectedDuration={350}
    />
  );

  expect(screen.getByText(/⚠️ > 5 min/i)).toBeInTheDocument();
  expect(durationInput).toHaveClass('input-warning');
});
