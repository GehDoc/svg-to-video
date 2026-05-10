/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { parseSvgDimensions, calculateFinalDimensions } from './useRenderer';

describe('useRenderer helpers', () => {
  describe('parseSvgDimensions', () => {
    it('should parse width and height attributes', () => {
      const svg = '<svg width="100" height="200"></svg>';
      expect(parseSvgDimensions(svg)).toEqual({
        width: 100,
        height: 200,
        isDimensionsDetected: true,
      });
    });

    it('should parse viewBox if attributes are missing', () => {
      const svg = '<svg viewBox="0 0 100 200"></svg>';
      expect(parseSvgDimensions(svg)).toEqual({
        width: 100,
        height: 200,
        isDimensionsDetected: true,
      });
    });

    it('should fallback to default dimensions', () => {
      const svg = '<svg></svg>';
      const result = parseSvgDimensions(svg);
      expect(result.width).toBe(1920);
      expect(result.isDimensionsDetected).toBe(false);
    });
  });

  describe('calculateFinalDimensions', () => {
    it('should calculate 720p resolution', () => {
      expect(
        calculateFinalDimensions(1920, 1080, { preset: '720p', scale: 1 })
      ).toEqual({ width: 1280, height: 720 });
    });

    it('should apply scale in original mode', () => {
      expect(
        calculateFinalDimensions(100, 100, { preset: 'original', scale: 2 })
      ).toEqual({ width: 200, height: 200 });
    });
  });
});
