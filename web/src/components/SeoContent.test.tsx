// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './SeoContent.stories';
import * as starHook from '../hooks/useGitHubRepoStars';

afterEach(cleanup);

beforeEach(() => {
  vi.spyOn(starHook, 'useGitHubRepoStars').mockReturnValue({
    stars: 100,
    isLoading: false,
    isError: false,
  });
});

const { Default } = composeStories(stories);

test('SeoContent renders headings, format table, CLI snippets, and FAQ', () => {
  render(<Default />);

  expect(
    screen.getByRole('heading', {
      name: /Why Use SVG to Video\?/i,
      level: 2,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /How to Convert Animated SVGs/i,
      level: 2,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /Supported Output Formats & Specifications/i,
      level: 2,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /Frequently Asked Questions/i,
      level: 2,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /Support SVG to Video & Star on GitHub/i,
      level: 2,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /Star on GitHub/i,
      level: 3,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /Sponsor Development/i,
      level: 3,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('link', { name: /Sponsor me on GitHub/i })
  ).toBeInTheDocument();

  // Verify format table rows (format names may appear in multiple elements)
  expect(screen.getAllByText('MP4').length).toBeGreaterThan(0);
  expect(screen.getAllByText('WebM').length).toBeGreaterThan(0);
  expect(screen.getAllByText('aPNG').length).toBeGreaterThan(0);
  expect(screen.getAllByText('GIF').length).toBeGreaterThan(0);

  // Verify CLI and MCP sub-sections (level 3)
  expect(
    screen.getByRole('heading', {
      name: /CLI & Docker Automation/i,
      level: 3,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /AI Agent & MCP Integration/i,
      level: 3,
    })
  ).toBeInTheDocument();

  // Verify ordered list semantics for conversion steps
  expect(screen.getByRole('list')).toBeInTheDocument();
  const listItems = screen.getAllByRole('listitem');
  expect(listItems.length).toBeGreaterThanOrEqual(3);

  expect(
    screen.getByRole('button', { name: /Copy prompt/i })
  ).toBeInTheDocument();
});
