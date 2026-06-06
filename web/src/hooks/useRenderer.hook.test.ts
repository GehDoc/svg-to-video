/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRenderer, RenderSettings } from './useRenderer';
import { createEncoder } from '../utils/encoders/EncoderFactory';
import { RendererHandle } from '../components/SvgRenderer';
import { VideoEncoder } from '../utils/encoders/types';

// Mock the factory
vi.mock('../utils/encoders/EncoderFactory', () => ({
  createEncoder: vi.fn(),
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');

// Mock Canvas Context
const mockCtx = {
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  fillRect: vi.fn(),
  getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
  putImageData: vi.fn(),
} satisfies Partial<CanvasRenderingContext2D> as unknown as CanvasRenderingContext2D;

vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
  (contextId) => {
    if (contextId === '2d') return mockCtx;
    return null;
  }
);

describe('useRenderer hook', () => {
  const mockRenderer: RendererHandle = {
    loadSvg: vi.fn().mockResolvedValue(undefined),
    seek: vi.fn().mockResolvedValue(undefined),
    capture: vi.fn().mockResolvedValue({
      close: vi.fn(),
    } as unknown as ImageBitmap),
    isReady: vi.fn().mockReturnValue(true),
  };

  const mockEncoder: VideoEncoder = {
    init: vi.fn().mockResolvedValue(undefined),
    addFrame: vi.fn().mockResolvedValue(undefined),
    finalize: vi
      .fn()
      .mockResolvedValue(new Blob(['test'], { type: 'video/mp4' })),
    cancel: vi.fn(),
  };

  const defaultSettings: RenderSettings = {
    duration: 1,
    fps: 10,
    preset: 'original',
    scale: 1,
    backgroundColor: '#ffffff',
    format: 'mp4',
    isTransparent: false,
    captureMethod: 'optimal',
    hold: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createEncoder).mockReturnValue(mockEncoder);
    vi.mocked(mockRenderer.loadSvg).mockResolvedValue(undefined);
    vi.mocked(mockRenderer.seek).mockResolvedValue(undefined);
  });

  it('should initialize, capture frames and finalize', async () => {
    const rendererRef = { current: mockRenderer };
    const { result } = renderHook(() =>
      useRenderer(rendererRef as React.RefObject<RendererHandle>)
    );

    let url: string | undefined;
    await act(async () => {
      url = await result.current.render('<svg></svg>', defaultSettings);
    });

    expect(url).toBe('blob:mock-url');
    expect(mockEncoder.init).toHaveBeenCalled();
    // 1s * 10fps = 10 frames
    expect(mockEncoder.addFrame).toHaveBeenCalledTimes(10);
    expect(mockEncoder.finalize).toHaveBeenCalled();
    expect(mockRenderer.loadSvg).toHaveBeenCalled();
    expect(mockRenderer.seek).toHaveBeenCalledTimes(10);
    expect(mockRenderer.capture).toHaveBeenCalledTimes(10);
    expect(result.current.state.status).toBe('Done!');
  });

  it('should handle errors gracefully', async () => {
    const rendererRef = { current: mockRenderer };
    vi.mocked(mockRenderer.loadSvg).mockRejectedValueOnce(
      new Error('Failed to load')
    );

    const { result } = renderHook(() =>
      useRenderer(rendererRef as React.RefObject<RendererHandle>)
    );

    await act(async () => {
      try {
        await result.current.render('<svg></svg>', defaultSettings);
      } catch {
        // Expected
      }
    });

    expect(result.current.state.status).toContain('Error: Failed to load');
    expect(result.current.state.isRendering).toBe(false);
  });

  it('should handle hold frames', async () => {
    const rendererRef = { current: mockRenderer };
    const settingsWithHold: RenderSettings = { ...defaultSettings, hold: 0.5 };

    const { result } = renderHook(() =>
      useRenderer(rendererRef as React.RefObject<RendererHandle>)
    );

    await act(async () => {
      await result.current.render('<svg></svg>', settingsWithHold);
    });

    // 1s duration + 0.5s hold = 1.5s @ 10fps = 15 frames
    expect(mockEncoder.addFrame).toHaveBeenCalledTimes(15);
  });

  it('should handle cancellation', async () => {
    const rendererRef = { current: mockRenderer };

    // Slow down seek to allow time for cancellation
    vi.mocked(mockRenderer.seek).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 20))
    );

    const { result } = renderHook(() =>
      useRenderer(rendererRef as React.RefObject<RendererHandle>)
    );

    let renderPromise: Promise<string | undefined>;
    await act(async () => {
      renderPromise = result.current.render('<svg></svg>', defaultSettings);

      // Wait a bit and then cancel
      await new Promise((resolve) => setTimeout(resolve, 30));
      result.current.cancel();

      await renderPromise;
    });

    expect(mockEncoder.cancel).toHaveBeenCalled();
    expect(result.current.state.status).toBe('Cancelled');
    expect(result.current.state.isRendering).toBe(false);
  });
});
