/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
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
