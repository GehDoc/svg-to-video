/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { expect, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import pkg from '../../../package.json';

vi.mock('../assets/logo.svg?react', () => ({
  default: () => <div data-testid="logo" />,
}));

test('Header renders project links and version', () => {
  render(<Header />);

  const githubLink = screen.getByRole('link', { name: /github repository/i });
  expect(githubLink).toHaveAttribute(
    'href',
    'https://github.com/GehDoc/svg-to-video'
  );
  expect(githubLink).toHaveTextContent(new RegExp(`v${pkg.version}`, 'i'));

  const licenseLink = screen.getByRole('link', { name: /mit license/i });
  expect(licenseLink).toHaveAttribute(
    'href',
    'https://github.com/GehDoc/svg-to-video/blob/main/LICENSE'
  );
});
