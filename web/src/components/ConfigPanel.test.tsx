// @vitest-environment jsdom
import { render, cleanup } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './ConfigPanel.stories';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

afterEach(cleanup);

const { Default, WithSvg } = composeStories(stories);

test('ConfigPanel should have no accessibility violations (Default)', async () => {
  const { container } = render(<Default />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('ConfigPanel should have no accessibility violations (WithSvg)', async () => {
  const { container } = render(<WithSvg />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
