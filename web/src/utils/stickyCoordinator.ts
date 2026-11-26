/**
 * Shared coordinator for sticky header elevation shadow state.
 *
 * Instead of each parent component managing multiple refs and polling in loops,
 * each sticky header registers itself directly. The coordinator:
 * 1. Automatically discovers the correct scroll container (window or overflow ancestor).
 * 2. Dynamically reads CSS computed `top` and `position` properties.
 * 3. Batches measurements into a single requestAnimationFrame pass per scroll target.
 * 4. Disables tracking cleanly when CSS specifies `position: static` (e.g. on mobile).
 */

export interface StickyHeaderOptions {
  /** Optional override for boundary element (defaults to headerEl.parentElement) */
  boundaryRef?: { current: HTMLElement | null };
  /** Optional override for sticky top offset in px (defaults to computed CSS `top`) */
  offsetPx?: number;
  /** Whether sticky observation is disabled */
  disabled?: boolean;
}

export interface StickyEntry {
  headerEl: HTMLElement;
  options?: StickyHeaderOptions;
  onStateChange: (isStuck: boolean) => void;
  isStuck: boolean;
  scrollTarget: Window | HTMLElement;
}

class StickyCoordinator {
  private targetEntries = new Map<Window | HTMLElement, Set<StickyEntry>>();
  private scrollHandlers = new Map<Window | HTMLElement, () => void>();
  private rafIds = new Map<Window | HTMLElement, number>();
  private resizeRafId: number | null = null;
  private isListeningResize = false;

