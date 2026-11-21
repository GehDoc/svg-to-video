# Analytics Implementation (Umami)

This document outlines the unified event tracking strategy across the **Web Studio**, **CLI**, and **Model Context Protocol (MCP)** interfaces using [Umami Analytics](https://umami.is/).

## Event Schema

Note: All events automatically include the application `version` tag (e.g. `version: "0.24.0"`) added by the centralized `trackEvent` helper across browser and Node.js environments.

| Event Name           | Trigger                                | Properties                                                                                                                                                                              | Interfaces           |
| :------------------- | :------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------- |
| `file-load`          | User/Agent loads or inspects an SVG    | `method` (`file-picker` \| `drag-and-drop` \| `sample`), `aspectRatio` (`square` \| `landscape` \| `portrait` \| `unknown`), `hasAnimation`, `detectedDuration`, `isDimensionsDetected` | Web Studio, CLI, MCP |
| `conversion-start`   | Render process begins                  | `format`, `isTransparent`, `captureMethod` (`puppeteer` \| `webcodecs` \| `optimal` \| `canvas`), `fps`, `videoDurationSec`                                                             | Web Studio, CLI, MCP |
| `conversion-success` | Render process completes               | `format`, `isTransparent`, `captureMethod`, `fps`, `videoDurationSec`, `totalFrames`, `processDurationSec`                                                                              | Web Studio, CLI, MCP |
| `conversion-failed`  | Render process errors out              | `error`, `format`, `isTransparent`, `captureMethod`, `processDurationSec`                                                                                                               | Web Studio, CLI, MCP |
| `conversion-cancel`  | User cancels the render                | `format`, `isTransparent`, `captureMethod`, `processDurationSec`                                                                                                                        | Web Studio           |
| `click-sponsor`      | User clicks any sponsor/funding link   | `location` (`header` \| `dropdown` \| `success-view`)                                                                                                                                   | Web Studio           |
| `copy-data-url`      | User clicks "Copy Data URL"            | `success`, `format`, `isTransparent`                                                                                                                                                    | Web Studio           |
| `download-result`    | User clicks "Download"                 | `format`, `isTransparent`                                                                                                                                                               | Web Studio           |
| `back-to-studio`     | User clicks "Back to Studio"           | `format`, `isTransparent`                                                                                                                                                               | Web Studio           |
| `click-home`         | User clicks Home / Logo or Reset SVG   | `location` (`header` \| `config-source`)                                                                                                                                                | Web Studio           |
| `open-samples`       | User opens the SVG sample picker       | `location` (`config-source`)                                                                                                                                                            | Web Studio           |
| `click-issue-report` | User clicks "Report an Issue" in menu  | N/A                                                                                                                                                                                     | Web Studio           |
| `click-source-code`  | User clicks "View Source Code" in menu | N/A                                                                                                                                                                                     | Web Studio           |

### Telemetry Locations Reference

For events carrying a `location` property (`click-sponsor`, `click-home`, `open-samples`), the following standardized location tokens identify the originating UI surface:

| Location Token  | UI Component         | Landmark & Context                                                                                 | Associated Events             |
| :-------------- | :------------------- | :------------------------------------------------------------------------------------------------- | :---------------------------- |
| `header`        | `Header.tsx`         | Top application header bar (clicking title/logo home button or header sponsor link)                | `click-home`, `click-sponsor` |
| `dropdown`      | `HeaderDropdown.tsx` | Dropdown menu toggled from the header hamburger action (clicking sponsor link)                     | `click-sponsor`               |
| `config-source` | `ConfigPanel.tsx`    | Section 1 (_Source_) of the Configuration Panel (clicking "Browse Samples" or "Clear SVG" buttons) | `click-home`, `open-samples`  |
| `success-view`  | `SuccessView.tsx`    | Post-render completion screen (clicking GitHub sponsor link)                                       | `click-sponsor`               |

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

- **Transport**: Asynchronous, fire-and-forget HTTP POST requests via the [`@umami/node`](https://github.com/umami-software/node) SDK.
- **Paths & Hostname**: Requests set `url` to `/cli` or `/mcp` (distinguishing the interface) and `hostname` to `gehdoc.github.io` (same as the Web Studio, allowing unified session tracking in the Umami dashboard).
- **User-Agent Header**: `Mozilla/5.0 Umami/<node-version>` (SDK default — accepted by Umami's server).
- **Shared Constants**: `UMAMI_HOST_URL`, `UMAMI_WEBSITE_ID`, and `UMAMI_WEBSITE_HOSTNAME` are declared once in [`shared/analytics-schema.ts`](../shared/analytics-schema.ts) and imported by both the CLI/MCP analytics module and the Web Studio layout.
- **Fail-Safe Isolation & Promise Flushing**: All network calls are non-blocking with 3-second timeouts and silent exception handling. To ensure asynchronous telemetry payloads (`conversion-success`, `conversion-failed`, `conversion-cancel`) complete before process termination, the CLI module tracks active HTTP promises and awaits `flushAnalytics()` before process exit, fatal error output, or process signal interrupts.
- **Process Signal Handling**: SIGINT (`Ctrl+C`) and SIGTERM signals trigger `tracker.cancel()`, clean up temporary frame files, await pending analytics flush, and exit cleanly with status code 130.
- **Helper**: `src/utils/analytics.ts` and `shared/rendererTracking.ts`.

## Privacy & Opt-Out

- **Do Not Track (`DO_NOT_TRACK`)**: All interfaces respect standard privacy signals. Setting the `DO_NOT_TRACK` environment variable to `1` or `true` (e.g. `DO_NOT_TRACK=1 svg-to-video ...`) completely disables telemetry collection.
- **CI/CD & Test Automation**: Telemetry is automatically disabled when running in CI pipelines (`process.env.CI`) or test runners (`process.env.NODE_ENV === 'test'`).
- **No PII**: Tracking is cookie-less and never collects SVG file contents, file paths, file names, or personally identifiable information (PII).

---

## Inbound Traffic & UTM Tracking Guidelines

When adding or updating links pointing to our web apps/demos (such as `svg-to-video`), please include consistent UTM query parameters so traffic sources remain accurate in Umami:

- **Naming format**: Use lowercase `snake_case` (e.g., `github_pages_profile`, `readme`).
- **Don't over-specify platform in READMEs**: Because `README.md` files are mirrored across platforms (GitHub, npm, etc.), use `utm_source=readme` rather than `github_readme`.

### Standard Values

| Location                                  | `utm_source`           | `utm_medium` (optional) |
| :---------------------------------------- | :--------------------- | :---------------------- |
| GitHub Pages profile (`gehdoc.github.io`) | `github_pages_profile` | `featured_project`      |
| GitHub repository "About" link            | `github_repo_about`    | —                       |
| GitHub Sponsors page                      | `github_sponsors`      | —                       |
| Repository `README.md`                    | `readme`               | `docs`                  |

### Examples

- `https://gehdoc.github.io/svg-to-video/?utm_source=github_pages_profile&utm_medium=featured_project`
- `https://gehdoc.github.io/svg-to-video/?utm_source=github_repo_about`
- `https://gehdoc.github.io/svg-to-video/?utm_source=github_sponsors`
- `https://gehdoc.github.io/svg-to-video/?utm_source=readme&utm_medium=docs`
