import '@testing-library/jest-dom';

// Hermetic testing safeguard: Prevent unmocked network calls to GitHub API
const originalFetch = globalThis.fetch;
if (typeof originalFetch === 'function') {
  globalThis.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const urlStr =
        typeof input === 'string'
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;
      const parsedUrl = new URL(urlStr, 'http://localhost');
      if (parsedUrl.hostname === 'api.github.com') {
        return new Response(JSON.stringify({ stargazers_count: 100 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch {
      // URL parsing fallback
    }
    return originalFetch(input, init);
  };
}
