/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { HeaderMenu } from './HeaderMenu';
import { expect, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

test('HeaderMenu renders Sponsor button and toggles dropdown', () => {
  vi.stubGlobal('umami', { track: vi.fn() });
  render(<HeaderMenu />);

  // Check Sponsor button
  const sponsorLink = screen.getByRole('link', { name: /sponsor/i });
  expect(sponsorLink).toHaveAttribute(
    'href',
    'https://github.com/GehDoc/svg-to-video/?sponsor=1'
  );

  fireEvent.click(sponsorLink);
  expect(window.umami.track).toHaveBeenCalledWith('click-sponsor', {
    location: 'header',
  });

  // Check Burger trigger
  const burgerButton = screen.getByRole('button', { name: /open menu/i });
  expect(burgerButton).toBeInTheDocument();

  // Dropdown should not be visible initially
  expect(screen.queryByText(/help & feedback/i)).not.toBeInTheDocument();

  // Click burger button
  fireEvent.click(burgerButton);

  // Dropdown should now be visible (check for a marker from HeaderDropdown)
  expect(screen.getByText(/help & feedback/i)).toBeInTheDocument();

  // Click burger button again to close
  fireEvent.click(burgerButton);
  expect(screen.queryByText(/help & feedback/i)).not.toBeInTheDocument();
});
