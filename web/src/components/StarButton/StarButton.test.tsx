// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { StarButton } from './StarButton';
import * as starHook from '../../hooks/useGitHubRepoStars';

const renderWithClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe('StarButton', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders star button with star count when available', () => {
    vi.spyOn(starHook, 'useGitHubRepoStars').mockReturnValue({
      stars: 128,
      isLoading: false,
      isError: false,
    });

    renderWithClient(<StarButton />);

    const link = screen.getByRole('link', {
      name: /Star svg-to-video on GitHub/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/GehDoc/svg-to-video'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(screen.getByText('Star')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
  });

  it('formats large star count with k suffix', () => {
    vi.spyOn(starHook, 'useGitHubRepoStars').mockReturnValue({
      stars: 2400,
      isLoading: false,
      isError: false,
    });

    renderWithClient(<StarButton />);

    expect(screen.getByText('2.4k')).toBeInTheDocument();
  });

  it('renders fallback badge without count when showCount is false', () => {
    vi.spyOn(starHook, 'useGitHubRepoStars').mockReturnValue({
      stars: 42,
      isLoading: false,
      isError: false,
    });

    renderWithClient(<StarButton showCount={false} />);

    expect(screen.queryByText('42')).not.toBeInTheDocument();
  });

  it('triggers onClick and tracking when clicked', () => {
    vi.spyOn(starHook, 'useGitHubRepoStars').mockReturnValue({
      stars: 10,
      isLoading: false,
      isError: false,
    });

    const onClickMock = vi.fn();
    renderWithClient(<StarButton onClick={onClickMock} />);

    const link = screen.getByRole('link', {
      name: /Star svg-to-video on GitHub/i,
    });
    fireEvent.click(link);

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
