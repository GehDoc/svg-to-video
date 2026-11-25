/**
 * @vitest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useStickyHeaderState } from './useStickyObserver';
import type { RefObject } from 'react';

describe('useStickyHeaderState', () => {
  it('initializes with all headers not stuck when flush at boundary', () => {
    const el1 = document.createElement('section');
    // Top is exactly at boundary (48), so rect.top <= 46 is false
    vi.spyOn(el1, 'getBoundingClientRect').mockReturnValue({
      top: 48,
      bottom: 400,
      left: 0,
      right: 100,
      width: 100,
      height: 352,
      x: 0,
      y: 48,
      toJSON: () => {},
    });
    const ref1: RefObject<HTMLElement | null> = { current: el1 };

    const { result } = renderHook(() => useStickyHeaderState([ref1]));
    expect(result.current).toEqual([false]);
  });

  it('triggers shadow as soon as section scrolls 2px past boundary', () => {
    const el1 = document.createElement('section');
    // Top is at 45 (past 48 - 2 = 46) and bottom > 83
    vi.spyOn(el1, 'getBoundingClientRect').mockReturnValue({
      top: 45,
      bottom: 250,
      left: 0,
      right: 100,
      width: 100,
      height: 205,
      x: 0,
      y: 45,
      toJSON: () => {},
    });

    const ref1: RefObject<HTMLElement | null> = { current: el1 };
    const { result } = renderHook(() => useStickyHeaderState([ref1]));

    expect(result.current).toEqual([true]);
  });

  it('supports custom boundaryOffset for nested sticky headers', () => {
    const el1 = document.createElement('div');
    // Top is at 97 (past boundaryOffset 100 - 2 = 98) and bottom > 135
    vi.spyOn(el1, 'getBoundingClientRect').mockReturnValue({
      top: 97,
      bottom: 300,
      left: 0,
      right: 100,
      width: 100,
      height: 203,
      x: 0,
      y: 97,
      toJSON: () => {},
    });

    const ref1: RefObject<HTMLElement | null> = { current: el1 };
    const { result } = renderHook(() =>
      useStickyHeaderState([ref1], undefined, 100)
    );

    expect(result.current).toEqual([true]);
  });

  it('detects when section has scrolled completely past in window mode', () => {
    const el1 = document.createElement('section');
    vi.spyOn(el1, 'getBoundingClientRect').mockReturnValue({
      top: -200,
      bottom: 50, // <= 83
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

  it('works with a container element on desktop', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    const container = document.createElement('div');
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
      top: 116,
      bottom: 700,
      left: 0,
      right: 350,
      width: 350,
      height: 584,
      x: 0,
      y: 116,
      toJSON: () => {},
    });
    const containerRef: RefObject<HTMLElement | null> = { current: container };

    const sec1 = document.createElement('section');
    const spySec1 = vi.spyOn(sec1, 'getBoundingClientRect').mockReturnValue({
      top: 116, // exactly at container top
      bottom: 300,
      left: 0,
      right: 350,
      width: 350,
      height: 184,
      x: 0,
      y: 116,
      toJSON: () => {},
    });

    const ref1: RefObject<HTMLElement | null> = { current: sec1 };

    const { result } = renderHook(() =>
      useStickyHeaderState([ref1], containerRef)
    );

    // Initial resting state: flush with container top, so NO shadow!
    expect(result.current).toEqual([false]);

    // User scrolls just 3px: rect.top becomes 113 <= 114
    vi.useFakeTimers();
    try {
      spySec1.mockReturnValue({
        top: 113,
        bottom: 297,
        left: 0,
        right: 350,
        width: 350,
        height: 184,
        x: 0,
        y: 113,
        toJSON: () => {},
      });

      act(() => {
        container.dispatchEvent(new Event('scroll'));
        vi.runAllTimers();
      });

      // Shadow triggers promptly right after 3px!
      expect(result.current).toEqual([true]);
    } finally {
      vi.useRealTimers();
    }
  });
});
