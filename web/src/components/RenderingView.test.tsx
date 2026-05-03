// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './RenderingView.stories';

afterEach(cleanup);

const { Rendering } = composeStories(stories);

test('RenderingView renders rendering state correctly', () => {
  render(<Rendering />);

  expect(screen.getByText(/Processing.../i)).toBeInTheDocument();
  expect(screen.getByText(/45%/i)).toBeInTheDocument();
  expect(screen.getByText(/Source/i)).toBeInTheDocument();
  expect(screen.getByText(/500x500/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
});
