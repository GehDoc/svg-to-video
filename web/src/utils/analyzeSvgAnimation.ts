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

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    a %= b;
    [a, b] = [b, a];
  }
  return a;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * (b / gcd(a, b)));
}

function calculateLCM(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  let result = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    result = lcm(result, numbers[i]);
    if (result > 3600000) return 3600000;
  }
  return result;
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
    const dur = parseClockValue(el.getAttribute('dur'));
    if (dur === null || dur === 0) return;

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
        totalDur = Math.min(totalDur, repeatDur);
      }
    }

    animations.push({
      duration: isLooping ? dur : totalDur,
      isLooping,
    });
  });

  // 2. CSS Animation Detection (Heuristic)
  const styleTags = Array.from(doc.querySelectorAll('style'));
  const elementsWithStyle = Array.from(doc.querySelectorAll('[style]'));

  const allCss =
    styleTags.map((s) => s.textContent).join('\n') +
    '\n' +
    elementsWithStyle.map((el) => el.getAttribute('style')).join('\n');

  // Look for animation property
  const animationRegex = /animation\s*:\s*([^;}]+)/gi;
  let match;
  while ((match = animationRegex.exec(allCss)) !== null) {
    const animationValue = match[1];
    // Split multiple animations on the same element (separated by comma)
    const subAnimations = animationValue.split(',');

    for (const sub of subAnimations) {
      const isLooping = /infinite/i.test(sub);
      const timeMatches = sub.matchAll(/\b([\d.]+)(s|ms)\b/gi);
      const times: number[] = [];
      for (const tMatch of timeMatches) {
        const val = parseFloat(tMatch[1]);
        const unit = tMatch[2].toLowerCase();
        const seconds = unit === 'ms' ? val / 1000 : val;
        times.push(seconds);
      }

      if (times.length > 0) {
        if (isLooping) {
          // In CSS shorthand: [duration] [timing-function] [delay] ...
          const loopDuration = times[0];
          animations.push({ duration: loopDuration, isLooping: true });

          // Even for looping animations, there's an "effective" end time
          // if it has a delay or if we consider one iteration.
          const totalTime = times.reduce((a, b) => a + b, 0);
          animations.push({ duration: totalTime, isLooping: false });
        } else {
          const totalTime = times.reduce((a, b) => a + b, 0);
          animations.push({ duration: totalTime, isLooping: false });
        }
      }
    }
  }

  // Look for standalone animation-duration / transition-duration
  const durationRegex = /(?:animation|transition)-duration\s*:\s*([^;}]+)/gi;
  while ((match = durationRegex.exec(allCss)) !== null) {
    const valStr = match[1];
    const vals = valStr.split(',');
    for (const v of vals) {
      const timeMatch = v.match(/\b([\d.]+)(s|ms)\b/i);
      if (timeMatch) {
        const val = parseFloat(timeMatch[1]);
        const unit = timeMatch[2].toLowerCase();
        const dur = unit === 'ms' ? val / 1000 : val;
        animations.push({ duration: dur, isLooping: false });
      }
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
