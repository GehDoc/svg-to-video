# Spec: 248 - Simpler, Reliable FFmpeg Fallback, Docker & CI Build Optimization

**GitHub Issue**: [#248](https://github.com/GehDoc/svg-to-video/issues/248)
**Status**: 🟡 To be reviewed

## 🎯 Objective

Enable CLI users and test environments without system-installed FFmpeg to seamlessly run `svg-to-video` by bundling `ffmpeg-static` as an automated, zero-interaction fallback mirroring Puppeteer's executable resolution pattern, and drastically accelerate Docker and CI pipeline build times by eliminating fragile third-party actions, removing redundant APT upgrades, and sharing static FFmpeg provisioning via `mwader/static-ffmpeg`.

---

## 🔍 Background & Context

- Currently, `svg-to-video` CLI spawns `ffmpeg` directly from the host `$PATH` (`child_process.spawn('ffmpeg', ...)`). If FFmpeg is not installed on the user's host, the process abruptly crashes with `ENOENT`.
- In PR #240, bundling `ffmpeg-static` in `devDependencies` was tested but removed following review feedback (commit `63428e8`): `devDependencies` are not present for end-users running `npx svg-to-video`. Issue [#248](https://github.com/GehDoc/svg-to-video/issues/248) was created to properly address the zero-install UX.
- In Docker, the build layer previously executed `apt-get update && apt-get upgrade -y && apt-get install -y chromium ffmpeg ...` on `node:24-trixie-slim`, causing long build times, large download sizes, and cache busts.
- In CI (`.github/actions/setup/action.yml`), jobs running with `install-ffmpeg: 'true'` (`web-e2e-tests` and `build-and-deploy`) previously tried `FedericoCarboni/setup-ffmpeg@v3`, but that action frequently caused transient build failures due to external hosting timeouts. The project was forced to fall back to `sudo apt-get update && sudo apt-get install -y ffmpeg`, which wastes 45–90 seconds downloading and installing 80+ transitive deb packages on every workflow run.

---

## 🛠 Technical Strategy

### 1. Mirroring Puppeteer Resolution Pattern for FFmpeg (Zero Interactivity)

Just as Puppeteer is bundled as an npm package with support for `PUPPETEER_EXECUTABLE_PATH` and system Chrome fallback, we handle FFmpeg using `ffmpeg-static` as an optional dependency and resolve executables with clear priority:

1. **Explicit Binary Override**:
   - Check CLI `--ffmpeg-path <path>` option or `process.env.FFMPEG_PATH` / `process.env.FFMPEG_EXECUTABLE_PATH`.
   - If provided, verify existence and use directly.

2. **System FFmpeg Discovery**:
   - Probe if `ffmpeg` is available on system `$PATH` (`ffmpeg -version`).
   - If found, use system FFmpeg directly. Zero overhead for users/environments with system FFmpeg.

3. **Bundled Static FFmpeg Fallback (`ffmpeg-static`)**:
   - If system FFmpeg is not found, dynamically load `ffmpeg-static`.
   - Use the prebuilt static binary path provided by `ffmpeg-static`.
   - Log an informational message if falling back (e.g. `🔍 System FFmpeg not found, using bundled static FFmpeg...`).
   - If neither system nor bundled static FFmpeg is available, throw an actionable error message.

### 2. Unified Static FFmpeg across Docker & CI (`mwader/static-ffmpeg`)

1. **In `Dockerfile`**:
   - Multi-stage static copy: `COPY --from=mwader/static-ffmpeg:7.1 /ffmpeg /ffprobe /usr/local/bin/`.
   - Remove `apt-get upgrade -y` and `apt-get install ffmpeg`.
   - Set `ENV FFMPEG_PATH=/usr/local/bin/ffmpeg`.

2. **In CI (`.github/actions/setup/action.yml`)**:
   - In GitHub Actions `ubuntu-latest` runners, extract static FFmpeg directly from `mwader/static-ffmpeg:7.1`:
     ```bash
     docker create --name static_ffmpeg mwader/static-ffmpeg:7.1
     sudo docker cp static_ffmpeg:/ffmpeg /usr/local/bin/ffmpeg
     sudo docker cp static_ffmpeg:/ffprobe /usr/local/bin/ffprobe
     docker rm static_ffmpeg
     sudo chmod 755 /usr/local/bin/ffmpeg /usr/local/bin/ffprobe
     ```
   - Eliminates `apt-get` deb overhead, runs in ~2-3s, and guarantees exact binary parity with Docker.

3. **In Test Helpers (`tests/helpers/e2e.ts`)**:
   - Update `extractFrame()` to resolve FFmpeg via `resolveFfmpegPath()`.

---

## ✅ Task List

### 1. Docker & CI Static FFmpeg Provisioning

- [x] Update `Dockerfile`:
  - [x] Adopt static FFmpeg multi-stage copy (`COPY --from=mwader/static-ffmpeg:7.1 /ffmpeg /ffprobe /usr/local/bin/`)
  - [x] Streamline `apt-get install` to only Chromium and essential fonts, eliminating `ffmpeg` deb dependencies and `apt-get upgrade`
  - [x] Add `ENV FFMPEG_PATH=/usr/local/bin/ffmpeg`
- [x] Update `.github/actions/setup/action.yml`:
  - [x] Replace `sudo apt-get update && sudo apt-get install -y ffmpeg` with `docker cp` from `mwader/static-ffmpeg:7.1`
- [x] Update `tests/helpers/e2e.ts` to use `resolveFfmpegPath()`
- [x] Benchmark Docker build time (before vs after) and verify container execution

### 2. CLI FFmpeg Resolution & Fallback Logic (`ffmpeg-static`)

- [x] Add `ffmpeg-static` to `optionalDependencies` in `package.json`
- [x] Implement `src/utils/ffmpegResolver.ts`:
  - [x] `findSystemFfmpeg()`: probe system `$PATH`
  - [x] `getBundledFfmpeg()`: safely resolve `ffmpeg-static` binary
  - [x] `resolveFfmpegPath()`: orchestrate `--ffmpeg-path` -> `process.env.FFMPEG_PATH` -> system `$PATH` -> `ffmpeg-static`
- [x] Add CLI option `--ffmpeg-path <path>` to Commander configuration
- [x] Integrate resolver into `src/index.ts` before Puppeteer launch and FFmpeg spawning
- [x] Log clean informational messages (`🔍 Bundled FFmpeg...` / `🔍 Using system FFmpeg...`)

### 3. Documentation, Security & SEO Audit

- [x] Update `README.md` (document zero-install FFmpeg fallback, `--ffmpeg-path`, and `FFMPEG_PATH`)
- [x] Update `docs/CLI.md` (add `--ffmpeg-path` and `FFMPEG_PATH` environment variable)
- [x] Update `docs/ARCHITECTURE.md` (document FFmpeg resolution architecture and fallback flow mirroring Puppeteer)
- [x] Audit `docs/SECURITY.md` (document binary resolution order and execution paths)
- [x] Audit `docs/FAQ.md` (add FAQ entry for FFmpeg installation)
- [x] Update `tests/pack.spec.ts` (include `dist/src/utils/ffmpegResolver.js` in package files)

---

## 🧪 Verification Plan

- [x] **Unit Tests**:
  - Test `resolveFfmpegPath()` with explicit override (`--ffmpeg-path` and `FFMPEG_PATH`).
  - Test `resolveFfmpegPath()` fallback to `ffmpeg-static` when system FFmpeg is absent.
  - Test `findSystemFfmpeg()` with mocked PATH and executable detection.
- [x] **CLI Integration Tests**:
  - Test CLI execution (`tests/cli.spec.ts` - 23 passing tests).
  - Test `--ffmpeg-path` flag override and error handling.
- [x] **Docker Verification**:
  - Build local image: `docker build -t gehdoc/svg-to-video:test .`
  - Run container test conversions (`webm`, `mp4`, `gif`).
- [x] **CI & E2E Verification**:
  - Verify static FFmpeg extraction works via Docker.
  - Run `npm run test:web -w web` to ensure `extractFrame` succeeds with resolved FFmpeg.
  - Run `npm run test:mcp` (10 passing tests).
  - Run `npm run test:pack` (3 passing tests).
  - Run `npm run check:fast` (lint, prettier, type-check).

---

## 📝 Change Log

- 2026-11-10: Initial spec drafted by Antigravity agent following Issue #248 and review history from PR #240.
- 2026-11-10: Aligned CI and Docker static FFmpeg provisioning on `mwader/static-ffmpeg:7.1` (via `COPY --from` in Dockerfile and `docker cp` in CI setup action), completely avoiding flaky `setup-ffmpeg@v3` and slow `apt-get` deb packages.
- 2026-11-10: User confirmed strategy: mirror Puppeteer by adding `ffmpeg-static` as an optional dependency fallback, avoiding any custom manual runtime download scripts.
- 2026-11-10: Implemented `src/utils/ffmpegResolver.ts`, integrated into `src/index.ts` and `tests/helpers/e2e.ts`, added unit & integration tests, updated Dockerfile and CI action, audited documentation and security.
