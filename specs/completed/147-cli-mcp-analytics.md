# Spec: 147 - Unified Analytics Tracking (Umami) for CLI and MCP Interfaces

**GitHub Issue**: [#147](https://github.com/GehDoc/svg-to-video/issues/147)
**Status**: 🟢 Completed

## 🎯 Objective

Implement non-blocking, privacy-respecting Umami telemetry tracking across CLI and MCP interfaces, sharing a unified schema (`file-load`, `conversion-start`, `conversion-success`, `conversion-failed`) with Web Studio analytics while ensuring zero risk to stdio streams or process execution.

## 🛠 Technical Strategy

- **Core Technologies**: Umami HTTP API (`/api/send`), Node.js `fetch`
- **Architecture**:
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

- [x] **Infrastructure & Utilities**
  - [x] Create `src/utils/analytics.ts` for Node.js CLI & MCP interfaces.
  - [x] Implement `DO_NOT_TRACK`, `CI`, and `NODE_ENV === 'test'` check and opt-out logic.
  - [x] Build silent, non-blocking HTTP POST sender to Umami `/api/send` with custom `User-Agent`.
- [x] **CLI & MCP Telemetry Integration**
  - [x] Track `file-load` event during duration auto-detection in CLI and `inspect_svg_animation` tool in MCP.
  - [x] Track conversion events (`conversion-start`, `conversion-success`, `conversion-failed`) in CLI execution pipeline.
  - [x] Track conversion events (`conversion-start`, `conversion-success`, `conversion-failed`) in MCP `render_svg_to_video` tool.
- [x] **Testing & Quality**
  - [x] Add unit tests for CLI/MCP analytics helper (verifying payload structure, `DO_NOT_TRACK` honor, and error isolation).
  - [x] Add integration tests in CLI & MCP test suites.
- [x] **Documentation & SEO**
  - [x] Update `docs/ANALYTICS.md` with CLI and MCP tracking schema and privacy flags.
  - [x] Update `README.md` & `docs/CLI.md` & `docs/MCP.md` regarding telemetry and opt-out instructions (`DO_NOT_TRACK=1`).

## 🧪 Verification Plan

- [x] Unit Test: `npx tsx --test src/utils/analytics.test.ts` verifying `src/utils/analytics.ts` opt-out, fire-and-forget handling, and payload creation.
- [x] Integration Test: `npm run test:cli` and `npm run test:mcp` passing with analytics active and disabled via `DO_NOT_TRACK=1`.
- [x] Fast project verification: `npm run check:fast`

## 📝 Change Log

- 2026-09-22: Initial spec created for Issue #147.
- 2026-09-22: Updated spec to align `file-load` event naming with Web Studio UI, added User-Agent header for server-side Umami session generation, and refined payload schema.
- 2026-09-22: Completed implementation of CLI and MCP analytics tracking, added unit and integration tests, updated documentation, and verified full suite. Status set to Completed.
