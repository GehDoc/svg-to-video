import { describe, it, expect } from 'vitest';
import { isTransparencySupported } from './isTransparencySupported';

describe('isTransparencySupported', () => {
  it('should return true for webm', () => {
    expect(isTransparencySupported('webm')).toBe(true);
  });

  it('should return false for mp4', () => {
    expect(isTransparencySupported('mp4')).toBe(false);
  });
});
