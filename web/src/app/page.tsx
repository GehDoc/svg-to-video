'use client';
import { useState, useEffect } from 'react';
import { Studio } from '../components/Studio';

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

  if (!mounted) {
    return (
      <div
        // Inline styles used to ensure loading state appears
        // immediately without waiting for CSS file loading.
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          minHeight: '100vh',
          fontFamily: 'var(--sans)',
          color: 'var(--text-muted)',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <h1>SVG to Video Studio</h1>
        <p>
          Convert SVG animations to MP4, WebM, MKV, MOV, and other video formats
          with transparency directly in your browser. A private, serverless,
          frame-accurate converter with instant "Copy to Clipboard" support for
          developers.
        </p>

        <p>
          <a
            href="https://github.com/GehDoc/svg-to-video"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
          {' | '}
          <a
            href="https://github.com/GehDoc/svg-to-video/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
          >
            MIT License
          </a>
        </p>

        <p>Loading the studio...</p>
      </div>
    );
  }

  return <Studio />;
}
