import { describe, it, expect } from 'vitest';
import { injectGifMetadata } from './gifMetadataInjector.js';

describe('shared gifMetadataInjector', () => {
  const mockGifHeader = new Uint8Array([
    0x47,
    0x49,
    0x46,
    0x38,
    0x39,
    0x61, // GIF89a
    0x0a,
    0x00,
    0x0a,
    0x00, // 10x10
    0x80,
    0x00,
    0x00, // GCT flag set, 2 colors (6 bytes GCT)
    0xff,
    0xff,
    0xff,
    0x00,
    0x00,
    0x00, // GCT colors
    0x3b, // trailer
  ]);

  it('should return unchanged gifBytes if no metadata is provided', () => {
    expect(injectGifMetadata(mockGifHeader, undefined)).toBe(mockGifHeader);
    expect(injectGifMetadata(mockGifHeader, {})).toBe(mockGifHeader);
  });

  it('should inject metadata into GIF buffer', () => {
    const result = injectGifMetadata(
      mockGifHeader,
      { title: 'My Title', comment: 'My Comment' },
      '1.0.0'
    );
    expect(result.length).toBeGreaterThan(mockGifHeader.length);
    const text = new TextDecoder().decode(result);
    expect(text).toContain('My Title');
    expect(text).toContain('My Comment');
    expect(result[result.length - 1]).toBe(0x3b);
  });
});
