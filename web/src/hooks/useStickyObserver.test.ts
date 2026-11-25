/**
 * @vitest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useStickyHeaderState } from './useStickyObserver';
import type { RefObject } from 'react';

describe('useStickyHeaderState', () => {
  it('initializes with all headers not stuck', () => {
    const el1 = document.createElement('section');
    const ref1: RefObject<HTMLElement | null> = { current: el1 };

    const { result } = renderHook(() => useStickyHeaderState([ref1]));
    expect(result.current).toEqual([false]);
  });

  it('detects when section top scrolls past boundary', () => {
    const el1 = document.createElement('section');
    // Mock getBoundingClientRect
    vi.spyOn(el1, 'getBoundingClientRect').mockReturnValue({
      top: 40,
      bottom: 200,
      left: 0,
      right: 100,
      width: 100,
      height: 160,
      x: 0,
      y: 40,
      toJSON: () => {},
    });

    const ref1: RefObject<HTMLElement | null> = { current: el1 };
    const { result } = renderHook(() => useStickyHeaderState([ref1]));

    // Top is 40 <= 48 + 2 (50) and bottom is 200 > 48 + 40 (88), so it is stuck
    expect(result.current).toEqual([true]);
  });

  it('detects when section has scrolled completely past', () => {
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

  it('responds to scroll events using requestAnimationFrame', () => {
    vi.useFakeTimers();
    try {
      const el1 = document.createElement('section');
      const spy = vi.spyOn(el1, 'getBoundingClientRect').mockReturnValue({
        top: 100,
        bottom: 300,
        left: 0,
        right: 100,
        width: 100,
        height: 200,
        x: 0,
        y: 100,
        toJSON: () => {},
      });

      const ref1: RefObject<HTMLElement | null> = { current: el1 };
      const { result } = renderHook(() => useStickyHeaderState([ref1]));
      expect(result.current).toEqual([false]);

      // Simulate scrolling so it becomes stuck
      spy.mockReturnValue({
        top: 30,
        bottom: 230,
        left: 0,
        right: 100,
        width: 100,
        height: 200,
        x: 0,
        y: 30,
        toJSON: () => {},
      });

      act(() => {
        window.dispatchEvent(new Event('scroll'));
        vi.runAllTimers();
      });

      expect(result.current).toEqual([true]);
    } finally {
      vi.useRealTimers();
    }
  });
});
