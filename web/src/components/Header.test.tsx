/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { expect, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

vi.mock('../assets/logo.svg?react', () => ({
  default: () => <div data-testid="logo" />,
}));

test('Header renders title and menu', () => {
  render(<Header />);

  expect(screen.getByText(/svg to video/i)).toBeInTheDocument();
  expect(screen.getByText(/studio/i)).toBeInTheDocument();
  expect(screen.getByTestId('logo')).toBeInTheDocument();

  // Check that the menu container is present
  expect(
    screen.getByRole('button', { name: /open menu/i })
  ).toBeInTheDocument();
});