  /**
   * Discovers the scroll container for a given element.
   * Walks up parent elements looking for scrollable overflow (auto, scroll, overlay).
   * Stops before document.body / document.documentElement.
   */
  findScrollTarget(el: HTMLElement): Window | HTMLElement {
    if (typeof window === 'undefined') return {} as Window;
    let parent = el.parentElement;
    while (
      parent &&
      parent !== document.body &&
      parent !== document.documentElement
    ) {
      const style = window.getComputedStyle(parent);
      const overflowY = style.overflowY;
      if (
        overflowY === 'auto' ||
        overflowY === 'scroll' ||
        overflowY === 'overlay'
      ) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return window;
  }

  /**
   * Registers a sticky header element.
   * Returns a cleanup function to unregister.
   */
  register(
    headerEl: HTMLElement,
    onStateChange: (isStuck: boolean) => void,
    options?: StickyHeaderOptions
  ): () => void {
    if (typeof window === 'undefined') return () => {};

    const scrollTarget = this.findScrollTarget(headerEl);
    const entry: StickyEntry = {
      headerEl,
      options,
      onStateChange,
      isStuck: false,
      scrollTarget,
    };

    let entries = this.targetEntries.get(scrollTarget);
    if (!entries) {
      entries = new Set();
      this.targetEntries.set(scrollTarget, entries);
      this.attachScrollListener(scrollTarget);
    }
    entries.add(entry);

    if (!this.isListeningResize) {
      window.addEventListener('resize', this.onResize, { passive: true });
      this.isListeningResize = true;
    }

    // Schedule initial check
    this.scheduleEvaluation(scrollTarget);

    return () => {
      this.unregister(entry);
    };
  }

  private unregister(entry: StickyEntry) {
    const entries = this.targetEntries.get(entry.scrollTarget);
    if (entries) {
      entries.delete(entry);
      if (entries.size === 0) {
        this.detachScrollListener(entry.scrollTarget);
        this.targetEntries.delete(entry.scrollTarget);
      }
    }

    if (this.targetEntries.size === 0 && this.isListeningResize) {
      window.removeEventListener('resize', this.onResize);
      this.isListeningResize = false;
      if (this.resizeRafId !== null) {
        window.cancelAnimationFrame(this.resizeRafId);
        this.resizeRafId = null;
      }
    }
  }

  private attachScrollListener(target: Window | HTMLElement) {
    const handler = () => this.scheduleEvaluation(target);
    this.scrollHandlers.set(target, handler);
    target.addEventListener('scroll', handler, { passive: true });
  }

  private detachScrollListener(target: Window | HTMLElement) {
    const handler = this.scrollHandlers.get(target);
    if (handler) {
      target.removeEventListener('scroll', handler);
      this.scrollHandlers.delete(target);
    }
    const rafId = this.rafIds.get(target);
    if (rafId !== undefined) {
      window.cancelAnimationFrame(rafId);
      this.rafIds.delete(target);
    }
  }

  private onResize = () => {
    if (this.resizeRafId !== null) return;
    this.resizeRafId = window.requestAnimationFrame(() => {
      this.resizeRafId = null;
      this.handleResize();
    });
  };

  private handleResize() {
    // Check if scroll targets need to be re-bucketed (e.g. mobile breakpoint toggle)
    const allEntries: StickyEntry[] = [];
    for (const entries of this.targetEntries.values()) {
      for (const entry of entries) {
        allEntries.push(entry);
      }
    }

    for (const entry of allEntries) {
      if (!entry.headerEl.isConnected) continue;
      const newTarget = this.findScrollTarget(entry.headerEl);
      if (newTarget !== entry.scrollTarget) {
        // Move entry to new target
        const oldSet = this.targetEntries.get(entry.scrollTarget);
        if (oldSet) {
          oldSet.delete(entry);
          if (oldSet.size === 0) {
            this.detachScrollListener(entry.scrollTarget);
            this.targetEntries.delete(entry.scrollTarget);
          }
        }

        entry.scrollTarget = newTarget;
        let newSet = this.targetEntries.get(newTarget);
        if (!newSet) {
          newSet = new Set();
          this.targetEntries.set(newTarget, newSet);
          this.attachScrollListener(newTarget);
        }
        newSet.add(entry);
      }
    }

    // Evaluate all active targets
    for (const target of this.targetEntries.keys()) {
      this.scheduleEvaluation(target);
    }
  }

  scheduleEvaluation(target: Window | HTMLElement) {
    if (this.rafIds.has(target)) return;
    const rafId = window.requestAnimationFrame(() => {
      this.rafIds.delete(target);
      this.evaluate(target);
    });
    this.rafIds.set(target, rafId);
  }

  evaluate(target: Window | HTMLElement) {
    const entries = this.targetEntries.get(target);
    if (!entries || entries.size === 0) return;

    const isWindow = target === window;
    const containerTop = isWindow
      ? 0
      : (target as HTMLElement).getBoundingClientRect().top +
        (target as HTMLElement).clientTop;

    for (const entry of entries) {
      if (!entry.headerEl || !entry.headerEl.isConnected) continue;

      if (entry.options?.disabled) {
        if (entry.isStuck) {
          entry.isStuck = false;
          entry.onStateChange(false);
        }
        continue;
      }

      const style = window.getComputedStyle(entry.headerEl);
      if (style.position !== 'sticky') {
        if (entry.isStuck) {
          entry.isStuck = false;
          entry.onStateChange(false);
        }
        continue;
      }

      let topOffset = entry.options?.offsetPx;
      if (topOffset === undefined) {
        topOffset = parseFloat(style.top) || 0;
      }

      const boundaryEl =
        entry.options?.boundaryRef?.current || entry.headerEl.parentElement;
      if (!boundaryEl) continue;

      const boundaryTop = containerTop + topOffset;
      const rect = boundaryEl.getBoundingClientRect();
      const headerHeight = entry.headerEl.getBoundingClientRect().height || 35;
      const minBottom = boundaryTop + Math.max(20, headerHeight * 0.7);

      const nextStuck = rect.top <= boundaryTop - 2 && rect.bottom > minBottom;

      if (entry.isStuck !== nextStuck) {
        entry.isStuck = nextStuck;
        entry.onStateChange(nextStuck);
      }
    }
  }
}

export const stickyCoordinator = new StickyCoordinator();
