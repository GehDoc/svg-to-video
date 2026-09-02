import { describe, it, expect } from 'vitest';
import { crc32 } from '@shared/crc32';

describe('crc32', () => {
  it('should calculate CRC32 for an empty buffer', () => {
    const input = new Uint8Array([]);
    expect(crc32(input)).toBe(0x00000000);
  });

  it('should calculate CRC32 for standard test string "123456789"', () => {
    const input = new TextEncoder().encode('123456789');
    expect(crc32(input)).toBe(0xcbf43926);
  });

  it('should calculate CRC32 for "The quick brown fox jumps over the lazy dog"', () => {
    const input = new TextEncoder().encode(
      'The quick brown fox jumps over the lazy dog'
    );
    expect(crc32(input)).toBe(0x414fa339);
  });

  it('should return a 32-bit unsigned integer', () => {
    const input = new TextEncoder().encode('PNG');
    const result = crc32(input);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(0xffffffff);
  });
});
