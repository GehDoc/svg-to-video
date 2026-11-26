import { useQuery } from '@tanstack/react-query';

export interface GitHubRepoStarsResult {
  stars: number | null;
  isLoading: boolean;
  isError: boolean;
}

export const GITHUB_REPO_API =
  'https://api.github.com/repos/GehDoc/svg-to-video';

export const fetchGitHubStars = async (
  signal?: AbortSignal
): Promise<number> => {
  const response = await fetch(GITHUB_REPO_API, {
    signal,
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch repo stars: ${response.status}`);
  }

  const data = (await response.json()) as unknown;
  if (
    typeof data === 'object' &&
    data !== null &&
    'stargazers_count' in data &&
    typeof (data as { stargazers_count: unknown }).stargazers_count ===
      'number' &&
    Number.isFinite((data as { stargazers_count: number }).stargazers_count)
  ) {
    return (data as { stargazers_count: number }).stargazers_count;
  }

  throw new Error('Invalid stargazers_count');
};

export const useGitHubRepoStars = (): GitHubRepoStarsResult => {
  const { data, isLoading, isError } = useQuery<number>({
    queryKey: ['github-repo-stars'],
    queryFn: ({ signal }) => fetchGitHubStars(signal),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });

  return {
    stars: typeof data === 'number' ? data : null,
    isLoading,
    isError,
  };
};
