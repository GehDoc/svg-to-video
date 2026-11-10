# Spec: 248 - Simpler, Reliable FFmpeg Fallback and Docker Build Optimization

**GitHub Issue**: [#248](https://github.com/GehDoc/svg-to-video/issues/248)
**Status**: 🟠 Pending

## 🎯 Objective

Enable CLI users without system-installed FFmpeg to seamlessly run `svg-to-video` through an automated, safe fallback mechanism for minimal FFmpeg, and drastically reduce Docker build time and image bloat by optimizing Chromium/FFmpeg provisioning.

---

## 🔍 Background & Context

- Currently, `svg-to-video` CLI spawns `ffmpeg` directly from the host `$PATH` (`child_process.spawn('ffmpeg', ...)`). If FFmpeg is not installed, the process abruptly crashes with `ENOENT`.
- In PR #240, bundling `ffmpeg-static` in `devDependencies` was tested but removed following review feedback (commit `63428e8`): `devDependencies` are not present for end-users running `npx svg-to-video`, and unconditionally bundling a full static FFmpeg (~70MB) adds bloat for users who already have FFmpeg.
- In Docker, the current build layer executes `apt-get update && apt-get upgrade -y && apt-get install -y chromium ffmpeg ...` on `node:24-trixie-slim`, causing long build times, large download sizes, and cache busts.
- Issue [#248](https://github.com/GehDoc/svg-to-video/issues/248) asks:
  1. How to allow a fallback install of a minimal FFmpeg with only necessary codecs for CLI users?
  2. How to reduce the Docker install step (can we use a base docker image or multi-stage pattern that already has FFmpeg and Chromium)?

---

## 🛠 Technical Strategy

### 1. CLI FFmpeg Detection & Fallback Resolution Pipeline

We will introduce a dedicated FFmpeg resolver (`src/utils/ffmpegResolver.ts`) that executes before the render/encode pipeline:

1. **System Check (`$PATH`)**:
   - Check if `ffmpeg` is available on the system `$PATH` (e.g. probing `ffmpeg -version` or resolving via path lookup).
   - If found, use system FFmpeg directly. Zero overhead, 100% backward-compatible.

2. **Cached Fallback Check**:
   - Check application cache directory (`~/.cache/svg-to-video/ffmpeg` or platform equivalent via `env-paths`).
   - If a valid executable binary exists in cache, use it.

3. **Fallback Provisioning (When Not Found)**:
   - When neither system nor cached FFmpeg is found:
     - If in interactive TTY: Prompt user for confirmation to download minimal static FFmpeg to user cache.
     - If non-interactive / CI (or `--yes` / `--auto-install-ffmpeg` flag passed): Auto-download or display actionable, copy-pasteable installation instructions depending on configuration.
     - Security: Enforce HTTPS download from verified static binary sources, validate SHA256 checksums, and set strict permissions (`chmod 0755`) per `docs/SECURITY.md`.

4. **Required Codecs & Filters Audit**:
   - `svg-to-video` only requires:
     - Encoders: `libx264` (MP4, MOV, MKV), `libvpx-vp9` (WebM, MKV), `apng` (APNG), `gif` (GIF).
     - Demuxer: `image2pipe` (PNG piped input from Puppeteer).
     - Filters: `palettegen`, `paletteuse` (GIF), `colorkey`, `split` (transparent WebM/MOV), `scale` (resolution scaling/padding).

### 2. Docker Build Optimization

1. **Eliminate Redundant APT Packages & Upgrades**:
   - Remove `apt-get upgrade -y` which updates unnecessary OS packages during build.
   - Use multi-stage `COPY --from` pattern (e.g. `COPY --from=mwader/static-ffmpeg:7.1 /ffmpeg /usr/local/bin/ffmpeg`) to obtain a high-performance static FFmpeg instantly without installing deb packages.
2. **Evaluate Base Image Alternatives**:
   - Compare `node:24-bookworm-slim` vs `node:24-trixie-slim` vs `ghcr.io/puppeteer/puppeteer`.
   - Ensure non-root `USER node` and `/tmp/chrome-home` security permissions are preserved.
   - Benchmark build times before and after.

---

## ✅ Task List

### 1. CLI FFmpeg Resolution & Fallback Logic

- [ ] Implement `src/utils/ffmpegResolver.ts`:
  - [ ] `findSystemFfmpeg()`: check system `$PATH`
  - [ ] `getCachedFfmpegPath()`: check user cache directory
  - [ ] `ensureFfmpeg()`: orchestrate system check -> cache check -> fallback download/prompt
- [ ] Add CLI flag `--ffmpeg-path <path>` to allow explicit binary override
- [ ] Integrate resolver into `src/index.ts` before Puppeteer launch and FFmpeg spawning
- [ ] Provide clear diagnostic error when FFmpeg cannot be resolved in non-interactive environments

### 2. Docker Image Build Optimization

- [ ] Update `Dockerfile`:
  - [ ] Adopt static FFmpeg multi-stage copy (`COPY --from=mwader/static-ffmpeg:7.1 /ffmpeg /usr/local/bin/`)
  - [ ] Streamline `apt-get install` to only Chromium and essential fonts, eliminating `ffmpeg` deb dependencies and `apt-get upgrade`
- [ ] Benchmark Docker build time (before vs after)
- [ ] Verify Docker container execution with MP4, WebM, and GIF exports

### 3. Documentation, Security & SEO Audit

- [ ] Update `README.md` (document zero-install FFmpeg fallback and `--ffmpeg-path`)
- [ ] Update `docs/ARCHITECTURE.md` (document FFmpeg resolution architecture and fallback flow)
- [ ] Audit `docs/SECURITY.md` (document binary download validation, checksum verification, and execution paths)
- [ ] Audit `package.json` description & keywords if applicable
- [ ] Audit `web/src/app/layout.tsx` and `docs/FAQ.md` if applicable

---

## 🧪 Verification Plan

- [ ] **Unit Tests**:
  - Test `findSystemFfmpeg()` with mocked PATH and executable detection.
  - Test `getCachedFfmpegPath()` and fallback download triggers.
- [ ] **CLI Integration Tests**:
  - Test CLI execution when `PATH` is sanitized (simulating no system FFmpeg).
  - Test `--ffmpeg-path` flag override.
- [ ] **Docker Verification**:
  - Build local image: `docker build -t gehdoc/svg-to-video:test .`
  - Measure build time reduction.
  - Run container test conversions (`webm`, `mp4`, `gif`).
- [ ] **Fast Checks**:
  - `npm run check:fast` (lint, prettier, type-check).

---

## 📝 Change Log

- 2026-11-10: Initial spec drafted by Antigravity agent following Issue #248 and review history from PR #240.
