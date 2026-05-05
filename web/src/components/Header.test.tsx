// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './Header.stories';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

afterEach(cleanup);

const { Default } = composeStories(stories);

test('Header renders correctly', () => {
  render(<Default />);
  expect(screen.getByText(/SVG to Video/i)).toBeInTheDocument();
});

test('Header should have no accessibility violations', async () => {
  const { container } = render(<Default />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
