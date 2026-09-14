// @vitest-environment jsdom
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { test, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './Dropzone.stories';
import { Dropzone } from './Dropzone';

afterEach(cleanup);

const { Default } = composeStories(stories);

test('Dropzone handles file drop and drag states for valid SVG file', () => {
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

  const dropzoneLabel = screen.getByText(/Drop SVG here or click to upload/i);
  const dropzone = dropzoneLabel.closest('.dropzone') as HTMLElement;

  fireEvent.dragEnter(dropzone);
  expect(mockSetIsDragging).toHaveBeenCalledWith(true);

  fireEvent.dragLeave(dropzone);
  expect(mockSetIsDragging).toHaveBeenCalledWith(false);

  const svgFile = new File(['<svg></svg>'], 'test.svg', {
    type: 'image/svg+xml',
  });
  fireEvent.drop(dropzone, {
    dataTransfer: { files: [svgFile] },
  });
  expect(mockOnDrop).toHaveBeenCalled();
});

test('Dropzone triggers file input click on container click', () => {
  render(
    <Dropzone
      svgContent={null}
      isDragging={false}
      setIsDragging={vi.fn()}
      onFileChange={vi.fn()}
      onDrop={vi.fn()}
    />
  );

  const dropzoneLabel = screen.getByText(/Drop SVG here or click to upload/i);
  const dropzone = dropzoneLabel.closest('.dropzone') as HTMLElement;
  const fileInput = dropzone.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  const clickSpy = vi.spyOn(fileInput, 'click');

  fireEvent.click(dropzone);
  expect(clickSpy).toHaveBeenCalledTimes(1);
});

test('Dropzone displays error toast when a non-SVG file is dropped or selected', () => {
  const mockOnDrop = vi.fn();
  const mockOnFileChange = vi.fn();

  render(
    <Dropzone
      svgContent={null}
      isDragging={false}
      setIsDragging={vi.fn()}
      onFileChange={mockOnFileChange}
      onDrop={mockOnDrop}
    />
  );

  const dropzoneLabel = screen.getByText(/Drop SVG here or click to upload/i);
  const dropzone = dropzoneLabel.closest('.dropzone') as HTMLElement;
  const pngFile = new File(['png data'], 'test.png', { type: 'image/png' });

  // Test non-SVG file drop
  fireEvent.drop(dropzone, {
    dataTransfer: { files: [pngFile] },
  });
  expect(mockOnDrop).not.toHaveBeenCalled();
  expect(screen.getByText('Only SVG files are supported.')).toBeInTheDocument();

  // Dismiss toast
  const closeButton = screen.getByRole('button', { name: /Dismiss error/i });
  fireEvent.click(closeButton);
  expect(
    screen.queryByText('Only SVG files are supported.')
  ).not.toBeInTheDocument();

  // Test non-SVG file input selection
  const fileInput = dropzone.querySelector(
    'input[type="file"]'
  ) as HTMLInputElement;
  fireEvent.change(fileInput, { target: { files: [pngFile] } });
  expect(mockOnFileChange).not.toHaveBeenCalled();
  expect(screen.getByText('Only SVG files are supported.')).toBeInTheDocument();
});
