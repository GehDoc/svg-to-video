// @vitest-environment jsdom
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { test, expect, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './LandingView.stories';
import { LandingView } from './LandingView';

afterEach(cleanup);

const { Default } = composeStories(stories);

test('LandingView renders upload prompt and footer correctly', () => {
  render(<Default />);

  expect(
    screen.getByText(/Upload an SVG to begin preview/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Drop SVG file here or click to browse/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Local processing only — files never leave your browser/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Released under the MIT License/i)
  ).toBeInTheDocument();
});

test('LandingView triggers file input click on upload placeholder click', () => {
  const onFileChange = vi.fn();
  render(<LandingView onFileChange={onFileChange} />);

  const dropzone = screen.getByRole('button', {
    name: /Upload an SVG to begin preview/i,
  });

  const fileInput = dropzone.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const clickSpy = vi.spyOn(fileInput, 'click');

  fireEvent.click(dropzone);
  expect(clickSpy).toHaveBeenCalled();
});

test('LandingView triggers file input click on Enter or Space keydown', () => {
  render(<LandingView />);

  const dropzone = screen.getByRole('button', {
    name: /Upload an SVG to begin preview/i,
  });

  const fileInput = dropzone.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const clickSpy = vi.spyOn(fileInput, 'click');

  fireEvent.keyDown(dropzone, { key: 'Enter' });
  expect(clickSpy).toHaveBeenCalledTimes(1);

  fireEvent.keyDown(dropzone, { key: ' ' });
  expect(clickSpy).toHaveBeenCalledTimes(2);
});

test('LandingView handles drag events properly', () => {
  const onIsDraggingChange = vi.fn();
  render(
    <LandingView isDragging={false} onIsDraggingChange={onIsDraggingChange} />
  );

  const dropzone = screen.getByRole('button', {
    name: /Upload an SVG to begin preview/i,
  });

  fireEvent.dragEnter(dropzone);
  expect(onIsDraggingChange).toHaveBeenCalledWith(true);

  fireEvent.dragLeave(dropzone);
  expect(onIsDraggingChange).toHaveBeenCalledWith(false);
});

test('LandingView calls onDrop handler when file is dropped', () => {
  const onDrop = vi.fn();
  render(<LandingView onDrop={onDrop} />);

  const dropzone = screen.getByRole('button', {
    name: /Upload an SVG to begin preview/i,
  });

  fireEvent.drop(dropzone);
  expect(onDrop).toHaveBeenCalled();
});
