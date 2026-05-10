import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { expect, test } from 'vitest';

test('Header renders project links and version', () => {
  render(<Header />);

  const githubLink = screen.getByRole('link', { name: /github repository/i });
  expect(githubLink).toHaveAttribute(
    'href',
    'https://github.com/GehDoc/svg-to-video'
  );
  expect(githubLink).toHaveTextContent(/v0\.8\.0/i);

  const licenseLink = screen.getByRole('link', { name: /mit license/i });
  expect(licenseLink).toHaveAttribute(
    'href',
    'https://opensource.org/licenses/MIT'
  );
});
