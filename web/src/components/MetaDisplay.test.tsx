// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './MetaDisplay.stories';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

afterEach(cleanup);

const { WithMeta, WithDimensions } = composeStories(stories);

test('MetaDisplay renders meta info', () => {
  render(<WithMeta />);
  expect(screen.getByText(/h264/i)).toBeInTheDocument();
  expect(screen.getByText(/1920x1080/i)).toBeInTheDocument();
});

test('MetaDisplay renders dimensions', () => {
  render(<WithDimensions />);
  expect(screen.getByText(/500x500/i)).toBeInTheDocument();
  expect(screen.getByText(/1080x1080/i)).toBeInTheDocument();
});

test('MetaDisplay should have no accessibility violations', async () => {
  const { container } = render(<WithMeta />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
