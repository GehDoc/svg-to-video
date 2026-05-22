'use client';

import dynamic from 'next/dynamic';

// Use dynamic import with { ssr: false } to ensure browser-only APIs
// like WebCodecs, Canvas, and DOMParser are only executed on the client.
const Studio = dynamic(
  () => import('../components/Studio').then((mod) => mod.Studio),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'var(--sans)',
          color: 'var(--text-muted)',
        }}
      >
        Loading Studio...
      </div>
    ),
  }
);

export default function Page() {
  return <Studio />;
}
