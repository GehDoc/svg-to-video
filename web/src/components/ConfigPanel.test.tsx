// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './ConfigPanel.stories';

afterEach(cleanup);

const { Default, WithSvg, Rendering } = composeStories(stories);

test('ConfigPanel options are disabled when no SVG is loaded', () => {
  render(<Default />);

  // Section 2: Format
  expect(screen.getByLabelText(/Resolution/i)).toBeDisabled();
  expect(screen.getByLabelText(/Dur. \(s\)/i)).toBeDisabled();
  expect(screen.getByLabelText(/Hold \(s\)/i)).toBeDisabled();
  expect(screen.getByLabelText(/FPS/i)).toBeDisabled();

  // Section 3: Canvas
  expect(screen.getByLabelText(/Background color hex code/i)).toBeDisabled();
  expect(screen.getByLabelText(/Capture Method/i)).toBeDisabled();

  // Export button
  expect(screen.getByRole('button', { name: /Export/i })).toBeDisabled();
});

test('ConfigPanel options are enabled when SVG is loaded', () => {
  render(<WithSvg />);

  expect(screen.getByLabelText(/Resolution/i)).not.toBeDisabled();
  expect(screen.getByLabelText(/Dur. \(s\)/i)).not.toBeDisabled();
  expect(screen.getByLabelText(/Hold \(s\)/i)).not.toBeDisabled();
  expect(screen.getByLabelText(/FPS/i)).not.toBeDisabled();
  expect(
    screen.getByLabelText(/Background color hex code/i)
  ).not.toBeDisabled();
  expect(screen.getByLabelText(/Capture Method/i)).not.toBeDisabled();
  expect(screen.getByRole('button', { name: /Export/i })).not.toBeDisabled();
});

test('ConfigPanel options are disabled during rendering', () => {
  render(<Rendering />);

  expect(screen.getByLabelText(/Resolution/i)).toBeDisabled();
  expect(screen.getByLabelText(/Dur. \(s\)/i)).toBeDisabled();
  expect(screen.getByRole('button')).toBeDisabled();
});
