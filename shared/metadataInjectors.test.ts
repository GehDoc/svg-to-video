import { describe, it, expect } from 'vitest';
import { injectGifMetadata, injectApngMetadata } from './metadataInjectors.js';

describe('shared metadataInjectors', () => {
  describe('injectGifMetadata', () => {
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
    });
  });

  describe('injectApngMetadata', () => {
    // 8 bytes PNG signature + 4 length + 4 type (IHDR) + 13 data + 4 CRC = 33 bytes
    const mockPngHeader = new Uint8Array([
      0x89,
      0x50,
      0x4e,
      0x47,
      0x0d,
      0x0a,
      0x1a,
      0x0a, // PNG Signature
      0x00,
      0x00,
      0x00,
      0x0d, // IHDR Length 13
      0x49,
      0x48,
      0x44,
      0x52, // IHDR Chunk Type
      0x00,
      0x00,
      0x00,
      0x0a,
      0x00,
      0x00,
      0x00,
      0x0a,
      0x08,
      0x06,
      0x00,
      0x00,
      0x00, // IHDR Data
      0x8d,
      0x32,
      0x2e,
      0xd8, // IHDR CRC
      0x00,
      0x00,
      0x00,
      0x00,
      0x49,
      0x45,
      0x4e,
      0x44,
      0xae,
      0x42,
      0x60,
      0x82, // IEND
    ]);

    it('should return unchanged buffer if no metadata is provided', () => {
      expect(injectApngMetadata(mockPngHeader, undefined)).toBe(mockPngHeader);
      expect(injectApngMetadata(mockPngHeader, {})).toBe(mockPngHeader);
    });

    it('should inject Title and Description tEXt chunks into PNG buffer', () => {
      const result = injectApngMetadata(
        mockPngHeader,
        { title: 'PNG Title', comment: 'PNG Comment' },
        '1.0.0'
      );
      expect(result.length).toBeGreaterThan(mockPngHeader.length);
      const text = new TextDecoder().decode(result);
      expect(text).toContain('tEXtTitle');
      expect(text).toContain('PNG Title');
      expect(text).toContain('tEXtDescription');
      expect(text).toContain('PNG Comment');
    });
  });
});
