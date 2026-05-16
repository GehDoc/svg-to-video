/**
 * Utility to analyze SVG content and detect its animation duration.
 */

export interface AnimationInfo {
  duration: number; // in seconds
  isLooping: boolean;
}

/**
 * Parses an SVG clock value (e.g., "5s", "100ms", "1:30") into seconds.
 */
export function parseClockValue(value: string | null): number | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed === 'indefinite') return Infinity;

  // hh:mm:ss.sss or mm:ss.sss
  const parts = trimmed.split(':');
  if (parts.length > 1) {
    let seconds = 0;
    if (parts.length === 3) {
      seconds += parseFloat(parts[0]) * 3600; // hours
      seconds += parseFloat(parts[1]) * 60; // minutes
      seconds += parseFloat(parts[2]); // seconds
    } else if (parts.length === 2) {
      seconds += parseFloat(parts[0]) * 60; // minutes
      seconds += parseFloat(parts[1]); // seconds
    }
    return isNaN(seconds) ? null : seconds;
  }

  // 5s, 100ms, 1min, 1h
  const match = trimmed.match(/^([\d.]+)(h|min|s|ms)?$/);
  if (!match) return null;
  const num = parseFloat(match[1]);
  const unit = (match[2] || 's').toLowerCase();
  switch (unit) {
    case 'h':
      return num * 3600;
    case 'min':
      return num * 60;
    case 's':
      return num;
    case 'ms':
      return num / 1000;
    default:
      return num;
  }
}

/**
 * Computes the Greatest Common Divisor of two numbers.
 * Used for calculating the Least Common Multiple (LCM).
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    a %= b;
    [a, b] = [b, a];
  }
  return a;
}

/**
 * Computes the Least Common Multiple of two numbers.
 * Used to find the synchronization point of multiple looping animations.
 */
export function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * (b / gcd(a, b)));
}

/**
 * Computes the Least Common Multiple of an array of numbers.
 * Caps the result at 1 hour (3,600,000 ms) to avoid infinite loops or astronomical durations.
 */
export function calculateLCM(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  let result = numbers[0];
  if (result > 3600000) return 3600000;
  for (let i = 1; i < numbers.length; i++) {
    result = lcm(result, numbers[i]);
    if (result > 3600000) return 3600000;
  }
  return result;
}

/**
 * Extracts all time values (seconds or milliseconds) from a CSS property value string.
 */
export function extractTimes(str: string): number[] {
  const matches = str.matchAll(/\b([\d.]+)(s|ms)\b/gi);
  return Array.from(matches).map((m) => {
    const val = parseFloat(m[1]);
    const unit = m[2].toLowerCase();
    return unit === 'ms' ? val / 1000 : val;
  });
}

/**
 * Analyzes the SVG content and returns a recommended duration in seconds.
 * Returns null if no animation is detected.
 */
export const analyzeSvgAnimation = (svgContent: string): number | null => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const animations: AnimationInfo[] = [];

  // 1. Manual SMIL Parsing
  const smilElements = doc.querySelectorAll(
    'animate, animateTransform, animateMotion, animateColor, set'
  );
  smilElements.forEach((el) => {
    const dur = parseClockValue(el.getAttribute('dur')) || 0;
    const begin = parseClockValue(el.getAttribute('begin')) || 0;
    const repeatCount = el.getAttribute('repeatCount');
    const repeatDur = parseClockValue(el.getAttribute('repeatDur'));
    const isLooping = repeatCount === 'indefinite' || repeatDur === Infinity;

    let totalDur = dur;
    if (!isLooping) {
      if (repeatCount) {
        const count = parseFloat(repeatCount);
        if (!isNaN(count)) totalDur *= count;
      }
      if (repeatDur !== null && repeatDur < Infinity) {
        totalDur = Math.max(totalDur, repeatDur);
      }
    }

    animations.push({
      duration: isLooping ? dur : begin + totalDur,
      isLooping,
    });
  });

  // 2. CSS Animation Detection (Heuristic)
  const styleTags = Array.from(doc.querySelectorAll('style'));
  const elementsWithStyle = Array.from(doc.querySelectorAll('[style]'));

  // Extract all CSS rules (from style tags)
  const styleRules =
    styleTags
      .map((s) => s.textContent)
      .join('\n')
      .match(/[^{}]+\{[^{}]+\}/g) || [];

  // Extract all inline styles (pretend they are rules)
  const inlineRules = elementsWithStyle.map(
    (el) => `* { ${el.getAttribute('style')} }`
  );

  const allRules = [...styleRules, ...inlineRules];

  for (const rule of allRules) {
    const content = rule.substring(
      rule.indexOf('{') + 1,
      rule.lastIndexOf('}')
    );
    const props = content
      .split(';')
      .map((p) => p.trim())
      .filter(Boolean);

    // Track durations and delays per rule to handle separate properties
    let maxRuleDur = 0;
    let maxRuleDelay = 0;
    const ruleHasInfinite = /infinite/i.test(content);

    for (const prop of props) {
      const [name, val] = prop.split(':').map((s) => s.trim().toLowerCase());
      if (!name || !val) continue;

      if (name === 'animation' || name === 'transition') {
        const subs = val.split(',');
        for (const sub of subs) {
          const times = extractTimes(sub);
          const isLooping = /infinite/i.test(sub);
          if (times.length > 0) {
            if (isLooping) {
              animations.push({ duration: times[0], isLooping: true });
              // Also track total effective time (dur + delay) for the first iteration
              animations.push({
                duration: times.reduce((a, b) => a + b, 0),
                isLooping: false,
              });
            } else {
              animations.push({
                duration: times.reduce((a, b) => a + b, 0),
                isLooping: false,
              });
            }
          }
        }
      } else if (name.includes('duration')) {
        const times = extractTimes(val);
        maxRuleDur = Math.max(maxRuleDur, ...times);
      } else if (name.includes('delay')) {
        const times = extractTimes(val);
        maxRuleDelay = Math.max(maxRuleDelay, ...times);
      }
    }

    if (maxRuleDur > 0 || maxRuleDelay > 0) {
      animations.push({
        duration: maxRuleDur + maxRuleDelay,
        isLooping: ruleHasInfinite,
      });
    }
  }

  if (animations.length === 0) return null;

  const looping = animations.filter((a) => a.isLooping).map((a) => a.duration);
  const nonLooping = animations
    .filter((a) => !a.isLooping)
    .map((a) => a.duration);

  if (looping.length > 0) {
    const loopingMs = looping.map((d) => Math.round(d * 1000));
    const lcmMs = calculateLCM(loopingMs);
    const maxNonLoopingS = nonLooping.length > 0 ? Math.max(...nonLooping) : 0;

    let totalMs = lcmMs;
    if (maxNonLoopingS * 1000 > totalMs) {
      totalMs = Math.ceil((maxNonLoopingS * 1000) / lcmMs) * lcmMs;
    }
    return totalMs / 1000;
  } else if (nonLooping.length > 0) {
    return Math.max(...nonLooping);
  }

  return null;
};
