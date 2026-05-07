// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { test, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './Dropzone.stories';

afterEach(cleanup);

const { Default } = composeStories(stories);

test('Dropzone handles file drop and drag states', () => {
  const mockSetIsDragging = vi.fn();
  const mockOnDrop = vi.fn();
  const mockOnFileChange = vi.fn();

  render(
    <Default
      setIsDragging={mockSetIsDragging}
      onFileChange={mockOnFileChange}
      onDrop={mockOnDrop}
    />
  );

  const dropzone = screen.getByText(/Drop SVG here or click to upload/i);

  fireEvent.dragEnter(dropzone);
  expect(mockSetIsDragging).toHaveBeenCalledWith(true);

  fireEvent.dragLeave(dropzone);
  expect(mockSetIsDragging).toHaveBeenCalledWith(false);
});
