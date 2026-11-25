/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Header } from './Header';
import { expect, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('../assets/logo.svg?react', () => ({
  default: () => <div data-testid="logo" />,
}));

test('Header renders title, jump links, actions and mobile burger', () => {
  render(<Header />);

  expect(
    screen.getByRole('link', { name: /skip to main content/i })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('link', { name: /skip to main content/i })
  ).toHaveAttribute('href', '#main-content');

  expect(screen.getByText(/svg to video/i)).toBeInTheDocument();
  expect(screen.getAllByText(/studio/i).length).toBeGreaterThan(0);
  expect(screen.getByTestId('logo')).toBeInTheDocument();

  // Jump nav links
  const jumpNav = screen.getByLabelText(/page navigation/i);
  expect(jumpNav).toBeInTheDocument();
  expect(
    within(jumpNav).getByRole('link', { name: /^studio$/i })
  ).toBeInTheDocument();
  expect(
    within(jumpNav).getByRole('link', { name: /how it works/i })
  ).toBeInTheDocument();
  expect(
    within(jumpNav).getByRole('link', { name: /^formats$/i })
  ).toBeInTheDocument();
  expect(
    within(jumpNav).getByRole('link', { name: /cli & mcp/i })
  ).toBeInTheDocument();
  expect(
    within(jumpNav).getByRole('link', { name: /^faq$/i })
  ).toBeInTheDocument();

  // GitHub & Sponsor buttons
  expect(
    screen.getAllByRole('link', { name: /github repository/i }).length
  ).toBe(2);
  expect(screen.getAllByRole('link', { name: /sponsor/i }).length).toBe(2);

  // Burger button
  expect(
    screen.getByRole('button', { name: /open menu/i })
  ).toBeInTheDocument();
});

test('Header toggles mobile drawer when clicking burger button', () => {
  const trackMock = vi.fn();
  vi.stubGlobal('umami', { track: trackMock });

  render(<Header />);

  const burgerBtn = screen.getByRole('button', { name: /open menu/i });
  expect(burgerBtn).toHaveAttribute('aria-expanded', 'false');

  // Open drawer
  fireEvent.click(burgerBtn);
  expect(burgerBtn).toHaveAttribute('aria-expanded', 'true');
  expect(burgerBtn).toHaveAttribute('aria-label', 'Close menu');

  // Check mobile drawer content
  const mobileNav = screen.getByLabelText(/mobile navigation/i);
  expect(mobileNav).toHaveClass('is-open');

  // Click a link inside drawer
  const howLink = within(mobileNav).getByRole('link', {
    name: /how it works/i,
  });
  fireEvent.click(howLink);

  // Drawer should close
  expect(burgerBtn).toHaveAttribute('aria-expanded', 'false');
});

test('Header title triggers onHome callback when clicked', () => {
  const onHome = vi.fn();
  render(<Header onHome={onHome} />);

  const homeBtn = screen.getByRole('button', { name: /svg to video home/i });
  fireEvent.click(homeBtn);

  expect(onHome).toHaveBeenCalledTimes(1);
});

test('Header title triggers onHome callback on Enter or Space key down', () => {
  const onHome = vi.fn();
  render(<Header onHome={onHome} />);

  const homeBtn = screen.getByRole('button', { name: /svg to video home/i });
  fireEvent.keyDown(homeBtn, { key: 'Enter' });
  fireEvent.keyDown(homeBtn, { key: ' ' });

  expect(onHome).toHaveBeenCalledTimes(2);
});
