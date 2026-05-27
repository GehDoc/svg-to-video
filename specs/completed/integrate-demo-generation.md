# Spec: Integrate Demo Generation

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Automate the generation and deployment of a fresh demo video for the Web Studio, improving the recording script, and integrating it into the CI/CD pipeline and documentation.

## 🛠 Technical Strategy

- **Core Technologies**: Playwright, Driver.js, GitHub Actions.
- **Architecture**:
  - Improved Playwright script (`@web/tests/demo.spec.ts`) using local `driver.js` dependency.
  - Video recording configuration in `demo.spec.ts` is conditional via `GENERATE_DEMO` environment variable.
  - Dedicated step in the `build-and-deploy` job generates the demo video.
  - Automated deployment of the video to GitHub Pages.
  - Documentation updates showcase the demo.

## ✅ Task List

- [x] **Infrastructure & Dependencies**
  - [x] Add `driver.js` to `@web` devDependencies.
  - [x] Update `demo.spec.ts` to only record video when `GENERATE_DEMO=true`.
  - [x] Unpublish `web/playwright-report` folder (removed from git tracking and ignored).
- [x] **Demo Script Improvements**
  - [x] Translate script and UI interactions to English.
  - [x] Create and switch to `demo-fixture.svg` (animated fixture with transparency, 3s max).
  - [x] Reorganize form-filling steps: descending, then left to right.

  - [x] Update scenario to select WebM export format.
  - [x] Correct inconsistency: clarify that framerate is manual while size is detected.

- [x] **CI/CD Integration**
  - [x] Update `.github/workflows/ci.yml` to:
    - [x] Ensure `web-e2e-tests` job runs `demo.spec.ts` without video.
    - [x] Add a step in `build-and-deploy` job to run the demo recording.
    - [x] Ensure the generated video is saved to `web/dist/assets/demo.webm`.
- [x] **Documentation**
  - [x] Update `README.md` to include the deployed demo video at the top.
  - [x] Add a note in `README.md` about the automated demo tool.
  - [x] Update `CONTRIBUTING.md` with details about the demo generation tool.

## 🧪 Verification Plan

- [x] Manual Test: Run `npx playwright test demo.spec.ts` locally and verify no video is recorded.
- [x] Manual Test: Run `GENERATE_DEMO=true npx playwright test demo.spec.ts` locally and verify the video is recorded and looks correct.
- [x] Automated Test: Verify that the CI `web-e2e-tests` job passes and `build-and-deploy` generates the asset.
- [x] Documentation Check: Verify that the README displays the video correctly after deployment.

## 📝 Change Log

- 2026-05-23: Initial spec created by Gemini CLI.
- 2026-05-23: Added task to unpublish playwright-report folder and detailed CI/CD steps.
- 2026-05-23: Refined strategy to run demo.spec.ts in CI without video by default.
- 2026-05-23: Final refinements: Viewport 800px, transparency reordering, success/download timing adjustments.
- 2026-05-23: UI Optimization: Refactored ConfigPanel and SuccessView to Flexbox to ensure fit within 720p without scrolling.
