import pkg from '../../package.json';
import type {
  AnalyticsEventMap,
  AnalyticsEventName,
} from '../../../shared/analytics-schema';

/**
 * Centralized helper for tracking Umami analytics events across Web Studio.
 * Spreads custom event properties first, then appends the project version
 * to ensure caller properties cannot override the version tag.
 */
export function trackEvent<K extends AnalyticsEventName>(
  eventName: K,
  properties?: AnalyticsEventMap[K]
): void {
  if (typeof umami !== 'undefined') {
    umami.track(eventName, {
      ...properties,
      version: pkg.version,
    });
  }
}
