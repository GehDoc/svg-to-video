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

| Before | After |
|--------|-------|
| `createFrames()` + `convertToOutput()` + `cleanupFrames()` (3 separate functions) | `renderAndEncodeFrames()` (single merged async function) |
| `child_process.execFileSync('ffmpeg', ...)` — synchronous, blocking | `child_process.spawn('ffmpeg', ...)` — async, with stdin pipe |
| Input pattern: `outDir/%04d.png` | Input pattern: `pipe:0` |
| Frames always written to disk; deleted after unless `--keep-frames` | Frames **never** written to disk unless `--keep-frames` |
| Signal handler cleaned up frame files | Signal handler kills FFmpeg process + closes browser |

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
- [ ] **Bug: `writeFrameToStdin` double-resolve race** — the current implementation can call `resolve()` twice in some cases. When `stdin.write()` returns `false` (backpressure), the callback is registered for the error/resolve case, **and** `drain` is registered. If the write completes with no error while also draining, neither resolves until drain, which is correct. However, if `canWrite` is `true`, the callback resolves, but the `drain` listener is never added — this is correct. But if `canWrite` is `false` and the callback fires with no error, neither the callback nor `drain` calls `resolve()` — **the promise hangs forever**. Correct pattern: resolve/reject in the callback only, and use `drain` as an alternative resolution path only when backpressure is active but callback was not yet called. The correct robust implementation is:
  ```typescript
  function writeFrameToStdin(stdin: Writable, buffer: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      const ok = stdin.write(buffer, (err) => {
        if (err) reject(err);
        else resolve();
      });
      // No need for drain listener — the write callback fires when the data
      // is flushed regardless of backpressure. The return value of .write()
      // is only a hint for flow-control; the callback is always called.
    });
  }
  ```
  > The current code adds a `drain` listener on the stream that may never fire (if the write already completed), causing a leaked listener, and in some paths `resolve` is never called. **This must be fixed.**

- [ ] **GitHub Review Comment (line 343 `src/index.ts`)**: Reviewer asked *"why the input is now wrapped in a `param` parameter?"*. The function signature changed from positional arguments to a single `params` object. This was a stylistic refactor to handle the increased arity (11+ params). The reviewer's comment is a question, not a bug. **Response needed** in PR, or the code could be kept as-is (the params-object style is better practice for many-argument functions).

- [ ] **GitHub Review Comment (`package.json`)**: Reviewer asked *"why do you need this dependency now? and why was it correct to not have it until now?"* — this refers to `ffmpeg-static` which was added in commit `7a9d412` but **then removed** in the follow-up commit `63428e8`. The dependency is correctly absent from the final state of the branch. The PR just needs an explanatory comment that the second commit resolved this. The larger question of bundling `ffmpeg-static` as a proper runtime dependency is tracked in issue [#248](https://github.com/GehDoc/svg-to-video/issues/248) and is out of scope for this PR.

- [ ] **Missing: `--keep-frames` disk-write should use the same `outDir`** — confirm that when `keepFrames` is true, frames go to the same `outDir` as before. Currently they do (`path.join(params.outDir, getFrameFilename(...))`). ✅ Correct.

- [ ] **Missing: error handling for FFmpeg stdin pipe errors** — if FFmpeg exits early (e.g., codec error on frame 3 of 100), `ffmpegProcess.stdin.write()` will emit an `'error'` event on the stdin stream. This error propagates through `writeFrameToStdin` reject path → will throw in the for-loop → will propagate to `renderAndEncodeFrames` catch → caller. This seems OK, but the `ffmpegExitPromise` will also reject. Need to verify no unhandled rejection occurs. Consider using `Promise.race()` on `ffmpegExitPromise` and frame streaming to fail fast.

- [ ] **Missing: `--keep-frames` does not clean up on conversion failure** — in the old code, `cleanupFrames()` was called on error. Now, with piped frames, partial frames written under `--keep-frames` are left on disk on failure. This is acceptable (debugging aid) but should be documented.

### Documentation & SEO (Pre-Flight)
- [ ] Update `docs/ARCHITECTURE.md` — the render pipeline section needs to reflect the merged `renderAndEncodeFrames()` approach
- [ ] Update `docs/SECURITY.md` — `stdin` pipe introduces a new data flow; confirm no shell injection since args are passed as array (spawn, not exec)
- [ ] No SEO/web surface changes required (this is CLI-only)
- [ ] `README.md` — no functional change visible to users (behavior identical unless `--keep-frames`)

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

| Commit | Description | Status |
|--------|-------------|--------|
| `7a9d412` | Main refactor: stream PNG buffers to FFmpeg stdin | ✅ Core logic done |
| `63428e8` | Remove erroneously added `ffmpeg-static` dev dependency | ✅ Cleanup done |

### Open GitHub Review Threads (2 unresolved)

| File | Comment | Resolution |
|------|---------|------------|
| `src/index.ts:343` | "why the input is now wrapped in a `param` parameter?" | Needs PR reply; the params-object refactor is intentional and valid |
| `package.json` | "why do you need this dependency now?" | Fixed in `63428e8` — needs PR reply to close thread |

### Critical Bug to Fix Before Merge

The `writeFrameToStdin` function has a **potential promise hang** (see Open Issues above). The correct implementation only uses the `write()` callback and does not need a `drain` listener. This must be corrected.

---

## 📝 Change Log

- _2026-10-24: Initial implementation by Jules (google-labs-jules bot) — PR #240 opened._
- _2026-10-27: Follow-up commit `63428e8` by Jules — removes `ffmpeg-static` dev dep following reviewer feedback._
- _2026-10-27: Reviewer (GehDoc) left 2 unresolved comments on PR._
- _2026-11-09: Spec created retroactively by Antigravity to document the work, assess correctness, and identify remaining issues._
- _2026-11-09: Confirmed `ffmpeg-static` bundling (zero-install UX) is out of scope for this PR — tracked in issue [#248](https://github.com/GehDoc/svg-to-video/issues/248)._
