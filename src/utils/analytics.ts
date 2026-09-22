import { getPackageJson } from './packageInfo.js';
import type {
  AnalyticsEventMap,
  AnalyticsEventName,
} from '../../shared/analytics-schema.js';

export const UMAMI_ENDPOINT = 'https://cloud.umami.is/api/send';
export const UMAMI_WEBSITE_ID = '4489aba4-cf29-439e-9491-e36f2a531a63';

export type InterfaceType = 'cli' | 'mcp';

export function isOptedOut(): boolean {
  const dnt = process.env.DO_NOT_TRACK;
  if (dnt) {
    const normalized = dnt.trim().toLowerCase();
    if (normalized === '1' || normalized === 'true') {
      return true;
    }
  }

  if (process.env.CI || process.env.NODE_ENV === 'test') {
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
): void {
  if (isOptedOut()) {
    return;
  }

  sendEvent(eventName, properties, interfaceType).catch(() => {
    // Silent fail-safe
  });
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
    const pkg = getPackageJson(import.meta.url);
    const payload = {
      type: 'event',
      payload: {
        website: UMAMI_WEBSITE_ID,
        hostname: resolvedInterface,
        url: `/${resolvedInterface}`,
        name: eventName,
        data: {
          ...properties,
          version: pkg.version,
        },
      },
    };

    const response = await fetch(UMAMI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': `svg-to-video/${pkg.version} (${resolvedInterface.toUpperCase()}; node ${process.version})`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}
