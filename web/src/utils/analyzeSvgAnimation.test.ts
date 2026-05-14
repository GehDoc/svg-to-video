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

  it('should correctly handle CSS animations with delays and multiple animations', () => {
    const svg = `
      <svg>
        <style>
          .box-lid { animation: closeLidPerspective 0.8s forwards 7.5s; }
          .char-group { animation: walkAndSitFinal 4s linear 8.5s forwards; }
          .char-legs { 
            animation: 
              legSwingWalk 0.4s infinite 8.5s, 
              legsFinal 4s steps(1) 8.5s forwards; 
          }
        </style>
        <rect class="box-lid" />
        <rect class="char-group" />
        <rect class="char-legs" />
      </svg>
    `;
    // Expected:
    // closeLidPerspective: 7.5 + 0.8 = 8.3
    // walkAndSitFinal: 8.5 + 4 = 12.5
    // legSwingWalk: loop 0.4, starts at 8.5
    // legsFinal: 8.5 + 4 = 12.5
    // LCM of loops is 0.4. Max non-loop is 12.5.
    // Smallest multiple of 0.4 >= 12.5 is 12.8.
    expect(analyzeSvgAnimation(svg)).toBe(12.8);
  });

  it('should handle SMIL begin delays', () => {
    const svg = `
      <svg>
        <rect>
          <animate attributeName="opacity" dur="2s" begin="3s" />
        </rect>
      </svg>
    `;
    expect(analyzeSvgAnimation(svg)).toBe(5);
  });

  it('should handle SMIL repeatDur', () => {
    const svg = `
      <svg>
        <rect>
          <animate attributeName="opacity" dur="2s" repeatDur="5s" />
        </rect>
      </svg>
    `;
    expect(analyzeSvgAnimation(svg)).toBe(5);
  });

  it('should detect CSS transitions', () => {
    const svg = `
      <svg>
        <rect style="transition: opacity 1.5s 0.5s" />
      </svg>
    `;
    expect(analyzeSvgAnimation(svg)).toBe(2.0);
  });

  it('should handle standalone CSS duration and delay properties', () => {
    const svg = `
      <svg>
        <style>
          rect { 
            animation-name: fade;
            animation-duration: 2s;
            animation-delay: 1.5s;
          }
        </style>
        <rect />
      </svg>
    `;
    expect(analyzeSvgAnimation(svg)).toBe(3.5);
  });
});
