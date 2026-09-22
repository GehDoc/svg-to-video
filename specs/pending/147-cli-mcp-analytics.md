# Spec: 147 - Unified Analytics Tracking (Umami) for CLI and MCP Interfaces

**GitHub Issue**: [#147](https://github.com/GehDoc/svg-to-video/issues/147)
**Status**: 🟠 Pending

## 🎯 Objective

Implement non-blocking, privacy-respecting Umami telemetry tracking across CLI and MCP interfaces, sharing a unified schema (`file-load`, `conversion-start`, `conversion-success`, `conversion-failed`) with Web Studio analytics while ensuring zero risk to stdio streams or process execution.

## 🛠 Technical Strategy

- **Core Technologies**: Umami HTTP API (`/api/send`), Node.js `fetch`
- **Architecture**:
  - Asynchronous, fire-and-forget background analytics HTTP POST client in CLI/MCP runtime.
  - Fail-safe error handling (catching all network and parser errors silently) to ensure network failures or offline environments never affect CLI exit codes or MCP stdio stream format.
  - Respect `DO_NOT_TRACK` environment variable (`DO_NOT_TRACK=1` or `DO_NOT_TRACK=true`).
  - Custom `User-Agent` header: `svg-to-video/<version> (CLI; node <version>)` or `(MCP; node <version>)` allowing Umami to compute sessions server-side automatically.
  - Internal embedded credentials matching Web Studio:
    - Host URL: `https://cloud.umami.is`
    - Website ID: `4489aba4-cf29-439e-9491-e36f2a531a63`
- **Payload Schema**:
  - Structure Umami POST requests to `https://cloud.umami.is/api/send` with payload:
    - `type: "event"`
    - `payload`: `{ website: "4489aba4-cf29-439e-9491-e36f2a531a63", hostname: "cli" | "mcp", url: "/cli" | "/mcp", event_name: <eventName>, event_data: { ...properties, version: pkg.version } }`
- **Key Dependencies**: Standard Node.js `fetch`.

## ✅ Task List

- [ ] **Infrastructure & Utilities**
  - [ ] Create `src/utils/analytics.ts` for Node.js CLI & MCP interfaces.
  - [ ] Implement `DO_NOT_TRACK` check and opt-out logic.
  - [ ] Build silent, non-blocking HTTP POST sender to Umami `/api/send` with custom `User-Agent`.
- [ ] **CLI & MCP Telemetry Integration**
  - [ ] Track `file-load` event during duration auto-detection in CLI and `inspect_svg_animation` tool in MCP.
  - [ ] Track conversion events (`conversion-start`, `conversion-success`, `conversion-failed`) in CLI execution pipeline.
  - [ ] Track conversion events (`conversion-start`, `conversion-success`, `conversion-failed`) in MCP `render_svg_to_video` tool.
- [ ] **Testing & Quality**
  - [ ] Add unit tests for CLI/MCP analytics helper (verifying payload structure, `DO_NOT_TRACK` honor, and error isolation).
  - [ ] Add integration tests in CLI & MCP test suites.
- [ ] **Documentation & SEO**
  - [ ] Update `docs/ANALYTICS.md` with CLI and MCP tracking schema and privacy flags.
  - [ ] Update `README.md` & `docs/CLI.md` & `docs/MCP.md` regarding telemetry and opt-out instructions (`DO_NOT_TRACK=1`).

## 🧪 Verification Plan

- [ ] Unit Test: `npm run test:unit` verifying `src/utils/analytics.ts` opt-out, fire-and-forget handling, and payload creation.
- [ ] Integration Test: `npm run test:cli` and `npm run test:mcp` passing with analytics active and disabled via `DO_NOT_TRACK=1`.
- [ ] Full project verification: `npm run check`

## 📝 Change Log

- 2026-09-22: Initial spec created for Issue #147.
- 2026-09-22: Updated spec to align `file-load` event naming with Web Studio UI, added User-Agent header for server-side Umami session generation, and refined payload schema.
