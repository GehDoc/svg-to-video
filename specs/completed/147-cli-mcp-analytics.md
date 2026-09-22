# Spec: 147 - Unified Analytics Tracking (Umami) for CLI and MCP Interfaces

**GitHub Issue**: [#147](https://github.com/GehDoc/svg-to-video/issues/147)
**Status**: 🟢 Completed

## 🎯 Objective

Implement non-blocking, privacy-respecting Umami telemetry tracking across CLI and MCP interfaces, sharing a strongly typed TypeScript schema (`file-load`, `conversion-start`, `conversion-success`, `conversion-failed`, `conversion-cancelled`) and a unified `ConversionTracker` class in `shared/` with Web Studio analytics while ensuring zero risk to stdio streams or process execution.

## 🛠 Technical Strategy

- **Core Technologies**: `@umami/node` SDK, TypeScript generics & interfaces
- **Architecture**:
  - Strongly typed shared event contract in `shared/analytics-schema.ts` (`AnalyticsEventMap`).
  - Encapsulated `ConversionTracker` class in `shared/rendererTracking.ts` that manages timer state, computes `processDurationSec`, and tracks lifecycle events (`start`, `success`, `failed`, `cancel`) cleanly across Web Studio, CLI, and MCP.
  - `src/utils/analytics.ts`: wraps `@umami/node` SDK, enforces `AnalyticsEventMap`, implements opt-out logic.
  - `src/utils/packageInfo.ts`: module-level `pkg` constant resolved at load time (works from both `src/utils/` via tsx and `dist/src/utils/` built).
  - Fail-safe fire-and-forget: all network/parse errors silently swallowed — never affects CLI exit code or MCP stdio stream.
  - Respect `DO_NOT_TRACK=1|true`, `CI`, and `NODE_ENV=test` env vars.
  - User-Agent: `Mozilla/5.0 Umami/<node-version>` (via SDK default, accepted by Umami).
  - Hostname: `gehdoc.github.io`, URL: `/cli` or `/mcp` (distinguishes interfaces without needing separate hostnames).
  - Credentials: host `https://cloud.umami.is`, website ID `4489aba4-cf29-439e-9491-e36f2a531a63`.

## ✅ Task List

- [x] **Infrastructure & Utilities**
  - [x] Create `shared/analytics-schema.ts` defining `AnalyticsEventMap` contract.
  - [x] Create `shared/rendererTracking.ts` with `ConversionTracker` class.
  - [x] Create `src/utils/analytics.ts` using `@umami/node` SDK.
  - [x] Create `src/utils/packageInfo.ts` with depth-agnostic `pkg` constant.
  - [x] Update `web/src/utils/analytics.ts` to enforce `AnalyticsEventMap` type safety.
  - [x] Implement `DO_NOT_TRACK`, `CI`, and `NODE_ENV === 'test'` opt-out logic.
- [x] **CLI, MCP & Web Studio Telemetry Integration**
  - [x] Track `file-load` in CLI (`src/index.ts`) and MCP (`src/mcp.ts`).
  - [x] Refactor CLI to use `ConversionTracker` from `shared/rendererTracking.ts`.
  - [x] Refactor Web Studio (`web/src/hooks/useRenderer.ts`) to use `ConversionTracker`.
  - [x] Delete redundant `web/src/utils/tracking/rendererTracking.ts` pass-through.
- [x] **Testing & Quality**
  - [x] Unit tests for CLI/MCP analytics (`src/utils/analytics.test.ts`) — 10 tests passing.
  - [x] Unit tests for `ConversionTracker` (`shared/rendererTracking.test.ts`) — 4 tests passing.
  - [x] `npm run check:fast` passing (lint, format, type-check).
  - [x] `npm run build` passing, `node dist/src/index.js --version` verified.
- [x] **Documentation & SEO**
  - [x] Update `docs/ANALYTICS.md` with CLI/MCP schema, `ConversionTracker`, and privacy flags.
  - [x] Update `docs/CLI.md` (`DO_NOT_TRACK` env var row).
  - [x] Update `docs/MCP.md` (Security section: telemetry & opt-out).
  - [x] Update `README.md` (privacy note covering CLI/MCP/`DO_NOT_TRACK=1`).

## 📝 Change Log

- 2026-09-22: Initial spec created for Issue #147.
- 2026-09-22: Aligned `file-load` naming with Web Studio UI; refined payload schema.
- 2026-09-22: Added `shared/analytics-schema.ts` for compile-time event payload verification.
- 2026-09-22: Moved `rendererTracking.ts` to `shared/` as `ConversionTracker` class.
- 2026-09-22: Switched from manual `fetch` to `@umami/node` SDK for cleaner UA and typed interface.
- 2026-09-22: Fixed `packageInfo.ts` — depth-agnostic `pkg` constant (works from `src/utils/` and `dist/src/utils/`).
- 2026-09-22: Spec completed and moved to `specs/completed/`.
