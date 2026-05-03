// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import { Dropzone } from './Dropzone';

test('Dropzone handles file drop and drag states', () => {
  const mockSetIsDragging = vi.fn();
  const mockOnDrop = vi.fn();
  const mockOnFileChange = vi.fn();

  render(
    <Dropzone
      svgContent={null}
      isDragging={false}
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
