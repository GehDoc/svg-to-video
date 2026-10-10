// @vitest-environment jsdom
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { test, expect, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './LandingView.stories';
import { LandingView } from './LandingView';

afterEach(cleanup);

const { Default } = composeStories(stories);

test('LandingView renders welcome header, sample cards, and trust badges', () => {
  render(<Default />);

  expect(
    screen.getByRole('heading', {
      name: /Welcome to SVG to Video Studio/i,
      level: 2,
    })
  ).toBeInTheDocument();
  expect(screen.getByText(/Rocket Launch/i)).toBeInTheDocument();
  expect(screen.getByText(/Loading Spinner/i)).toBeInTheDocument();
  expect(screen.getByText(/Mechanical Gear/i)).toBeInTheDocument();
  expect(screen.getByText(/100% Local & Private/i)).toBeInTheDocument();
  expect(screen.getByText(/Alpha Channel Transparency/i)).toBeInTheDocument();
  expect(
    screen.getByText(/Local processing only — files never leave your browser/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Released under the MIT License/i)
  ).toBeInTheDocument();
});

test('LandingView calls onSelectSample when clicking Try This Sample', () => {
  const onSelectSample = vi.fn();
  render(<LandingView onSelectSample={onSelectSample} />);

  const tryButtons = screen.getAllByRole('button', {
    name: /Test .* sample/i,
  });
  expect(tryButtons.length).toBeGreaterThan(0);

  fireEvent.click(tryButtons[0]);
  expect(onSelectSample).toHaveBeenCalledTimes(1);
  expect(onSelectSample).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'rocket-launch' })
  );
});
