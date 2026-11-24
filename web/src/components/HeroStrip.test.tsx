/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { HeroStrip } from './HeroStrip';
import { expect, test } from 'vitest';
import '@testing-library/jest-dom/vitest';

test('HeroStrip renders headline and tagline', () => {
  render(<HeroStrip />);

  expect(
    screen.getByRole('heading', {
      name: /High-Fidelity SVG Animation to Video/i,
      level: 1,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByText(/Transform animated SVGs \(CSS & SMIL\)/i)
  ).toBeInTheDocument();
});
