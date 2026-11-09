# Spec: Stream PNG Frame Buffers to FFmpeg stdin

**GitHub Issue**: N/A — Originated from PR [#240](https://github.com/GehDoc/svg-to-video/pull/240)
**Status**: 🟠 Pending — Implementation exists on branch `jules-14619308868444751465-2bf4228c`, awaiting review & corrections

---

## 🎯 Objective

Eliminate all intermediate PNG frame files from the CLI/MCP rendering pipeline by streaming Puppeteer screenshot buffers directly into FFmpeg's `stdin` via `pipe:0 / -f image2pipe`, drastically reducing I/O overhead and disk usage. The intermediate files must still be saved to disk **only** when the user explicitly passes `--keep-frames`.

---

## 🛠 Technical Strategy

### Core Idea

Previously the pipeline had two sequential phases:

1. **Render** — Puppeteer writes N PNG files to `outDir/`
2. **Encode** — FFmpeg reads from `outDir/%0Nd.png` pattern, then cleanup

The new pipeline merges these into a single concurrent phase:

1. **Render + Encode (pipelined)** — Puppeteer captures each frame as an in-memory `Buffer`, which is immediately written to FFmpeg's `stdin`. FFmpeg is started first (before Puppeteer) and reads from `pipe:0` using `-f image2pipe`.

### Key Technologies

- **Node.js `child_process.spawn`** (not `execFileSync`) — required to get a live `stdin` stream handle
- **Node.js `Writable` / backpressure** — `writeFrameToStdin()` respects backpressure with the `drain` event pattern
- **FFmpeg `-f image2pipe -i pipe:0`** — reads a concatenated raw PNG stream from stdin
- **All 6 format generators** updated: `mp4`, `webm`, `mkv`, `mov`, `gif`, `apng`

### Architecture Change Summary

| Before                                                                            | After                                                         |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `createFrames()` + `convertToOutput()` + `cleanupFrames()` (3 separate functions) | `renderAndEncodeFrames()` (single merged async function)      |
| `child_process.execFileSync('ffmpeg', ...)` — synchronous, blocking               | `child_process.spawn('ffmpeg', ...)` — async, with stdin pipe |
| Input pattern: `outDir/%04d.png`                                                  | Input pattern: `pipe:0`                                       |
| Frames always written to disk; deleted after unless `--keep-frames`               | Frames **never** written to disk unless `--keep-frames`       |
| Signal handler cleaned up frame files                                             | Signal handler kills FFmpeg process + closes browser          |

---

## ✅ Task List

### Infrastructure

- [x] Update `src/index.ts`: merge render+encode into `renderAndEncodeFrames()` params-object function
- [x] Update all 6 format generators to inject `-f image2pipe` before `-i pipe:0` when `inputPattern` starts with `pipe:`
- [x] Remove old `createFrames()`, `convertToOutput()`, `cleanupFrames()` functions
- [x] Remove `ffmpeg-static` from `devDependencies` (second commit `63428e8` — the first commit erroneously added it)
  > **Out of scope**: properly bundling `ffmpeg-static` as a runtime `dependency` to solve the zero-install UX problem for end-users (issue [#248](https://github.com/GehDoc/svg-to-video/issues/248)) requires also rethinking the CI FFmpeg installation steps and is tracked separately.

### Core Logic

- [x] Implement `writeFrameToStdin()` with backpressure handling (`drain` event)
- [x] Start FFmpeg process **before** Puppeteer render loop (so it is ready to receive frames)
- [x] Stream each captured frame buffer directly to `ffmpegProcess.stdin`
- [x] Conditionally write frame to disk only if `params.keepFrames === true`
- [x] Call `ffmpegProcess.stdin.end()` after all frames are written, then `await ffmpegExitPromise`
- [x] Propagate `postProcess` (e.g., GIF metadata injection) after FFmpeg exits
- [x] Update signal handler: kill active FFmpeg + close active browser on SIGINT/SIGTERM (instead of cleanup frames)

### Tests

- [x] `src/formats/registry.test.ts` — unit test: all 6 generators produce `-f image2pipe` when `inputPattern === 'pipe:0'`
- [x] `tests/cli.spec.ts` — integration test: no PNG files on disk by default after conversion
- [x] `tests/cli.spec.ts` — integration test: 12 PNG files on disk when `--keep-frames` is passed

### Open Issues / Corrections Needed

- [x] **Bug: `writeFrameToStdin` double-resolve race** — fixed in commit `f390638`. The callback is now the sole resolution path; the `drain` listener and conditional `canWrite` gate have been removed.

- [x] **GitHub Review Comment (line 343 `src/index.ts`)**: Replied on GitHub — the params-object refactor is intentional to handle the increased arity.

- [x] **GitHub Review Comment (`package.json`)**: Replied on GitHub — `ffmpeg-static` was erroneously added in `7a9d412` and correctly removed in `63428e8`. Proper runtime bundling tracked in [#248](https://github.com/GehDoc/svg-to-video/issues/248).

- [x] **Missing: `--keep-frames` disk-write should use the same `outDir`** — confirmed correct (`path.join(params.outDir, getFrameFilename(...))`).

- [x] **Missing: error handling for FFmpeg stdin pipe errors** — handled by attaching a no-op `.catch(() => {})` handler to `ffmpegExitPromise` to prevent unhandled rejection events if FFmpeg exits or errors out before/during the frame loop, and safely cleaning up in `finally`.

- [x] **Missing: `--keep-frames` does not clean up on conversion failure** — documented as intentional (partial frames left on disk aid debugging when the user specifically requested frames to be kept).

### Code Review & Hardening Task List (Post-Review TODOs)

Following architectural and stream safety code review, the following improvements have been implemented and verified:

- [x] **Stream Safety: Guard `ffmpegProcess.stdin` against unhandled `EPIPE`**
  - Added explicit `ffmpegProcess.stdin.on('error', ...)` handler ignoring benign `EPIPE`/`ERR_STREAM_DESTROYED` to prevent unhandled stream crash when FFmpeg exits prematurely.
- [x] **Subprocess Safety: Ignore unconsumed `stdout` pipe to prevent deadlock**
  - Configured `stdio: ['pipe', 'ignore', 'pipe']` instead of allocating an unconsumed pipe that can deadlock on 64 KB buffer saturation.
- [x] **Diagnostics: Surface FFmpeg `stderr` when frame write fails**
  - If `writeFrameToStdin()` rejects (e.g. broken pipe), await `ffmpegExitPromise` to extract and report FFmpeg's actual stderr error message.
- [x] **Data Integrity: Terminate FFmpeg and cleanup partial file on render failure**
  - If an error occurs in the render loop, kill FFmpeg with `SIGKILL` instead of calling `stdin.end()` (which produces corrupt/partial files) and unlink any partial output file in `outDir`.
- [x] **Architecture Refactoring: Extract `calculateDimensions`**
  - Separated resolution preset parsing and original dimension scaling into a pure helper function.
- [x] **Architecture Refactoring: Extract `launchBrowser`**
  - Moved Puppeteer executable detection, system Chrome fallback, and launch logic into a dedicated helper.
- [x] **Performance: Throttle CLI frame progress logging to 5% intervals**
  - Throttled `writeProgress` in the render loop so it only updates at 5% intervals (plus frame 1 and final frame), preventing terminal stdout churn on large frame sequences.
- [x] **Verification & Formatting**
  - Ran `npm run check:fast` (lint, prettier, type-check).
  - Ran `npm run test:unit` and `npm run test:cli`.

- [x] Update `docs/ARCHITECTURE.md` — added "CLI Render Pipeline: Pipelined Render + Encode" section with architecture diagram, design decisions, and cross-reference to #248
- [x] Update `docs/ARCHITECTURE.md` — corrected outdated signal handler description
- [x] Update `docs/SECURITY.md` — audited subprocess calls (`child_process.spawn` with typed argument arrays) and updated security guidelines
- [x] No SEO/web surface changes required (this is CLI-only)
- [x] `README.md` — audited: CLI behavior and options remain identical and backward-compatible

---

## 🧪 Verification Plan

- [x] Unit test: `npm run test:unit` — `src/formats/registry.test.ts` verifies `-f image2pipe` injection
- [x] Integration test: `npm run test:cli` — verifies no-PNG and keep-frames behaviors
- [ ] Manual: `svg-to-video input.svg 24 ./out` → no `.png` files in `./out/`, video produced
- [ ] Manual: `svg-to-video input.svg 24 ./out --keep-frames` → `.png` files present in `./out/`
- [ ] Manual: test with GIF output (uses `postProcess`) to ensure post-processing still runs correctly
- [ ] Manual: test with transparent WEBM output (color-keying path) to verify `shouldKey` branch still works under piped mode

---

## 📊 Current State of the PR

### Branch: `jules-14619308868444751465-2bf4228c`

| Commit    | Description                                             | Status             |
| --------- | ------------------------------------------------------- | ------------------ |
| `7a9d412` | Main refactor: stream PNG buffers to FFmpeg stdin       | ✅ Core logic done |
| `63428e8` | Remove erroneously added `ffmpeg-static` dev dependency | ✅ Cleanup done    |

### Open GitHub Review Threads (2 unresolved)

| File               | Comment                                                | Resolution                                                          |
| ------------------ | ------------------------------------------------------ | ------------------------------------------------------------------- |
| `src/index.ts:343` | "why the input is now wrapped in a `param` parameter?" | Needs PR reply; the params-object refactor is intentional and valid |
| `package.json`     | "why do you need this dependency now?"                 | Fixed in `63428e8` — needs PR reply to close thread                 |

### Critical Bug to Fix Before Merge

The `writeFrameToStdin` function has a **potential promise hang** (see Open Issues above). The correct implementation only uses the `write()` callback and does not need a `drain` listener. This must be corrected.

---

## 📝 Change Log

- _2026-10-24: Initial implementation by Jules (google-labs-jules bot) — PR #240 opened._
- _2026-10-27: Follow-up commit `63428e8` by Jules — removes `ffmpeg-static` dev dep following reviewer feedback._
- _2026-10-27: Reviewer (GehDoc) left 2 unresolved comments on PR._
- _2026-11-09: Spec created retroactively by Antigravity to document the work, assess correctness, and identify remaining issues._
- _2026-11-09: Confirmed `ffmpeg-static` bundling (zero-install UX) is out of scope for this PR — tracked in issue [#248](https://github.com/GehDoc/svg-to-video/issues/248)._
- _2026-11-09: Fixed `writeFrameToStdin` promise hang bug (commit `f390638`). Replied to both GitHub review threads. Updated `docs/ARCHITECTURE.md`._
