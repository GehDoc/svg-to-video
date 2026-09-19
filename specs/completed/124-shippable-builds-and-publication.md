# Spec: 124 - Shippable Builds & Release Publication Pipeline

**GitHub Issue**: [#124](https://github.com/GehDoc/svg-to-video/issues/124)
**Status**: 🟢 Completed

## 🎯 Objective

Deliver a fully working, optimized, and shippable npm package and Docker image for `svg-to-video`, featuring compiled JavaScript output (`dist/`), resilient Puppeteer/Chromium detection across host environments, automated CI file-list verification, updated ignore rules (`.gitignore`, `.dockerignore`), and release automation.

## 🛠 Technical Strategy

### 1. Build Compilation & Package Whitelist

- Use `tsc` to compile `src/` and `shared/` TypeScript files into ES Modules in `dist/` (`dist/src/index.js` and `dist/src/mcp.js`).
- Add build scripts to `package.json`: `"build": "tsc -p tsconfig.build.json"`, `"prepack": "npm run build"`.
- Inject `#!/usr/bin/env node` shebang at top of entry points (`dist/src/index.js`, `dist/src/mcp.js`).
- Update `package.json` fields:
  - `"main": "dist/src/index.js"`
  - `"bin": { "svg-to-video": "dist/src/index.js", "svg-to-video-mcp": "dist/src/mcp.js" }`
  - `"files": ["dist/", "skills/", "README.md", "LICENSE"]`
- Update ignore files:
  - `.gitignore`: Add `dist/`.
  - `.eslintignore` & `.prettierignore`: Ignore `dist/`.
  - `.dockerignore`: Add `dist/` (build inside Dockerfile instead).

### 2. Puppeteer vs. `puppeteer-core` & Smart Browser Auto-Detection

- **Analysis**:
  - `puppeteer`: Bundles auto-downloaded Chrome (~150-300MB) during `npm install`. Works great out-of-the-box for standard local `npm i`, but can fail when `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true` is set, when `npx` creates a isolated temp folder, or when OS missing shared Linux libraries (`libatk`, `libX11`, etc.).
  - `puppeteer-core`: Lighter (~5MB) with zero bundled browser. Requires an explicit `executablePath` or preinstalled Chrome/Chromium.
  - **Selected Strategy**:
    We keep `puppeteer` as the primary dependency, but implement a **Smart Browser Launcher Helper** in `src/utils/browserLauncher.ts`:
    1. **Primary**: Attempt `puppeteer.launch({ headless: true, args: [...] })` (uses Puppeteer's cached browser if available).
    2. **Environment Variable**: Check `process.env.PUPPETEER_EXECUTABLE_PATH`.
    3. **OS Auto-Detection**: Search standard system Chromium/Chrome locations (`/usr/bin/chromium`, `/usr/bin/chromium-browser`, `/usr/bin/google-chrome`, `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, `C:\Program Files\Google\Chrome\Application\chrome.exe`, etc.) and launch with `executablePath`.
    4. **Actionable Diagnostics**: If no browser launches or OS dependencies are missing, output a clear, user-friendly diagnostic message explaining how to fix it:
       - _Set `PUPPETEER_EXECUTABLE_PATH=/path/to/chrome`_
       - _Or run `npx puppeteer browsers install chrome`_
       - _Or install Chromium via system package manager (`apt-get install chromium`)_.

### 3. Docker Image Optimization

- In `Dockerfile`:
  - Install dependencies (`npm install --omit=dev --ignore-scripts`).
  - Copy TypeScript source code and build config (`src/`, `shared/`, `tsconfig.json`).
  - Run `npm run build` inside Docker.
  - Remove TypeScript source files and `tsconfig.json` to keep runtime container lean.
  - Set `ENTRYPOINT ["node", "dist/src/index.js"]`.

### 4. CI File-List Verification (`tests/pack.spec.ts`)

- Add an automated test `tests/pack.spec.ts` executing `npm pack --dry-run --json`.
- Compare output against an exact snapshot array:
  - **Not less files**: Fails if required runtime files (`dist/src/index.js`, `dist/src/mcp.js`, `skills/SKILL.md`) are missing.
  - **Not too many files**: Fails if extraneous files (`web/`, `specs/`, `tests/`, `.github/`, `tsconfig.json`, `src/`) are included.

### 5. Documentation & SEO Updates

- Update `README.md` and `docs/CLI.md` with compiled CLI usage instructions.
- Update `docs/ARCHITECTURE.md` with build architecture details.
- Update `docs/SECURITY.md` with container and binary security notes.
- Audit & update SEO keywords in `web/src/app/layout.tsx` and `web/src/components/SeoFallback.tsx`.

## ✅ Task List

- [x] **1. Build Setup & Ignore Configuration**
  - [x] Add `dist/` to `.gitignore`, `.prettierignore`, `.eslintignore`, `.dockerignore`.
  - [x] Add `"build": "tsc -p tsconfig.build.json"` and `"prepack": "npm run build"` to `package.json`.
  - [x] Add shebang header `#!/usr/bin/env node` script/post-build step for `dist/src/index.js` and `dist/src/mcp.js`.
  - [x] Update `package.json` `"main"`, `"bin"`, and `"files"` whitelist.

- [x] **2. Puppeteer & Smart Browser Resolution**
  - [x] Implement `src/utils/browserLauncher.ts` with fallback system binary search and environment override.
  - [x] Add actionable diagnostic error reporting for missing browser or shared libraries.
  - [x] Update `src/index.ts` and `src/mcp.ts` to use `browserLauncher`.

- [x] **3. Dockerfile Optimization**
  - [x] Update `Dockerfile` to compile `dist/` during build and run `["node", "dist/src/index.js"]`.
  - [x] Validate Docker container build and CLI execution.

- [x] **4. CI File-List Verification**
  - [x] Create `tests/pack.spec.ts` asserting exact expected file manifest from `npm pack --dry-run --json`.
  - [x] Ensure `npm run test:pack` runs in `npm run check` pipeline.

- [x] **5. Release Automation Workflow**
  - [x] Create `.github/workflows/release.yml` triggered on `v*` tag releases.

- [x] **6. Documentation & SEO Audit**
  - [x] Update `README.md`, `docs/CLI.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`.
  - [x] Update `web/src/app/layout.tsx` & `web/src/components/SeoFallback.tsx`.
  - [x] Verify whole suite with `npm run check`.

## 🧪 Verification Plan

- [x] `npm run build` creates valid, runnable JS in `dist/`.
- [x] `npm run test:pack` asserts exact package contents without missing or extra files.
- [x] `node dist/src/index.js --help` and `node dist/src/mcp.js` run successfully without `tsx`.
- [x] Docker build succeeds and runs `svg-to-video` correctly.
- [x] Automated test suite: `npm run check` passes clean.

## 📝 Change Log

- _2026-09-11: Initial spec created for Issue #124 by Antigravity Agent._
- _2026-09-11: Updated spec with ignore rules, puppeteer-core vs puppeteer analysis, and documentation task._
- _2026-09-11: Implementation completed. Verified dist/ compilation, browser launcher, pack snapshot test, Dockerfile, and release workflow._
