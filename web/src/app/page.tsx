'use client';
import { useState, useEffect } from 'react';
import { Studio } from '../components/Studio';
import { SeoFallback } from '../components/SeoFallback';

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // We use a mounting effect here to ensure that the heavy client-side
    // 'Studio' component is only rendered after the initial hydration.
    // This prevents SSR bailouts and maintains strict consistency between
    // server and client markup during the hydration phase.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <>
      {!mounted && <SeoFallback />}
      {mounted && <Studio />}
    </>
  );
}
