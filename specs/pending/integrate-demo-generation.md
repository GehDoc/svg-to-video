# Spec: Integrate Demo Generation

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Automate the generation and deployment of a fresh demo video for the Web Studio, improving the recording script, and integrating it into the CI/CD pipeline and documentation.

## 🛠 Technical Strategy

- **Core Technologies**: Playwright, Driver.js, GitHub Actions.
- **Architecture**:
  - Improved Playwright script (`@web/tests/demo.spec.ts`) using local `driver.js` dependency.
  - Video recording configuration in `demo.spec.ts` will be made conditional (e.g., via environment variable) to avoid recording during regular CI checks.
  - Dedicated step in the `build-and-deploy` job to generate the demo video with recording enabled.
  - Automated deployment of the video to GitHub Pages.
  - Documentation updates to showcase the demo.

## ✅ Task List

- [ ] **Infrastructure & Dependencies**
  - [ ] Add `driver.js` to `@web` devDependencies.
  - [ ] Update `demo.spec.ts` to only record video when a specific environment variable is set (e.g., `GENERATE_DEMO=true`).
  - [ ] Unpublish `web/playwright-report` folder (ensure it is ignored and removed from git tracking if necessary).
- [ ] **Demo Script Improvements**
  - [ ] Translate script and UI interactions to English.
  - [ ] Switch to `loop-test.svg` (animated fixture).
  - [ ] Reorganize form-filling steps: descending, then left to right.
  - [ ] Update scenario to select WebM export format.
  - [ ] Correct inconsistency: clarify that framerate is manual while size is detected.
- [ ] **CI/CD Integration**
  - [ ] Update `.github/workflows/ci.yml` to:
    - [ ] Ensure `web-e2e-tests` job runs `demo.spec.ts` (it should by default) but without video.
    - [ ] Add a step in `build-and-deploy` job to run the demo recording using `GENERATE_DEMO=true`.
    - [ ] Ensure the generated video is saved to `web/dist/assets/demo.webm` (or similar) so it gets deployed.
- [ ] **Documentation**
  - [ ] Update `README.md` to include the deployed demo video at the top.
  - [ ] Add a note in `README.md` about the automated demo tool.
  - [ ] Update `CONTRIBUTING.md` with details about the demo generation tool.

## 🧪 Verification Plan

- [ ] Manual Test: Run `npx playwright test demo.spec.ts` locally and verify no video is recorded.
- [ ] Manual Test: Run `GENERATE_DEMO=true npx playwright test demo.spec.ts` locally and verify the video is recorded and looks correct.
- [ ] Automated Test: Verify that the CI `web-e2e-tests` job passes and `build-and-deploy` generates the asset.
- [ ] Documentation Check: Verify that the README displays the video correctly after deployment.

## 📝 Change Log

- 2026-05-23: Initial spec created by Gemini CLI.
- 2026-05-23: Added task to unpublish playwright-report folder and detailed CI/CD steps.
- 2026-05-23: Refined strategy to run demo.spec.ts in CI without video by default.
