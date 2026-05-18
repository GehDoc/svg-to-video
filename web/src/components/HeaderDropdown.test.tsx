/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { HeaderDropdown } from './HeaderDropdown';
import { expect, test } from 'vitest';
import '@testing-library/jest-dom/vitest';
import pkg from '../../package.json';

test('HeaderDropdown renders all sections and links', () => {
  render(<HeaderDropdown />);

  // Check help section
  expect(screen.getByText(/help & feedback/i)).toBeInTheDocument();
  const issueLink = screen.getByRole('link', { name: /report an issue/i });
  expect(issueLink).toHaveAttribute(
    'href',
    'https://github.com/GehDoc/svg-to-video/issues'
  );

  // Check project section
  expect(screen.getByText(/project/i)).toBeInTheDocument();
  const sourceLink = screen.getByRole('link', { name: /view source code/i });
  expect(sourceLink).toHaveAttribute(
    'href',
    'https://github.com/GehDoc/svg-to-video'
  );

  const coffeeLink = screen.getByRole('link', { name: /buy me a coffee/i });
  expect(coffeeLink).toHaveAttribute('href', pkg.funding.url);

  // Check about section
  expect(screen.getByText(/about/i)).toBeInTheDocument();
  const versionLink = screen.getByRole('link', { name: /version/i });
  expect(versionLink).toHaveTextContent(`v${pkg.version}`);

  const licenseLink = screen.getByRole('link', { name: /license/i });
  expect(licenseLink).toHaveTextContent(/mit/i);
});
