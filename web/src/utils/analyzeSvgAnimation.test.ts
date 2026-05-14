import { describe, it, expect } from 'vitest';
import { analyzeSvgAnimation, parseClockValue } from './analyzeSvgAnimation';

describe('parseClockValue', () => {
  it('should parse simple seconds', () => {
    expect(parseClockValue('5s')).toBe(5);
    expect(parseClockValue('5')).toBe(5);
  });

  it('should parse milliseconds', () => {
    expect(parseClockValue('100ms')).toBe(0.1);
  });

  it('should parse minutes and hours', () => {
    expect(parseClockValue('1min')).toBe(60);
    expect(parseClockValue('1h')).toBe(3600);
  });

  it('should parse clock formats', () => {
    expect(parseClockValue('01:30')).toBe(90);
    expect(parseClockValue('01:00:00')).toBe(3600);
  });

  it('should handle indefinite', () => {
    expect(parseClockValue('indefinite')).toBe(Infinity);
  });
});

describe('analyzeSvgAnimation', () => {
  it('should return null for non-animated SVG', () => {
    const svg = '<svg><rect width="100" height="100"/></svg>';
    expect(analyzeSvgAnimation(svg)).toBeNull();
  });

  it('should detect SMIL animation duration', () => {
    const svg = `
      <svg>
        <rect>
          <animate attributeName="opacity" dur="3s" />
        </rect>
      </svg>
    `;
    expect(analyzeSvgAnimation(svg)).toBe(3);
  });

  it('should detect multiple SMIL animations and return max if no loop', () => {
    const svg = `
      <svg>
        <rect>
          <animate attributeName="opacity" dur="3s" />
          <animate attributeName="width" dur="5s" />
        </rect>
      </svg>
    `;
    expect(analyzeSvgAnimation(svg)).toBe(5);
  });

  it('should detect SMIL repeats', () => {
    const svg = `
      <svg>
        <rect>
          <animate attributeName="opacity" dur="2s" repeatCount="3" />
        </rect>
      </svg>
    `;
    expect(analyzeSvgAnimation(svg)).toBe(6);
  });

  it('should handle LCM for looping SMIL animations', () => {
    const svg = `
      <svg>
        <rect>
          <animate attributeName="opacity" dur="2s" repeatCount="indefinite" />
          <animate attributeName="width" dur="3s" repeatCount="indefinite" />
        </rect>
      </svg>
    `;
    expect(analyzeSvgAnimation(svg)).toBe(6);
  });

  it('should combine looping LCM with non-looping max', () => {
    const svg = `
      <svg>
        <rect>
          <animate attributeName="opacity" dur="2s" repeatCount="indefinite" />
          <animate attributeName="width" dur="7s" />
        </rect>
      </svg>
    `;
    // LCM of looping is 2. Max non-looping is 7.
    // Smallest multiple of 2 >= 7 is 8.
    expect(analyzeSvgAnimation(svg)).toBe(8);
  });

  it('should detect CSS animations (heuristic)', () => {
    const svg = `
      <svg>
        <style>
          .fade { animation: fade 4s infinite; }
          @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
        </style>
        <rect class="fade" />
      </svg>
    `;
    expect(analyzeSvgAnimation(svg)).toBe(4);
  });

  it('should detect inline CSS animations (heuristic)', () => {
    const svg = `
      <svg>
        <rect style="animation: bounce 2.5s" />
      </svg>
    `;
    expect(analyzeSvgAnimation(svg)).toBe(2.5);
  });
});
