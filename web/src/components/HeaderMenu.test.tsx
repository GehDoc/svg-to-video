/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { HeaderMenu } from './HeaderMenu';
import { expect, test } from 'vitest';
import '@testing-library/jest-dom/vitest';
import pkg from '../../../package.json';
import { FUNDING_URL } from '../../../shared/funding';

test('HeaderMenu renders Sponsor button and toggles dropdown', () => {
  render(<HeaderMenu />);

  // Check Sponsor button
  const sponsorLink = screen.getByRole('link', { name: /sponsor/i });
  expect(sponsorLink).toHaveAttribute('href', FUNDING_URL);

  // Check Burger trigger
  const burgerButton = screen.getByRole('button', { name: /open menu/i });
  expect(burgerButton).toBeInTheDocument();

  // Dropdown should not be visible initially
  expect(screen.queryByText(/help & feedback/i)).not.toBeInTheDocument();

  // Click burger button
  fireEvent.click(burgerButton);

  // Dropdown should now be visible
  expect(screen.getByText(/help & feedback/i)).toBeInTheDocument();

  // Check links in dropdown
  const issueLink = screen.getByRole('link', { name: /report an issue/i });
  expect(issueLink).toHaveAttribute(
    'href',
    'https://github.com/GehDoc/svg-to-video/issues'
  );

  const sourceLink = screen.getByRole('link', { name: /view source code/i });
  expect(sourceLink).toHaveAttribute(
    'href',
    'https://github.com/GehDoc/svg-to-video'
  );

  const coffeeLink = screen.getByRole('link', { name: /buy me a coffee/i });
  expect(coffeeLink).toHaveAttribute('href', FUNDING_URL);

  const versionLink = screen.getByRole('link', { name: /version/i });
  expect(versionLink).toHaveTextContent(`v${pkg.version}`);

  const licenseLink = screen.getByRole('link', { name: /license/i });
  expect(licenseLink).toHaveTextContent(/mit/i);

  // Click burger button again to close
  fireEvent.click(burgerButton);
  expect(screen.queryByText(/help & feedback/i)).not.toBeInTheDocument();
});
