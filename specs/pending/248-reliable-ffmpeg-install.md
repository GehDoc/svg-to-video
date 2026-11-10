# Spec: 248 - Simpler, Reliable FFmpeg Fallback, Docker & CI Build Optimization

**GitHub Issue**: [#248](https://github.com/GehDoc/svg-to-video/issues/248)
**Status**: 🟠 Pending

## 🎯 Objective

Enable CLI users and test environments without system-installed FFmpeg to seamlessly run `svg-to-video` through an automated, zero-interaction fallback mechanism that mirrors Puppeteer's executable resolution architecture, and drastically accelerate Docker and CI pipeline build times by eliminating fragile third-party actions, removing redundant APT upgrades, and sharing static FFmpeg provisioning via `mwader/static-ffmpeg`.

---

## 🔍 Background & Context

- Currently, `svg-to-video` CLI spawns `ffmpeg` directly from the host `$PATH` (`child_process.spawn('ffmpeg', ...)`). If FFmpeg is not installed on the user's host, the process abruptly crashes with `ENOENT`.
- In PR #240, bundling `ffmpeg-static` in `devDependencies` was tested but removed following review feedback (commit `63428e8`): `devDependencies` are not present for end-users running `npx svg-to-video`, and unconditionally bundling a full static FFmpeg (~70MB) adds bloat for users who already have FFmpeg.
- In Docker, the current build layer executes `apt-get update && apt-get upgrade -y && apt-get install -y chromium ffmpeg ...` on `node:24-trixie-slim`, causing long build times, large download sizes, and cache busts.
- In CI (`.github/actions/setup/action.yml`), jobs running with `install-ffmpeg: 'true'` (`web-e2e-tests` and `build-and-deploy`) previously tried `FedericoCarboni/setup-ffmpeg@v3`, but that action frequently caused transient build failures due to external hosting timeouts. The project was forced to fall back to `sudo apt-get update && sudo apt-get install -y ffmpeg`, which wastes 45–90 seconds downloading and installing 80+ transitive deb packages on every workflow run.
- Issue [#248](https://github.com/GehDoc/svg-to-video/issues/248) asks:
  1. How to allow a fallback install of a minimal FFmpeg with only necessary codecs for CLI users?
  2. How to reduce the Docker install step (can we use a base docker image or multi-stage pattern that already has FFmpeg and Chromium)?
  3. How to optimize interaction with CI build steps to accelerate test execution without flaky external actions?

---

## 🛠 Technical Strategy

### 1. Unified Static FFmpeg across Docker & CI (`mwader/static-ffmpeg`)

Rather than relying on fragile GitHub Actions (`FedericoCarboni/setup-ffmpeg@v3`) or slow OS package managers (`apt-get install ffmpeg`):

1. **In `Dockerfile`**:
   - Use multi-stage static copy: `COPY --from=mwader/static-ffmpeg:7.1 /ffmpeg /ffprobe /usr/local/bin/`.
   - Remove `apt-get upgrade -y` (which upgrades unrelated packages and invalidates cache).
   - Remove `ffmpeg` from `apt-get install -y`, keeping only `chromium` and required international fonts.
   - Set `ENV FFMPEG_PATH=/usr/local/bin/ffmpeg FFMPEG_SKIP_DOWNLOAD=true`.

2. **In CI (`.github/actions/setup/action.yml`)**:
   - All GitHub Actions `ubuntu-latest` runners have Docker pre-installed and daemon running.
   - Replace slow `sudo apt-get update && sudo apt-get install -y ffmpeg` with extracting static FFmpeg directly from `mwader/static-ffmpeg:7.1`:
     ```bash
     docker create --name static_ffmpeg mwader/static-ffmpeg:7.1
     sudo docker cp static_ffmpeg:/ffmpeg /usr/local/bin/ffmpeg
     sudo docker cp static_ffmpeg:/ffprobe /usr/local/bin/ffprobe
     docker rm static_ffmpeg
     ```
   - This takes only ~2-3 seconds, pulls from reliable container registries, guarantees 100% binary parity between local Docker, CI runners, and production, and completely avoids `setup-ffmpeg@v3` network failures.

3. **In Test Helpers (`tests/helpers/e2e.ts`)**:
   - Update `extractFrame()` to resolve FFmpeg via `resolveFfmpegPath()`, respecting `FFMPEG_PATH` or the fallback binary instead of hardcoding global system `'ffmpeg'`.

### 2. Mirroring Puppeteer Resolution Pattern for Local CLI Users (Zero Interactivity)

In `svg-to-video`, Puppeteer is managed without any interactive prompts:

1. `PUPPETEER_EXECUTABLE_PATH` environment variable for explicit binary overrides.
2. Bundled binary download in cache.
3. Fallback to system Chrome (`channel: 'chrome'`).
4. In Docker / CI, `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` and `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`.

We will implement the exact same non-interactive architecture for FFmpeg in `src/utils/ffmpegResolver.ts`:

1. **Explicit Binary Override**:
   - Check CLI `--ffmpeg-path <path>` option or `process.env.FFMPEG_PATH` / `process.env.FFMPEG_EXECUTABLE_PATH`.
   - If set, use it directly (throw descriptive error if file does not exist or is not executable).

2. **System FFmpeg Discovery**:
   - Check if system `ffmpeg` is available on `$PATH` (e.g. probing `ffmpeg -version` or resolving via path lookup).
   - If found, use system FFmpeg directly. Zero download overhead, 100% backward-compatible.

3. **Automated Fallback Provisioning (Zero Interactivity)**:
   - When neither explicit override nor system FFmpeg is available on the machine:
     - Check local cache directory (`~/.cache/svg-to-video/ffmpeg` or platform equivalent via `env-paths`).
     - If cached binary is present and executable, use it.
     - If not cached: automatically fetch a standalone, minimal static FFmpeg binary into the user cache directory with a clear progress log (e.g. `⬇️ System FFmpeg not found, downloading minimal FFmpeg binary...`).
     - **Strictly No Interactivity**: Never block on TTY prompts (`readline`/stdin). It behaves autonomously just like Puppeteer browser installation.
     - Support `FFMPEG_SKIP_DOWNLOAD=true` to disable auto-download if desired.
     - Enforce security: validate HTTPS source, binary integrity (SHA256 checksum), and executable permissions (`chmod 0755`) per `docs/SECURITY.md`.

4. **Required Codecs & Filters Audit**:
   - `svg-to-video` only requires:
     - Encoders: `libx264` (MP4, MOV, MKV), `libvpx-vp9` (WebM, MKV), `apng` (APNG), `gif` (GIF).
     - Demuxer: `image2pipe` (PNG piped input from Puppeteer).
     - Filters: `palettegen`, `paletteuse` (GIF), `colorkey`, `split` (transparent WebM/MOV), `scale` (resolution scaling/padding).

---

## ✅ Task List

### 1. Docker & CI Static FFmpeg Provisioning

- [ ] Update `Dockerfile`:
  - [ ] Adopt static FFmpeg multi-stage copy (`COPY --from=mwader/static-ffmpeg:7.1 /ffmpeg /ffprobe /usr/local/bin/`)
  - [ ] Streamline `apt-get install` to only Chromium and essential fonts, eliminating `ffmpeg` deb dependencies and `apt-get upgrade`
  - [ ] Add `ENV FFMPEG_PATH=/usr/local/bin/ffmpeg FFMPEG_SKIP_DOWNLOAD=true`
- [ ] Update `.github/actions/setup/action.yml`:
  - [ ] Replace `sudo apt-get update && sudo apt-get install -y ffmpeg` with `docker cp` from `mwader/static-ffmpeg:7.1`
- [ ] Update `tests/helpers/e2e.ts` to use `resolveFfmpegPath()`
- [ ] Benchmark Docker build time (before vs after) and verify CI job speed

### 2. CLI FFmpeg Resolution & Fallback Logic (Puppeteer-Style)

- [ ] Implement `src/utils/ffmpegResolver.ts`:
  - [ ] `findSystemFfmpeg()`: probe system `$PATH`
  - [ ] `getCachedFfmpegPath()`: check user cache directory
  - [ ] `downloadMinimalFfmpeg()`: automated, non-interactive download of minimal static FFmpeg with checksum validation
  - [ ] `resolveFfmpegPath()`: orchestrate `options.ffmpegPath` -> `process.env.FFMPEG_PATH` -> system `$PATH` -> cache -> auto-download
- [ ] Add CLI option `--ffmpeg-path <path>` to Commander configuration
- [ ] Integrate resolver into `src/index.ts` before Puppeteer launch and FFmpeg spawning
- [ ] Log clean informational messages (`⬇️ System FFmpeg not found, downloading minimal FFmpeg binary...` / `🔍 Using system FFmpeg...`)

### 3. Documentation, Security & SEO Audit

- [ ] Update `README.md` (document zero-install FFmpeg fallback, `--ffmpeg-path`, and `FFMPEG_PATH`)
- [ ] Update `docs/ARCHITECTURE.md` (document FFmpeg resolution architecture and fallback flow mirroring Puppeteer)
- [ ] Audit `docs/SECURITY.md` (document binary download validation, checksum verification, and execution paths)
- [ ] Audit `package.json` description & keywords if applicable
- [ ] Audit `web/src/app/layout.tsx` and `docs/FAQ.md` if applicable

---

## 🧪 Verification Plan

- [ ] **Unit Tests**:
  - Test `resolveFfmpegPath()` with explicit override (`--ffmpeg-path` and `FFMPEG_PATH`).
  - Test `findSystemFfmpeg()` with mocked PATH and executable detection.
  - Test automated fallback resolution without user input.
- [ ] **CLI Integration Tests**:
  - Test CLI execution when `PATH` is sanitized (simulating no system FFmpeg).
  - Test `--ffmpeg-path` flag override.
- [ ] **Docker Verification**:
  - Build local image: `docker build -t gehdoc/svg-to-video:test .`
  - Measure build time reduction.
  - Run container test conversions (`webm`, `mp4`, `gif`).
- [ ] **CI & E2E Verification**:
  - Verify static FFmpeg extraction works via Docker.
  - Run `npm run test:web -w web` to ensure `extractFrame` succeeds with resolved FFmpeg.
  - Run `npm run check:fast` (lint, prettier, type-check).

---

## 📝 Change Log

- 2026-11-10: Initial spec drafted by Antigravity agent following Issue #248 and review history from PR #240.
- 2026-11-10: Updated technical strategy per user feedback — eliminated interactive TTY prompting in favor of a completely automated, non-interactive resolution pipeline mirroring Puppeteer (`PUPPETEER_EXECUTABLE_PATH` / auto-provisioning / system fallback).
- 2026-11-10: Aligned CI and Docker static FFmpeg provisioning on `mwader/static-ffmpeg:7.1` (via `COPY --from` in Dockerfile and `docker cp` in CI setup action), completely avoiding flaky `setup-ffmpeg@v3` and slow `apt-get` deb packages.
