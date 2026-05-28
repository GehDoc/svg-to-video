'use client';
import { useState, useEffect } from 'react';
import { Studio } from '../components/Studio';
import { SeoFallback } from '../components/SeoFallback';
import './page.scss';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [shouldRenderSplash, setShouldRenderSplash] = useState(true);

  useEffect(() => {
    // We use a mounting effect here to ensure that the heavy client-side
    // 'Studio' component is only rendered after the initial hydration.
    // This prevents SSR bailouts and maintains strict consistency between
    // server and client markup during the hydration phase.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // Give the heavy Studio component time to initialize its first render
    const fadeTimer = setTimeout(() => setIsSplashVisible(false), 500);

    // Completely remove the splash screen from the DOM after the 500ms CSS transition
    const removeTimer = setTimeout(() => setShouldRenderSplash(false), 1100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {shouldRenderSplash && <SeoFallback isHidden={!isSplashVisible} />}
      {mounted && (
        <div
          style={{
            opacity: isSplashVisible ? 0 : 1,
            transition: 'opacity 0.5s ease-in-out',
          }}
        >
          <Studio />
        </div>
      )}
    </>
  );
}
