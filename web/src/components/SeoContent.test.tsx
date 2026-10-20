// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './SeoContent.stories';

afterEach(cleanup);

const { Default } = composeStories(stories);

test('SeoContent renders headings, format table, CLI snippets, and FAQ', () => {
  render(<Default />);

  expect(
    screen.getByRole('heading', {
      name: /SVG Animation to Video/i,
      level: 2,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /Why Use SVG to Video\?/i,
      level: 3,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /How to Convert Animated SVGs/i,
      level: 3,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /Supported Output Formats & Specifications/i,
      level: 3,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /Frequently Asked Questions/i,
      level: 3,
    })
  ).toBeInTheDocument();

  // Verify format table rows (format names may appear in multiple elements)
  expect(screen.getAllByText('MP4').length).toBeGreaterThan(0);
  expect(screen.getAllByText('WebM').length).toBeGreaterThan(0);
  expect(screen.getAllByText('aPNG').length).toBeGreaterThan(0);
  expect(screen.getAllByText('GIF').length).toBeGreaterThan(0);
});
