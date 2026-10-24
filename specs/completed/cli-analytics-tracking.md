# Spec: Fix CLI Telemetry Event Tracking & Signal Handling

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Ensure 100% telemetry event reliability (`conversion-start`, `conversion-success`, `conversion-failed`, `conversion-cancel`) in the CLI application by awaiting asynchronous analytics network requests, handling process signals (SIGINT/SIGTERM), and capturing uncaught exceptions properly before exit.

## 🛠 Technical Strategy

- **Analytics Flushing**: Implement `flushAnalytics()` in `src/utils/analytics.ts` to track and await all active Umami HTTP POST promises before process termination.
- **Signal Handling**: Register `SIGINT` and `SIGTERM` process listeners during CLI execution to send `conversion-cancel` events and clean up temporary frames before exiting.
- **Error Exception Handling**: Decouple `convertToOutput()` from direct `logger.fatal()` process exits so that FFmpeg failures propagate to `run()`'s catch block for `tracker.failed()` telemetry dispatching. Update `logger.fatal()` to await `flushAnalytics()` before invoking `process.exit(1)`.

## ✅ Task List

- [x] **Infrastructure & Analytics Helper**
  - [x] Implement active promise tracking and `flushAnalytics()` in `src/utils/analytics.ts`
  - [x] Add promise-compatible `TrackFn` and method signatures in `shared/rendererTracking.ts`
- [x] **CLI Core Logic & Exception Handling**
  - [x] Register `SIGINT` / `SIGTERM` signal handlers in `src/index.ts` to trigger `tracker.cancel()`, frame cleanup, analytics flushing, and graceful exit
  - [x] Refactor `convertToOutput()` to throw standard `Error` objects instead of calling `logger.fatal()`
  - [x] Ensure `run()` catch block calls `tracker.failed(error)` and awaits `flushAnalytics()` before exiting
  - [x] Ensure `main().catch()` awaits `flushAnalytics()` before `process.exit(1)`
- [x] **Verification & Testing**
  - [x] Add unit/integration tests for telemetry flushing and signal handling
  - [x] Verify clean conversion, error failure tracking, and Ctrl+C cancellation behavior
- [x] **Documentation & Pre-flight Checklist**
  - [x] Update `docs/ANALYTICS.md` to detail `flushAnalytics` and signal handling
  - [x] Check `docs/SECURITY.md` (audit subprocess calls, temp file cleanup)
  - [x] Check `package.json` description & keywords

## 🧪 Verification Plan

- [x] Manual Test: Run CLI conversion, hit Ctrl+C, verify `conversion-cancel` event and frame cleanup.
- [x] Manual Test: Run CLI with invalid FFmpeg args or missing output dir, verify `conversion-failed` event sent before exit.
- [x] Manual Test: Run full CLI conversion, verify `conversion-start` and `conversion-success` events sent before exit.
- [x] Automated Test: `npm run type-check && npm run test:cli && npm run test:unit`

## 📝 Change Log

- 2026-09-28: Initial spec created by Antigravity Agent.
- 2026-09-29: Implemented active analytics promise tracking, `flushAnalytics()`, `SIGINT`/`SIGTERM` process signal handlers, and refactored error propagation in CLI. Verified with unit and CLI test suites.
