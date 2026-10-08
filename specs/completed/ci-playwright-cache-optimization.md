# Spec: CI Playwright & Tooling Optimization

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Optimize GitHub Actions CI pipeline execution by migrating FFmpeg to `FedericoCarboni/setup-ffmpeg@v3` for instant static binary installation (~2s vs ~95s with apt-get), removing dead `install-chromium` inputs, and aligning Playwright setup with official best practices.

## 🛠 Technical Strategy

- **Core Technologies**: GitHub Actions, Playwright CLI, `FedericoCarboni/setup-ffmpeg@v3`
- **Key Files**:
  - `.github/actions/setup/action.yml`
  - `.github/workflows/ci.yml`

### 1. Playwright Installation Alignment

- Per official Playwright documentation recommendations, avoid `actions/cache` for browser binaries on Linux runners (as OS-level dependencies via `install-deps` cancel out the benefit of caching the 150MB binary, and GitHub Actions network bandwidth is comparable to cache extraction).
- Execute streamlined `npx playwright install chromium --with-deps` when `install-playwright == 'true'`.

### 2. Dead Code Removal (`install-chromium`)

- Remove `install-chromium` input and `DEPS="$DEPS chromium-browser"` apt command from `.github/actions/setup/action.yml`.
- Playwright manages its own Chromium binary and Docker builds handle containerized Chromium dependencies, making `install-chromium` unused and prone to snap transition errors on Ubuntu runners.

### 3. FFmpeg Setup Optimization (`FedericoCarboni/setup-ffmpeg@v3`)

- Replace the legacy `sudo apt-get update && sudo apt-get install ffmpeg` step (which pulled 88 transitive deb packages and took ~95s) with `FedericoCarboni/setup-ffmpeg@v3`.
- Downloads a self-contained static release binary in ~2 seconds, bypassing apt mirror latencies and system package overhead.
- Retain `install-ffmpeg: 'true'` in `web-e2e-tests` (which relies on `ffmpeg` in `tests/helpers/e2e.ts` for frame-accurate transparency assertions) and `build-and-deploy`.

## ✅ Task List

- [x] **Infrastructure & CI**
  - [x] Replace `apt-get install ffmpeg` with `FedericoCarboni/setup-ffmpeg@v3` in `.github/actions/setup/action.yml`.
  - [x] Streamline Playwright installation using standard `npx playwright install chromium --with-deps` without brittle caching.
  - [x] Remove unused `install-chromium` input and logic from `.github/actions/setup/action.yml`.
  - [x] Retain `install-ffmpeg: 'true'` in `web-e2e-tests` and `build-and-deploy` jobs in `.github/workflows/ci.yml`.
- [x] **Verification & Pre-flight**
  - [x] Run `npm run check:fast` to ensure formatting and linting pass.
  - [x] Verify workflow YAML syntax and structure.

## 🧪 Verification Plan

- [x] `npm run format` & `npm run check:fast` to validate YAML formatting and project integrity.
- [x] Inspect GitHub Actions CI execution times and step durations.

## 📝 Change Log

- 2026-10-07: Initial spec created for CI Playwright caching and setup action cleanup.
- 2026-10-07: Migrated FFmpeg to `FedericoCarboni/setup-ffmpeg@v3` for instant static binary installation (~2s vs ~95s with apt-get), removed dead `install-chromium` input, and aligned Playwright setup with official best practices. Verified with `npm run check:fast`.
