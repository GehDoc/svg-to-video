# Analytics Implementation (Umami)

This document outlines the unified event tracking strategy across the **Web Studio**, **CLI**, and **Model Context Protocol (MCP)** interfaces using [Umami Analytics](https://umami.is/).

## Event Schema

Note: All events automatically include the application `version` tag (e.g. `version: "0.24.0"`) added by the centralized `trackEvent` helper across browser and Node.js environments.

| Event Name           | Trigger                                | Properties                                                                                                                                                                  | Interfaces           |
| :------------------- | :------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------- |
| `file-load`          | User/Agent loads or inspects an SVG    | `method` (`file-picker` \| `drag-and-drop`), `aspectRatio` (`square` \| `landscape` \| `portrait` \| `unknown`), `hasAnimation`, `detectedDuration`, `isDimensionsDetected` | Web Studio, CLI, MCP |
| `conversion-start`   | Render process begins                  | `format`, `isTransparent`, `captureMethod` (`puppeteer` \| `webcodecs` \| `optimal` \| `canvas`), `fps`, `videoDurationSec`                                                 | Web Studio, CLI, MCP |
| `conversion-success` | Render process completes               | `format`, `isTransparent`, `captureMethod`, `fps`, `videoDurationSec`, `totalFrames`, `processDurationSec`                                                                  | Web Studio, CLI, MCP |
| `conversion-failed`  | Render process errors out              | `error`, `format`, `isTransparent`, `captureMethod`, `processDurationSec`                                                                                                   | Web Studio, CLI, MCP |
| `conversion-cancel`  | User cancels the render                | `format`, `isTransparent`, `captureMethod`, `processDurationSec`                                                                                                            | Web Studio           |
| `click-sponsor`      | User clicks any sponsor/funding link   | `location` (`header` \| `dropdown` \| `success-view`)                                                                                                                       | Web Studio           |
| `copy-data-url`      | User clicks "Copy Data URL"            | `success`, `format`, `isTransparent`                                                                                                                                        | Web Studio           |
| `download-result`    | User clicks "Download"                 | `format`, `isTransparent`                                                                                                                                                   | Web Studio           |
| `back-to-studio`     | User clicks "Back to Studio"           | `format`, `isTransparent`                                                                                                                                                   | Web Studio           |
| `click-issue-report` | User clicks "Report an Issue" in menu  | N/A                                                                                                                                                                         | Web Studio           |
| `click-source-code`  | User clicks "View Source Code" in menu | N/A                                                                                                                                                                         | Web Studio           |

## TypeScript Type Safety & Contract

All analytics event payloads are strictly type-checked at compile time using a shared TypeScript contract interface in [`shared/analytics-schema.ts`](../shared/analytics-schema.ts):

```typescript
import type {
  AnalyticsEventMap,
  AnalyticsEventName,
} from '#shared/analytics-schema';

// Centralized generic trackEvent signature across CLI, MCP, and Web Studio
export function trackEvent<K extends AnalyticsEventName>(
  eventName: K,
  properties?: AnalyticsEventMap[K]
): void;
```

This guarantees that:

- Event names are checked against `keyof AnalyticsEventMap` at compile time.
- Payload properties strictly match the event schema (e.g. `FileLoadEventProperties`, `ConversionStartEventProperties`), preventing invalid property keys or missing fields across call sites.

## Shared `ConversionTracker` Class

Conversion rendering lifecycle events (`conversion-start`, `conversion-success`, `conversion-failed`, `conversion-cancel`) are managed by a shared `ConversionTracker` class in [`shared/rendererTracking.ts`](../shared/rendererTracking.ts):

```typescript
import { ConversionTracker } from '#shared/rendererTracking';

const tracker = new ConversionTracker(
  {
    format: 'webm',
    isTransparent: true,
    captureMethod: 'puppeteer', // or 'webcodecs'
    fps: 60,
    videoDurationSec: 5,
  },
  trackEvent
);

tracker.start();
// Operations...
tracker.success(totalFrames); // Automatically measures elapsed processDurationSec
// Or on failure/cancel:
// tracker.failed(error);
// tracker.cancel();
```

This pattern encapsulates timing measurement (`performance.now()` / `Date.now()`) and avoids timing calculation duplication across Web Studio hooks and CLI render pipelines.

## Implementation Architecture

### 🌐 Web Studio

- **Client**: Standard Umami browser script tag loaded asynchronously.
- **Helper**: `web/src/utils/analytics.ts` and `shared/rendererTracking.ts`.

### 💻 CLI & 🤖 MCP Server

- **Transport**: Asynchronous, fire-and-forget HTTP POST requests to `https://cloud.umami.is/api/send`.
- **Paths & Hostnames**: Requests set `url` to `/cli` or `/mcp` and `hostname` to `cli` or `mcp`.
- **User-Agent Header**: Sets `svg-to-video/<version> (CLI; node <version>)` or `(MCP; node <version>)`, allowing Umami to compute sessions server-side automatically.
- **Fail-Safe Isolation**: All network calls are non-blocking with 3-second timeouts and silent exception handling. Failures never affect CLI exit codes or MCP `stdio` communication streams.
- **Helper**: `src/utils/analytics.ts` and `shared/rendererTracking.ts`.

## Privacy & Opt-Out

- **Do Not Track (`DO_NOT_TRACK`)**: All interfaces respect standard privacy signals. Setting `DO_NOT_TRACK=1` or `DO_NOT_TRACK=true` completely disables telemetry collection.
- **CI/CD & Test Automation**: Telemetry is automatically disabled when running in CI pipelines (`process.env.CI`) or test runners (`process.env.NODE_ENV === 'test'`).
- **No PII**: Tracking is cookie-less and never collects SVG file contents, file paths, file names, or personally identifiable information (PII).
