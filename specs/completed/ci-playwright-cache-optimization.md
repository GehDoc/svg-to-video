# Spec: CI Playwright & Tooling Cache Optimization

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Optimize GitHub Actions CI pipeline execution by implementing effective Playwright browser caching with `actions/cache@v5`, eliminating redundant browser re-downloads, eliminating dead `install-chromium` inputs, and avoiding unnecessary `apt-get` runs for pre-installed tools like `ffmpeg`.

## 🛠 Technical Strategy

- **Core Technologies**: GitHub Actions, Playwright CLI, Composite Actions (`actions/cache@v5`)
- **Key Files**:
  - `.github/actions/setup/action.yml`
  - `.github/workflows/ci.yml`

### 1. Playwright Caching & Installation

- **Cache Key**: Fix cache key to use root `package-lock.json` (`${{ runner.os }}-playwright-${{ hashFiles('package-lock.json') }}`) since `web/package-lock.json` does not exist in the npm workspace.
- **Cache Action Version**: Enforce `actions/cache@v5`.
- **System Dependencies vs Browser Binaries**:
  - Run `npx playwright install-deps chromium` unconditionally when `install-playwright == 'true'` to ensure required OS dynamic libraries are present on the runner.
  - Run `npx playwright install chromium` conditionally ONLY on cache miss (`steps.playwright-cache.outputs.cache-hit != 'true'`).

### 2. Dead Code Removal (`install-chromium`)

- Remove `install-chromium` input and `DEPS="$DEPS chromium-browser"` apt command from `.github/actions/setup/action.yml`.
- Playwright downloads its own Chromium binary to `~/.cache/ms-playwright` and Docker builds handle containerized Chromium dependencies, making `install-chromium` unused and prone to snap transition errors on Ubuntu runners.

### 3. FFmpeg Setup Optimization

- In `.github/actions/setup/action.yml`, guard `ffmpeg` installation with `if ! command -v ffmpeg &> /dev/null; then ... fi` to avoid redundant `sudo apt-get update` runs on GitHub-hosted runners where `ffmpeg` is already pre-installed.
- In `.github/workflows/ci.yml`, remove `install-ffmpeg: 'true'` from `web-e2e-tests` job as Web Studio tests execute entirely in-browser without calling the `ffmpeg` binary.

## ✅ Task List

- [x] **Infrastructure & CI**
  - [x] Update `.github/actions/setup/action.yml` to use `actions/cache@v5` with `package-lock.json` hash.
  - [x] Split Playwright step into `install-deps` (runner OS libraries) and conditional `install` (browser binary download on cache miss).
  - [x] Remove unused `install-chromium` input and logic from `.github/actions/setup/action.yml`.
  - [x] Add `command -v ffmpeg` idempotency check to `install-ffmpeg` in `.github/actions/setup/action.yml`.
  - [x] Remove unused `install-ffmpeg: 'true'` parameter from `web-e2e-tests` in `.github/workflows/ci.yml`.
- [x] **Verification & Pre-flight**
  - [x] Run `npm run check:fast` to ensure formatting and linting pass.
  - [x] Verify workflow YAML syntax and structure.

## 🧪 Verification Plan

- [x] `npm run format` & `npm run check:fast` to validate YAML formatting and project integrity.
- [x] Inspect GitHub Actions YAML configs against composite action specifications.

## 📝 Change Log

- 2026-10-07: Initial spec created for CI Playwright caching and setup action cleanup.
- 2026-10-07: Implemented `actions/cache@v5` with `package-lock.json` hash, separated `playwright install-deps` from conditional `playwright install`, removed dead `install-chromium` input/step, and guarded `ffmpeg` installation. Verified with `npm run check:fast`.
