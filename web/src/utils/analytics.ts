import pkg from '../../package.json';

export type EventProperties = Record<string, unknown> & { version?: never };

/**
 * Centralized helper for tracking Umami analytics events across Web Studio.
 * Spreads custom event properties first, then appends the project version
 * to ensure caller properties cannot override the version tag.
 */
export function trackEvent(
  eventName: string,
  properties?: EventProperties
): void {
  if (typeof umami !== 'undefined') {
    umami.track(eventName, {
      ...properties,
      version: pkg.version,
    });
  }
}
