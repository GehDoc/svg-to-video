# Spec: 13 - Storybook Component Testing

**GitHub Issue**: [https://github.com/GehDoc/svg-to-video/issues/13](https://github.com/GehDoc/svg-to-video/issues/13)
**Status**: 🟢 Completed

## 🎯 Objective

Establish visual component testing using Storybook in the `web/` workspace to enable visual regression testing and component-level debugging for the `SvgRenderer`.

## 🛠 Technical Strategy

- **Core Technologies**: Storybook 10.3.3 (Vite integration), Storybook Test Runner (Vitest/Playwright-based).
- **Architecture**: Move from brute-force E2E tests to component-level sandboxing.
- **Handshake Protocol**: Implemented a `SCRIPT_LOADED` message handshake between `index.tsx` and the `renderer.js` iframe to ensure synchronization before loading SVGs.
- **CI Integration**: Integrate `test-storybook` into `.github/workflows/ci.yml`.
- **Component Sandbox**: Create `SvgRenderer.stories.tsx` with a `Wrapper` to drive the `forwardRef` component and expose `backgroundColor` controls.
- **Visual Regression**: Use Vitest Browser Mode with `@storybook/addon-vitest` to enable visual regression testing.
- **"Loop-Synchronized-Capture" Test**: Implement a specific test scenario using a `loop-test.svg` to verify temporal integrity.

## ✅ Task List

- [x] **Infrastructure**
  - [x] Add Storybook dependencies to `web/package.json`.
  - [x] Configure `storybook/` directory and Vite integration.
  - [x] Implement `SCRIPT_LOADED` handshake logic in `SvgRenderer`.
  - [x] Add `test-storybook` script to `web/package.json`.
- [x] **Component Integration**
  - [x] Create `SvgRenderer.stories.tsx` with `Wrapper`.
  - [x] Expose `seek` and `capture` controls via UI in the Storybook Wrapper.
- [x] **Testing**
  - [x] Configure Storybook Test Runner in `vite.config.ts`.
  - [x] **BLOCKER RESOLVED**: UTF-8 path issue resolved by folder rename.
  - [x] Implement "Loop-Synchronized-Capture" test scenario using `loop-test.svg`.
  - [x] Integrate test runner into CI pipeline and root `package.json`.
  - [x] Implement local baseline snapshot capture process (via `npm run test-storybook:update`).
  - [x] Update DEVELOPER.md to document the new testing modes and commands.
  - [x] Document pixel-matching assertions for rendering modes in DEVELOPER.md.

### 🚀 Phase 2: Advanced Integration & Gallery

- [x] **Exhaustive Component controls**
  - [x] Refactor `Wrapper` to support declarative `svgContent` updates via Storybook Controls.
  - [x] Add `width`, `height`, and `backgroundColor` as interactive knobs.
  - [x] Replace `window.alert` with **Storybook Actions** for cleaner event logging.
- [x] **Visual Test Gallery**
  - [x] Create `TypographySuite.story` using `font-test.svg`.
  - [x] Create `AnimationStressTest.story` with 20+ simultaneous keyframe animations.
  - [x] Create `FilterFidelity.story` verifying `<feGaussianBlur>` and `<feColorMatrix>` rendering.
- [x] **Automated Deployment**
  - [x] Update `.github/workflows/deploy.yml` to build and deploy Storybook to `/storybook/` subfolder.
  - [x] Ensure `coi-serviceworker` is active in the Storybook build for WebCodecs support.

## 🧪 Verification Plan

...

- [x] Visual regression tests pass locally using `npm run test:storybook` (after folder rename).
- [ ] Storybook is accessible at `https://gehdoc.github.io/svg-to-video/storybook/` (Phase 2).

## 📝 Change Log

- _2026-03-24: Initial spec created for Issue #13._
- _2026-03-25: Storybook 10.3 installed, handshake implemented, and path-related Vitest blocker identified._
- _2026-03-28: Path issue resolved via folder rename. Implemented Loop-Synchronized-Capture story with interaction tests. Exposed seek/capture controls. Updated documentation. **Integrated Storybook tests into CI pipeline (ci.yml) as a mandatory check.**_
- _2026-03-28: Fixed Storybook UI crash by migrating from `vitest` imports to `storybook/test` primitives. Expanded Phase 2 roadmap to include Visual Gallery and GH Pages deployment._
