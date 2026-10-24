import { Umami } from '@umami/node';
import { pkg } from './packageInfo.js';
import type {
  AnalyticsEventMap,
  AnalyticsEventName,
} from '../../shared/analytics-schema.js';
import {
  UMAMI_HOST_URL,
  UMAMI_WEBSITE_HOSTNAME,
  UMAMI_WEBSITE_ID,
} from '../../shared/analytics-schema.js';

export type InterfaceType = 'cli' | 'mcp';

const umami = new Umami({
  hostUrl: UMAMI_HOST_URL,
  websiteId: UMAMI_WEBSITE_ID,
});

const activePromises = new Set<Promise<boolean>>();

export function isOptedOut(): boolean {
  const dnt = process.env.DO_NOT_TRACK;
  if (dnt) {
    const normalized = dnt.trim().toLowerCase();
    if (normalized === '1' || normalized === 'true') {
      return true;
    }
  }

  if (
    process.env.CI ||
    process.env.NODE_ENV === 'test' ||
    process.env.VITEST ||
    process.env.PLAYWRIGHT_TEST
  ) {
    return true;
  }

  return false;
}

export function resolveInterfaceType(
  defaultType: InterfaceType = 'cli'
): InterfaceType {
  if (process.env.SVG_TO_VIDEO_INTERFACE === 'mcp') {
    return 'mcp';
  }
  return defaultType;
}

export function trackEvent<K extends AnalyticsEventName>(
  eventName: K,
  properties?: AnalyticsEventMap[K],
  interfaceType?: InterfaceType
): Promise<boolean> {
  if (isOptedOut()) {
    return Promise.resolve(false);
  }

  const promise = sendEvent(eventName, properties, interfaceType).catch(
    () => false
  );
  activePromises.add(promise);
  promise.finally(() => {
    activePromises.delete(promise);
  });
  return promise;
}

export async function sendEvent<K extends AnalyticsEventName>(
  eventName: K,
  properties?: AnalyticsEventMap[K],
  interfaceType?: InterfaceType
): Promise<boolean> {
  if (isOptedOut()) {
    return false;
  }

  const resolvedInterface = resolveInterfaceType(interfaceType);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await umami.track({
      website: UMAMI_WEBSITE_ID,
      hostname: UMAMI_WEBSITE_HOSTNAME,
      url: `/${resolvedInterface}`,
      name: eventName,
      data: {
        ...properties,
        version: pkg.version,
      },
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function flushAnalytics(timeoutMs = 3000): Promise<void> {
  if (activePromises.size === 0) {
    return;
  }

  const active = Array.from(activePromises);
  const flushPromise = Promise.allSettled(active);

  if (timeoutMs <= 0) {
    await flushPromise;
    return;
  }

  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<void>((resolve) => {
    timeoutId = setTimeout(() => resolve(), timeoutMs);
  });

  await Promise.race([flushPromise.then(() => {}), timeoutPromise]);
  clearTimeout(timeoutId!);
}
