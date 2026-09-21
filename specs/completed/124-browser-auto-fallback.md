# Spec: 124 - Puppeteer System Browser Auto-Fallback

**GitHub Issue**: [#124](https://github.com/GehDoc/svg-to-video/issues/124)
**Status**: 🟢 Completed

## 🎯 Objective

Ensure `svg-to-video` CLI and MCP executables run cleanly out-of-the-box when invoked on-demand via `npx` or in standalone environments without requiring manual Chrome downloads or environment variables.

## 🛠 Technical Strategy

In `src/index.ts`:

1. Attempt `puppeteer.launch(launchOptions)` with standard bundled Chrome path or `process.env.PUPPETEER_EXECUTABLE_PATH`.
2. If launch fails because Chrome for Testing is missing from `~/.cache/puppeteer` (and `PUPPETEER_EXECUTABLE_PATH` is not set), catch the error and retry launching with `channel: 'chrome'` (Google Chrome system installation).
3. If `channel: 'chrome'` fails or is unavailable, throw original diagnostic error.

## ✅ Task List

- [x] **Core Launcher Fallback**
  - [x] Implement system browser `channel` fallback in `src/index.ts`.
- [x] **Verification**
  - [x] Validate compilation with `npm run build`.
  - [x] Validate test suite with `npm run check:fast` and `npm run test:cli`.
  - [x] Validate standalone tarball conversion via `npm pack` and `npx`.

## 🧪 Verification Plan

- [x] Manual Test: Tested `npx --package ./svg-to-video-0.22.1.tgz svg-to-video ...` without `PUPPETEER_EXECUTABLE_PATH`.
- [x] Automated Test: `npm run test:cli` and `npm run check:fast` passed 100%.

## 📝 Change Log

- 2026-09-18: Initial spec created for system browser auto-fallback.
- 2026-09-18: Implemented system Chrome (`channel: 'chrome'`) fallback in `src/index.ts`. Verified with `npm run build`, `npm run test:cli` (15/15 passed). Marked as completed.
