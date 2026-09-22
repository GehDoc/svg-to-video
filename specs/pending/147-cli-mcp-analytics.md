# Spec: 147 - Unified Analytics Tracking (Umami) for CLI and MCP Interfaces

**GitHub Issue**: [#147](https://github.com/GehDoc/svg-to-video/issues/147)
**Status**: 🟠 Pending

## 🎯 Objective

Implement non-blocking, privacy-respecting Umami telemetry tracking across CLI and MCP interfaces, sharing a strongly typed TypeScript schema (`file-load`, `conversion-start`, `conversion-success`, `conversion-failed`) and a unified `ConversionTracker` class in `shared/` with Web Studio analytics while ensuring zero risk to stdio streams or process execution.

## 🛠 Technical Strategy

- **Core Technologies**: Umami HTTP API (`/api/send`), Node.js `fetch`, TypeScript generics & interfaces
- **Architecture**:
  - Strongly typed shared event contract interface in `shared/analytics-schema.ts` (`AnalyticsEventMap`).
  - Encapsulated `ConversionTracker` class in `shared/rendererTracking.ts` that manages timer state (`startTime`), computes `processDurationSec`, and tracks lifecycle events (`start`, `success`, `failed`, `cancel`) cleanly across Web Studio, CLI, and MCP.
  - Asynchronous, fire-and-forget background analytics HTTP POST client in CLI/MCP runtime (`src/utils/analytics.ts`).
  - Fail-safe error handling (catching all network and parser errors silently) to ensure network failures or offline environments never affect CLI exit codes or MCP stdio stream format.
  - Respect `DO_NOT_TRACK` environment variable (`DO_NOT_TRACK=1` or `DO_NOT_TRACK=true`).
  - Automatic isolation for CI (`process.env.CI`) and test runner (`process.env.NODE_ENV === 'test'`) environments.
  - Custom `User-Agent` header: `svg-to-video/<version> (CLI; node <version>)` or `(MCP; node <version>)` allowing Umami to compute sessions server-side automatically.
  - Internal embedded credentials matching Web Studio:
    - Host URL: `https://cloud.umami.is`
    - Website ID: `4489aba4-cf29-439e-9491-e36f2a531a63`
- **Payload Schema**:
  - Structure Umami POST requests to `https://cloud.umami.is/api/send` with payload:
    - `type: "event"`
    - `payload`: `{ website: "4489aba4-cf29-439e-9491-e36f2a531a63", hostname: "cli" | "mcp", url: "/cli" | "/mcp", name: <eventName>, data: { ...properties, version: pkg.version } }`
- **Key Dependencies**: Standard Node.js `fetch`.

## ✅ Task List

- [ ] **Infrastructure & Utilities**
  - [x] Create `shared/analytics-schema.ts` defining `AnalyticsEventMap` contract across Web Studio, CLI, and MCP.
  - [ ] Create shared `ConversionTracker` in `shared/rendererTracking.ts` encapsulating timing state and lifecycle events.
  - [x] Create `src/utils/analytics.ts` for Node.js CLI & MCP interfaces enforcing `AnalyticsEventMap`.
  - [x] Update `web/src/utils/analytics.ts` to enforce `AnalyticsEventMap` type safety.
  - [x] Implement `DO_NOT_TRACK`, `CI`, and `NODE_ENV === 'test'` check and opt-out logic.
  - [x] Build silent, non-blocking HTTP POST sender to Umami `/api/send` with custom `User-Agent`.
- [ ] **CLI, MCP & Web Studio Telemetry Integration**
  - [x] Track `file-load` event during duration auto-detection in CLI and `inspect_svg_animation` tool in MCP.
  - [ ] Refactor CLI (`src/index.ts`) to use `ConversionTracker` from `shared/rendererTracking.ts`.
  - [ ] Refactor Web Studio (`web/src/hooks/useRenderer.ts`) to use `ConversionTracker` from `shared/rendererTracking.ts`.
- [ ] **Testing & Quality**
  - [x] Add unit tests for CLI/MCP analytics helper (verifying payload structure, `DO_NOT_TRACK` honor, and error isolation).
  - [ ] Add unit tests for `ConversionTracker` in `shared/rendererTracking.test.ts`.
  - [ ] Add integration tests in CLI & MCP test suites.
- [ ] **Documentation & SEO**
  - [ ] Update `docs/ANALYTICS.md` with CLI/MCP tracking schema, shared `ConversionTracker`, and privacy flags.
  - [x] Update `README.md` & `docs/CLI.md` & `docs/MCP.md` regarding telemetry and opt-out instructions (`DO_NOT_TRACK=1`).

## 🧪 Verification Plan

- [ ] Unit Test: `npx tsx --test src/utils/analytics.test.ts` and `npx vitest run shared/rendererTracking.test.ts`
- [ ] Integration Test: `npm run test:cli` and `npm run test:mcp` passing with analytics active and disabled via `DO_NOT_TRACK=1`.
- [ ] Type check verification: `npm run type-check`
- [ ] Fast project verification: `npm run check:fast`

## 📝 Change Log

- 2026-09-22: Initial spec created for Issue #147.
- 2026-09-22: Updated spec to align `file-load` event naming with Web Studio UI, added User-Agent header for server-side Umami session generation, and refined payload schema.
- 2026-09-22: Added shared TypeScript contract `shared/analytics-schema.ts` (`AnalyticsEventMap`) for compile-time event payload verification across call sites in response to PR review feedback.
- 2026-09-22: Moving `rendererTracking.ts` to `shared/rendererTracking.ts` with encapsulated `ConversionTracker` class used across Web Studio, CLI, and MCP.
