// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './Button.stories';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

afterEach(cleanup);

const { Primary, Secondary, Error, Disabled } = composeStories(stories);

test('Primary Button renders correctly', () => {
  render(<Primary />);
  expect(screen.getByRole('button')).toHaveTextContent('Primary Button');
  expect(screen.getByRole('button')).toHaveClass('btn--primary');
});

test('Secondary Button renders correctly', () => {
  render(<Secondary />);
  expect(screen.getByRole('button')).toHaveClass('btn--secondary');
});

test('Error Button renders correctly', () => {
  render(<Error />);
  expect(screen.getByRole('button')).toHaveClass('btn--error');
});

test('Disabled Button is disabled', () => {
  render(<Disabled />);
  expect(screen.getByRole('button')).toBeDisabled();
});

test('Button should have no accessibility violations', async () => {
  const { container } = render(<Primary />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
