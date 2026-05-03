// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';
import { composeStories } from '@storybook/react';
import * as stories from './LandingView.stories';

afterEach(cleanup);

const { Default } = composeStories(stories);

test('LandingView renders upload prompt and footer correctly', () => {
  render(<Default />);

  // Check for upload prompt
  expect(screen.getByText(/Upload an SVG to begin preview/i)).toBeVisible();

  // Check for footer
  expect(screen.getByText(/Local processing only/i)).toBeVisible();
  expect(screen.getByText(/Licensed under/i)).toBeVisible();
  expect(screen.getByRole('link', { name: /MIT/i })).toBeVisible();
});
