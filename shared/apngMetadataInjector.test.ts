import { describe, it, expect } from 'vitest';
import { injectApngMetadata, setApngNumPlays } from './apngMetadataInjector.js';

describe('shared apngMetadataInjector', () => {
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

  describe('setApngNumPlays', () => {
    it('should return unchanged buffer if signature is invalid or buffer is too short', () => {
      const shortBuf = new Uint8Array([1, 2, 3]);
      expect(setApngNumPlays(shortBuf, 1)).toBe(shortBuf);

      const invalidSig = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
      expect(setApngNumPlays(invalidSig, 1)).toBe(invalidSig);
    });

    it('should return unchanged buffer if no acTL chunk is present', () => {
      const result = setApngNumPlays(mockPngHeader, 1);
      expect(result).toEqual(mockPngHeader);
    });

    it('should update num_plays at offset 12 and recompute valid CRC32', () => {
      // Create a valid mock PNG with an acTL chunk
      // 8 bytes signature + acTL chunk (4 len, 4 type, 8 data [4 frames, 4 plays], 4 CRC)
      const apngWithAcTL = new Uint8Array([
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
        0x08, // Length: 8
        0x61,
        0x63,
        0x54,
        0x4c, // Type: 'acTL'
        0x00,
        0x00,
        0x00,
        0x0a, // num_frames: 10
        0x00,
        0x00,
        0x00,
        0x00, // num_plays: 0 (infinite)
        0x00,
        0x00,
        0x00,
        0x00, // CRC (placeholder)
      ]);

      const updated = setApngNumPlays(apngWithAcTL, 1);
      const view = new DataView(
        updated.buffer,
        updated.byteOffset,
        updated.byteLength
      );
      expect(view.getUint32(20, false)).toBe(1); // num_plays updated to 1
      const updatedCrc = view.getUint32(24, false);
      expect(updatedCrc).not.toBe(0); // CRC recomputed
    });

    it('should not throw if chunkLength exceeds buffer length (corrupted chunk)', () => {
      const corruptBuf = new Uint8Array([
        0x89,
        0x50,
        0x4e,
        0x47,
        0x0d,
        0x0a,
        0x1a,
        0x0a, // PNG Signature
        0xff,
        0xff,
        0xff,
        0xff, // Corrupted length
        0x61,
        0x63,
        0x54,
        0x4c, // Type: 'acTL'
      ]);
      expect(() => setApngNumPlays(corruptBuf, 1)).not.toThrow();
    });
  });
});
