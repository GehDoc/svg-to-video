// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './SuccessView.stories';

afterEach(cleanup);

const { Default } = composeStories(stories);

test('SuccessView renders success state correctly', () => {
  render(<Default />);

  expect(screen.getByText(/Render Complete/i)).toBeInTheDocument();
  expect(screen.getByText(/animation.mp4/i)).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: /Download MP4/i })
  ).toBeInTheDocument();
});
