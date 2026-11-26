// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGitHubRepoStars, fetchGitHubStars } from './useGitHubRepoStars';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useGitHubRepoStars', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('fetches and returns repository star count successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ stargazers_count: 142 }),
    } as Response);

    const { result } = renderHook(() => useGitHubRepoStars(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.stars).toBe(142);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('handles fetch failure gracefully without throwing', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGitHubRepoStars(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.stars).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('throws error in fetchGitHubStars on non-ok HTTP status', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
    } as Response);

    await expect(fetchGitHubStars()).rejects.toThrow(
      'Failed to fetch repo stars: 403'
    );
  });
});
