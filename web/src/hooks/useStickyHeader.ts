import { useState, useEffect, useCallback } from 'react';
import {
  stickyCoordinator,
  type StickyHeaderOptions,
} from '../utils/stickyCoordinator';

export type UseStickyHeaderOptions = StickyHeaderOptions;

export function useStickyHeader(options?: UseStickyHeaderOptions): {
  ref: (node: HTMLElement | null) => void;
  isStuck: boolean;
} {
  const [isStuck, setIsStuck] = useState(false);
  const [element, setElement] = useState<HTMLElement | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const unregister = stickyCoordinator.register(
      element,
      (nextStuck) => {
        setIsStuck(nextStuck);
      },
      options
    );

    return () => {
      unregister();
    };
  }, [element, options]);

  return { ref, isStuck };
}
