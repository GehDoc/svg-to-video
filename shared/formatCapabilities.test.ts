import { describe, it, expect } from 'vitest';
import {
  getFormatCapability,
  getAllFormatCapabilities,
  FORMAT_CAPABILITIES,
} from './formatCapabilities.js';

describe('shared formatCapabilities', () => {
  it('should return all format capabilities', () => {
    const all = getAllFormatCapabilities();
    expect(all.length).toBe(6);
    const ids = all.map((f) => f.id);
    expect(ids).toEqual(['mp4', 'webm', 'gif', 'apng', 'mkv', 'mov']);
  });

  it('should resolve formats by ID', () => {
    expect(getFormatCapability('mp4')).toEqual(FORMAT_CAPABILITIES.mp4);
    expect(getFormatCapability('webm')).toEqual(FORMAT_CAPABILITIES.webm);
    expect(getFormatCapability('gif')).toEqual(FORMAT_CAPABILITIES.gif);
    expect(getFormatCapability('apng')).toEqual(FORMAT_CAPABILITIES.apng);
    expect(getFormatCapability('mkv')).toEqual(FORMAT_CAPABILITIES.mkv);
    expect(getFormatCapability('mov')).toEqual(FORMAT_CAPABILITIES.mov);
  });

  it('should resolve formats by extension with leading dot', () => {
    expect(getFormatCapability('.mp4')?.id).toBe('mp4');
    expect(getFormatCapability('.webm')?.id).toBe('webm');
    expect(getFormatCapability('.gif')?.id).toBe('gif');
    expect(getFormatCapability('.apng')?.id).toBe('apng');
    expect(getFormatCapability('.png')?.id).toBe('apng');
    expect(getFormatCapability('.mkv')?.id).toBe('mkv');
    expect(getFormatCapability('.mov')?.id).toBe('mov');
  });

  it('should resolve formats by extension without leading dot', () => {
    expect(getFormatCapability('png')?.id).toBe('apng');
  });

  it('should handle uppercase and whitespace', () => {
    expect(getFormatCapability(' MP4 ')?.id).toBe('mp4');
    expect(getFormatCapability('.WEBM ')?.id).toBe('webm');
  });

  it('should return undefined for unknown format or empty string', () => {
    expect(getFormatCapability('invalid')).toBeUndefined();
    expect(getFormatCapability('')).toBeUndefined();
  });

  it('should have accurate format capability flags', () => {
    expect(FORMAT_CAPABILITIES.gif.needsColorKeying).toBe(true);
    expect(FORMAT_CAPABILITIES.mp4.needsColorKeying).toBe(false);
    expect(FORMAT_CAPABILITIES.webm.needsColorKeying).toBe(false);
    expect(FORMAT_CAPABILITIES.apng.needsColorKeying).toBe(false);

    expect(FORMAT_CAPABILITIES.mp4.supportsAlpha).toBe(false);
    expect(FORMAT_CAPABILITIES.webm.supportsAlpha).toBe(true);
    expect(FORMAT_CAPABILITIES.gif.supportsAlpha).toBe(true);
    expect(FORMAT_CAPABILITIES.apng.supportsAlpha).toBe(true);
    expect(FORMAT_CAPABILITIES.mkv.supportsAlpha).toBe(true);
    expect(FORMAT_CAPABILITIES.mov.supportsAlpha).toBe(true);
  });
});
