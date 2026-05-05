// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './ProgressOverlay.stories';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

afterEach(cleanup);

const { Default } = composeStories(stories);

test('ProgressOverlay renders status and progress', () => {
  render(<Default />);
  expect(screen.getByText(/Capturing frames/i)).toBeInTheDocument();
  expect(screen.getByText(/45%/i)).toBeInTheDocument();
});

test('ProgressOverlay should have no accessibility violations', async () => {
  const { container } = render(<Default />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
