import { describe, it, expect } from 'vitest';
import { ApngEncoder } from './ApngEncoder';

describe('ApngEncoder', () => {
  it('should initialize and add frames', async () => {
    const encoder = new ApngEncoder(10, 10);
    const frameData = new Uint8Array(10 * 10 * 4);
    encoder.addFrame(frameData, 100);

    // We can't easily verify the encoded output without a full PNG decoder,
    // but we can check if it returns a buffer.
    const result = await encoder.finalize();
    expect(result).toBeInstanceOf(ArrayBuffer);
    expect(result.byteLength).toBeGreaterThan(0);
  });
});
