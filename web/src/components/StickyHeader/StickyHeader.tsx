import React, {
  forwardRef,
  type ElementType,
  type ComponentPropsWithRef,
  type ReactNode,
} from 'react';
import {
  useStickyHeader,
  type UseStickyHeaderOptions,
} from '../../hooks/useStickyHeader';

export type StickyHeaderProps<T extends ElementType = 'div'> = {
  as?: T;
  stuckClassName?: string;
  stackedAboveClassName?: string;
  className?: string;
  children?: ReactNode;
} & UseStickyHeaderOptions &
  Omit<
    ComponentPropsWithRef<T>,
    'as' | 'children' | 'boundaryRef' | 'offsetPx' | 'disabled'
  >;

export const StickyHeader = forwardRef(
  <T extends ElementType = 'div'>(
    {
      as,
      stuckClassName = 'is-stuck',
      stackedAboveClassName = 'is-stacked-above',
      className = '',
      boundaryRef,
      offsetPx,
      disabled,
      children,
      ...rest
    }: StickyHeaderProps<T>,
    forwardedRef: React.ForwardedRef<HTMLElement>
  ) => {
    const Component = as || 'div';
    const {
      ref: stickyRef,
      isStuck,
      isStackedAbove,
    } = useStickyHeader({
      boundaryRef,
      offsetPx,
      disabled,
    });

    const setMergedRef = (node: HTMLElement | null) => {
      stickyRef(node);
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const mergedClassName = [
      className,
      isStuck ? stuckClassName : '',
      isStackedAbove ? stackedAboveClassName : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={setMergedRef} className={mergedClassName} {...rest}>
        {children}
      </Component>
    );
  }
);

StickyHeader.displayName = 'StickyHeader';
