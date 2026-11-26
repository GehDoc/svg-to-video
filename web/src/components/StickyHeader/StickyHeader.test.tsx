/**
 * @vitest-environment jsdom
 */
import { render, screen, act } from '@testing-library/react';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StickyHeader } from './StickyHeader';
import { stickyCoordinator } from '../../utils/stickyCoordinator';

describe('StickyHeader & stickyCoordinator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders with polymorphic tag and forwards attributes', () => {
    render(
      <section data-testid="parent">
        <StickyHeader as="h2" id="test-h2" data-testid="header">
          Title
        </StickyHeader>
      </section>
    );

    const heading = screen.getByTestId('header');
    expect(heading.tagName).toBe('H2');
    expect(heading.id).toBe('test-h2');
    expect(heading.textContent).toBe('Title');
  });

  it('does not apply is-stuck when resting flush at boundary', () => {
    render(
      <section style={{ height: '300px' }}>
        <StickyHeader as="h2" data-testid="header">
          Title
        </StickyHeader>
      </section>
    );

    const header = screen.getByTestId('header');
    const parent = header.parentElement!;

    // Header has sticky position and top 48px
    vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
      if (el === header) {
        return {
          position: 'sticky',
          top: '48px',
          overflowY: 'visible',
        } as CSSStyleDeclaration;
      }
      return {
        overflowY: 'visible',
        position: 'static',
      } as CSSStyleDeclaration;
    });

    // Parent is exactly at 48px (boundaryTop) -> rect.top <= 48 - 2 (46) is false
    vi.spyOn(parent, 'getBoundingClientRect').mockReturnValue({
      top: 48,
      bottom: 348,
      left: 0,
      right: 100,
      width: 100,
      height: 300,
      x: 0,
      y: 48,
      toJSON: () => {},
    });

    act(() => {
      stickyCoordinator.evaluate(window);
      vi.runAllTimers();
    });

    expect(header.classList.contains('is-stuck')).toBe(false);
  });

  it('applies is-stuck when parent scrolls 2px past boundary', () => {
    render(
      <section style={{ height: '300px' }}>
        <StickyHeader as="h2" data-testid="header">
          Title
        </StickyHeader>
      </section>
    );

    const header = screen.getByTestId('header');
    const parent = header.parentElement!;

    vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
      if (el === header) {
        return {
          position: 'sticky',
          top: '48px',
          overflowY: 'visible',
        } as CSSStyleDeclaration;
      }
      return {
        overflowY: 'visible',
        position: 'static',
      } as CSSStyleDeclaration;
    });

    // Parent scrolled to 45px (past 48 - 2 = 46px)
    vi.spyOn(parent, 'getBoundingClientRect').mockReturnValue({
      top: 45,
      bottom: 300,
      left: 0,
      right: 100,
      width: 100,
      height: 255,
      x: 0,
      y: 45,
      toJSON: () => {},
    });

    act(() => {
      stickyCoordinator.evaluate(window);
      vi.runAllTimers();
    });

    expect(header.classList.contains('is-stuck')).toBe(true);
  });

  it('removes is-stuck when section scrolls completely out of view', () => {
    render(
      <section style={{ height: '300px' }}>
        <StickyHeader as="h2" data-testid="header">
          Title
        </StickyHeader>
      </section>
    );

    const header = screen.getByTestId('header');
    const parent = header.parentElement!;

    vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
      if (el === header) {
        return {
          position: 'sticky',
          top: '48px',
          overflowY: 'visible',
        } as CSSStyleDeclaration;
      }
      return {
        overflowY: 'visible',
        position: 'static',
      } as CSSStyleDeclaration;
    });

    // Section bottom has scrolled past exit threshold
    vi.spyOn(parent, 'getBoundingClientRect').mockReturnValue({
      top: -200,
      bottom: 50, // <= 48 + 24.5
      left: 0,
      right: 100,
      width: 100,
      height: 250,
      x: 0,
      y: -200,
      toJSON: () => {},
    });

    act(() => {
      stickyCoordinator.evaluate(window);
      vi.runAllTimers();
    });

    expect(header.classList.contains('is-stuck')).toBe(false);
  });

  it('disables sticky state when CSS specifies position: static (e.g. mobile Hero)', () => {
    render(
      <section style={{ height: '300px' }}>
        <StickyHeader as="h2" data-testid="header">
          Title
        </StickyHeader>
      </section>
    );

    const header = screen.getByTestId('header');
    const parent = header.parentElement!;

    vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
      if (el === header) {
        return {
          position: 'static',
          top: 'auto',
          overflowY: 'visible',
        } as CSSStyleDeclaration;
      }
      return {
        overflowY: 'visible',
        position: 'static',
      } as CSSStyleDeclaration;
    });

    vi.spyOn(parent, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 300,
      left: 0,
      right: 100,
      width: 100,
      height: 300,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    act(() => {
      stickyCoordinator.evaluate(window);
      vi.runAllTimers();
    });

    expect(header.classList.contains('is-stuck')).toBe(false);
  });

  it('works with scrollable container element', () => {
    render(
      <div
        data-testid="scroll-container"
        style={{ overflowY: 'auto', height: '400px' }}
      >
        <section>
          <StickyHeader as="h2" data-testid="header">
            Title
          </StickyHeader>
        </section>
      </div>
    );

    const scrollContainer = screen.getByTestId('scroll-container');
    const header = screen.getByTestId('header');
    const parent = header.parentElement!;

    vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
      if (el === scrollContainer) {
        return { overflowY: 'auto', position: 'static' } as CSSStyleDeclaration;
      }
      if (el === header) {
        return {
          position: 'sticky',
          top: '0px',
          overflowY: 'visible',
        } as CSSStyleDeclaration;
      }
      return {
        overflowY: 'visible',
        position: 'static',
      } as CSSStyleDeclaration;
    });

    vi.spyOn(scrollContainer, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 500,
      left: 0,
      right: 300,
      width: 300,
      height: 400,
      x: 0,
      y: 100,
      toJSON: () => {},
    });

    // Parent is 5px past container top (100 - 5 = 95px <= 100 - 2 = 98px)
    vi.spyOn(parent, 'getBoundingClientRect').mockReturnValue({
      top: 95,
      bottom: 300,
      left: 0,
      right: 300,
      width: 300,
      height: 205,
      x: 0,
      y: 95,
      toJSON: () => {},
    });

    act(() => {
      stickyCoordinator.evaluate(scrollContainer);
      vi.runAllTimers();
    });

    expect(header.classList.contains('is-stuck')).toBe(true);
  });

  it('applies is-stacked-above to upper header only when lower stuck header touches its bottom', () => {
    render(
      <section>
        <div data-testid="parent-1" style={{ height: '300px' }}>
          <StickyHeader as="h2" data-testid="header-1">
            Section Header
          </StickyHeader>
        </div>
        <div data-testid="parent-2" style={{ height: '200px' }}>
          <StickyHeader as="h3" data-testid="header-2">
            Sub-Section Header
          </StickyHeader>
        </div>
      </section>
    );

    const header1 = screen.getByTestId('header-1');
    const header2 = screen.getByTestId('header-2');
    const parent1 = screen.getByTestId('parent-1');
    const parent2 = screen.getByTestId('parent-2');

    vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
      if (el === header1) {
        return {
          position: 'sticky',
          top: '48px',
          overflowY: 'visible',
        } as CSSStyleDeclaration;
      }
      if (el === header2) {
        return {
          position: 'sticky',
          top: '100px',
          overflowY: 'visible',
        } as CSSStyleDeclaration;
      }
      return {
        overflowY: 'visible',
        position: 'static',
      } as CSSStyleDeclaration;
    });

    // Header 1 is 52px tall (top: 48, bottom: 100)
    vi.spyOn(header1, 'getBoundingClientRect').mockReturnValue({
      top: 48,
      bottom: 100,
      left: 0,
      right: 500,
      width: 500,
      height: 52,
      x: 0,
      y: 48,
      toJSON: () => {},
    });

    // Header 2 touches Header 1 at bottom: 100px (top: 100, bottom: 144)
    vi.spyOn(header2, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 144,
      left: 0,
      right: 500,
      width: 500,
      height: 44,
      x: 0,
      y: 100,
      toJSON: () => {},
    });

    // Parent 1 is scrolled 20px past boundary
    vi.spyOn(parent1, 'getBoundingClientRect').mockReturnValue({
      top: 28,
      bottom: 328,
      left: 0,
      right: 500,
      width: 500,
      height: 300,
      x: 0,
      y: 28,
      toJSON: () => {},
    });

    // Parent 2 is scrolled past its boundary (100 - 10 = 90px <= 100 - 2 = 98px)
    vi.spyOn(parent2, 'getBoundingClientRect').mockReturnValue({
      top: 90,
      bottom: 290,
      left: 0,
      right: 500,
      width: 500,
      height: 200,
      x: 0,
      y: 90,
      toJSON: () => {},
    });

    act(() => {
      stickyCoordinator.evaluate(window);
      vi.runAllTimers();
    });

    // Both are stuck, but header1 is directly touching header2 below it
    expect(header1.classList.contains('is-stuck')).toBe(true);
    expect(header1.classList.contains('is-stacked-above')).toBe(true);
    expect(header2.classList.contains('is-stuck')).toBe(true);
    expect(header2.classList.contains('is-stacked-above')).toBe(false);

    // Now move Header 2 down so they are "close" (e.g. 50px gap) but NOT touching
    vi.spyOn(header2, 'getBoundingClientRect').mockReturnValue({
      top: 150,
      bottom: 194,
      left: 0,
      right: 500,
      width: 500,
      height: 44,
      x: 0,
      y: 150,
      toJSON: () => {},
    });

    act(() => {
      stickyCoordinator.evaluate(window);
      vi.runAllTimers();
    });

    // Both are still stuck, but header1 is NO LONGER touching header2 -> both have their shadows
    expect(header1.classList.contains('is-stuck')).toBe(true);
    expect(header1.classList.contains('is-stacked-above')).toBe(false);
    expect(header2.classList.contains('is-stuck')).toBe(true);
    expect(header2.classList.contains('is-stacked-above')).toBe(false);
  });
});
