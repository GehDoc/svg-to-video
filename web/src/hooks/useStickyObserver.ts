import { useEffect, useState, type RefObject } from 'react';

/**
 * Hook to track whether section sticky headers are currently "stuck" (pinned),
 * allowing a smooth drop shadow to display only when content is scrolling underneath them.
 */
export function useStickyHeaderState(
  sectionRefs: RefObject<HTMLElement | null>[],
  containerRef?: RefObject<HTMLElement | null>
): boolean[] {
  const [stuckStates, setStuckStates] = useState<boolean[]>(() =>
    sectionRefs.map(() => false)
  );

  useEffect(() => {
    let rafId: number | null = null;

    const checkSticky = () => {
      const isMobile =
        typeof window !== 'undefined' ? window.innerWidth <= 1024 : false;
      const container = !isMobile && containerRef ? containerRef.current : null;
      const boundaryTop = container
        ? container.getBoundingClientRect().top
        : 48; // fixed site-header height

      const nextStates = sectionRefs.map((ref) => {
        if (!ref.current) return false;
        const rect = ref.current.getBoundingClientRect();
        // The header is stuck when the section top has scrolled past the boundary,
        // and the section bottom hasn't scrolled completely past the header.
        return rect.top <= boundaryTop + 2 && rect.bottom > boundaryTop + 40;
      });

      setStuckStates((prev) => {
        const hasChanged = prev.some((val, i) => val !== nextStates[i]);
        return hasChanged ? nextStates : prev;
      });
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        checkSticky();
      });
    };

    checkSticky();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    const containerEl = containerRef?.current;
    if (containerEl) {
      containerEl.addEventListener('scroll', onScroll, { passive: true });
    }

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (containerEl) {
        containerEl.removeEventListener('scroll', onScroll);
      }
    };
  }, [sectionRefs, containerRef]);

  return stuckStates;
}
