// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './LandingView.stories';

afterEach(cleanup);

const { Default } = composeStories(stories);

test('LandingView renders upload prompt and footer correctly', () => {
  render(<Default />);

  expect(
    screen.getByText(/Upload an SVG to begin preview/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Local processing only — files never leave your browser/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Released under the MIT License/i)
  ).toBeInTheDocument();
});
