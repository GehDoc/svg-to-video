# Spec: Fix CLI Telemetry Event Tracking & Signal Handling

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Ensure 100% telemetry event reliability (`conversion-start`, `conversion-success`, `conversion-failed`, `conversion-cancel`) in the CLI application by awaiting asynchronous analytics network requests, handling process signals (SIGINT/SIGTERM), and capturing uncaught exceptions properly before exit.

## 🛠 Technical Strategy

- **Analytics Flushing**: Implement `flushAnalytics()` in `src/utils/analytics.ts` to track and await all active Umami HTTP POST promises before process termination.
- **Signal Handling**: Register `SIGINT` and `SIGTERM` process listeners during CLI execution to send `conversion-cancel` events and clean up temporary frames before exiting.
- **Error Exception Handling**: Decouple `convertToOutput()` from direct `logger.fatal()` process exits so that FFmpeg failures propagate to `run()`'s catch block for `tracker.failed()` telemetry dispatching. Update `logger.fatal()` to await `flushAnalytics()` before invoking `process.exit(1)`.

## ✅ Task List

- [ ] **Infrastructure & Analytics Helper**
  - [ ] Implement active promise tracking and `flushAnalytics()` in `src/utils/analytics.ts`
  - [ ] Add `await tracker.flush()` or `await flushAnalytics()` helper in `shared/rendererTracking.ts`
- [ ] **CLI Core Logic & Exception Handling**
  - [ ] Register `SIGINT` / `SIGTERM` signal handlers in `src/index.ts` to trigger `tracker.cancel()`, frame cleanup, analytics flushing, and graceful exit
  - [ ] Refactor `convertToOutput()` to throw standard `Error` objects instead of calling `logger.fatal()`
  - [ ] Ensure `run()` catch block calls `tracker.failed(error)` and awaits `flushAnalytics()` before exiting
  - [ ] Ensure `main().catch()` awaits `flushAnalytics()` before `process.exit(1)`
- [ ] **Verification & Testing**
  - [ ] Add unit/integration tests for telemetry flushing and signal handling
  - [ ] Verify clean conversion, error failure tracking, and Ctrl+C cancellation behavior
- [ ] **Documentation & Pre-flight Checklist**
  - [ ] Update `README.md` & `docs/ARCHITECTURE.md`
  - [ ] Update `docs/ANALYTICS.md` to detail `flushAnalytics` and signal handling
  - [ ] Check `docs/SECURITY.md` (audit subprocess calls, temp file cleanup)
  - [ ] Check `package.json` description & keywords

## 🧪 Verification Plan

- [ ] Manual Test: Run CLI conversion, hit Ctrl+C, verify `conversion-cancel` event and frame cleanup.
- [ ] Manual Test: Run CLI with invalid FFmpeg args or missing output dir, verify `conversion-failed` event sent before exit.
- [ ] Manual Test: Run full CLI conversion, verify `conversion-start` and `conversion-success` events sent before exit.
- [ ] Automated Test: `npm test`

## 📝 Change Log

- 2026-09-28: Initial spec created by Antigravity Agent.
