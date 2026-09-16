import { expect, test } from 'vitest';
import { isSvgFile } from './isSvgFile';

test('isSvgFile returns true for image/svg+xml MIME type', () => {
  const file = new File(['<svg></svg>'], 'icon.svg', { type: 'image/svg+xml' });
  expect(isSvgFile(file)).toBe(true);
});

test('isSvgFile returns true for .svg file extension even if MIME type is empty', () => {
  const file = new File(['<svg></svg>'], 'icon.SVG', { type: '' });
  expect(isSvgFile(file)).toBe(true);
});

test('isSvgFile returns false for non-SVG files', () => {
  const pngFile = new File(['png data'], 'photo.png', { type: 'image/png' });
  expect(isSvgFile(pngFile)).toBe(false);

  const txtFile = new File(['hello'], 'notes.txt', { type: 'text/plain' });
  expect(isSvgFile(txtFile)).toBe(false);
});
