/**
 * @vitest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useStickyHeaderState } from './useStickyObserver';
import type { RefObject } from 'react';

describe('useStickyHeaderState', () => {
  it('initializes with all headers not stuck at resting position', () => {
    const el1 = document.createElement('section');
    vi.spyOn(el1, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 400,
      left: 0,
      right: 100,
      width: 100,
      height: 300,
      x: 0,
      y: 100,
      toJSON: () => {},
    });
    const ref1: RefObject<HTMLElement | null> = { current: el1 };

    const { result } = renderHook(() => useStickyHeaderState([ref1]));
    expect(result.current).toEqual([false]);
  });

  it('detects when section content scrolls under header in window mode', () => {
    const el1 = document.createElement('section');
    // Top is < 48 - 4 (44) and bottom > 88
    vi.spyOn(el1, 'getBoundingClientRect').mockReturnValue({
      top: 30,
      bottom: 250,
      left: 0,
      right: 100,
      width: 100,
      height: 220,
      x: 0,
      y: 30,
      toJSON: () => {},
    });

    const ref1: RefObject<HTMLElement | null> = { current: el1 };
    const { result } = renderHook(() => useStickyHeaderState([ref1]));

    expect(result.current).toEqual([true]);
  });

  it('detects when section has scrolled completely past in window mode', () => {
    const el1 = document.createElement('section');
    vi.spyOn(el1, 'getBoundingClientRect').mockReturnValue({
      top: -200,
      bottom: 50, // <= 88
      left: 0,
      right: 100,
      width: 100,
      height: 250,
      x: 0,
      y: -200,
      toJSON: () => {},
    });

    const ref1: RefObject<HTMLElement | null> = { current: el1 };
    const { result } = renderHook(() => useStickyHeaderState([ref1]));

    expect(result.current).toEqual([false]);
  });

  it('tracks container.scrollTop relative to section offset in desktop container mode', () => {
    // Ensure desktop width (> 1024)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    const container = document.createElement('div');
    Object.defineProperty(container, 'scrollTop', {
      writable: true,
      configurable: true,
      value: 0,
    });
    const containerRef: RefObject<HTMLElement | null> = { current: container };

    const sec1 = document.createElement('section');
    Object.defineProperty(sec1, 'offsetTop', { value: 0 });
    Object.defineProperty(sec1, 'offsetHeight', { value: 200 });

    const sec2 = document.createElement('section');
    Object.defineProperty(sec2, 'offsetTop', { value: 200 });
    Object.defineProperty(sec2, 'offsetHeight', { value: 200 });

    const ref1: RefObject<HTMLElement | null> = { current: sec1 };
    const ref2: RefObject<HTMLElement | null> = { current: sec2 };

    const { result } = renderHook(() =>
      useStickyHeaderState([ref1, ref2], containerRef)
    );

    // Initial state: scrollTop is 0, so nothing is stuck!
    expect(result.current).toEqual([false, false]);

    // Scroll into section 1 content
    vi.useFakeTimers();
    try {
      container.scrollTop = 50;
      act(() => {
        container.dispatchEvent(new Event('scroll'));
        vi.runAllTimers();
      });
      // Sec1 is stuck, Sec2 is not
      expect(result.current).toEqual([true, false]);

      // Scroll into section 2 content
      container.scrollTop = 250;
      act(() => {
        container.dispatchEvent(new Event('scroll'));
        vi.runAllTimers();
      });
      // Sec1 is scrolled off, Sec2 is stuck
      expect(result.current).toEqual([false, true]);
    } finally {
      vi.useRealTimers();
    }
  });
});
