# Spec: 13 - Storybook Component Testing

**GitHub Issue**: [https://github.com/GehDoc/svg-to-video/issues/13](https://github.com/GehDoc/svg-to-video/issues/13)
**Status**: 🟠 Pending (Blocked by local UTF-8 path issue)

## 🎯 Objective

Establish visual component testing using Storybook in the `web/` workspace to enable visual regression testing and component-level debugging for the `SvgRenderer`.

## 🛠 Technical Strategy

- **Core Technologies**: Storybook 10.3.3 (Vite integration), Storybook Test Runner (Vitest/Playwright-based).
- **Architecture**: Move from brute-force E2E tests to component-level sandboxing.
- **Handshake Protocol**: Implemented a `SCRIPT_LOADED` message handshake between `index.tsx` and the `renderer.js` iframe to ensure synchronization before loading SVGs.
- **CI Integration**: Integrate `test-storybook` into `.github/workflows/ci.yml` and mandate it as a **required GitHub Status Check** in branch protection rules.
- **Component Sandbox**: Create `SvgRenderer.stories.tsx` with a `Wrapper` to drive the `forwardRef` component and expose `backgroundColor` controls.
- **Visual Regression**: Use native Playwright snapshot testing (via Storybook Test Runner) to compare current renders against baseline images committed to the repo. Include baseline snapshots for different rendering modes (Optimal vs. High-Fidelity) at critical timestamps.
- **"Loop-Synchronized-Capture" Test**: Implement a specific test scenario using a `loop-test.svg` (360° rotation) to verify temporal integrity (T0 vs T1 frames differ) and fidelity integrity (Optimal vs High-Fidelity outputs match).

## ✅ Task List

- [x] **Infrastructure**
  - [x] Add Storybook dependencies to `web/package.json`.
  - [x] Configure `storybook/` directory and Vite integration.
  - [x] Implement `SCRIPT_LOADED` handshake logic in `SvgRenderer`.
  - [x] Add `test-storybook` script to `web/package.json`.
- [ ] **Component Integration**
  - [x] Create `SvgRenderer.stories.tsx` with `Wrapper`.
  - [ ] Expose `seek` and `capture` controls via Storybook Controls pane.
- [ ] **Testing**
  - [x] Configure Storybook Test Runner in `vite.config.ts`.
  - [ ] **BLOCKER**: Verify test runner identifies test suites (Blocked by `université` UTF-8 path in local environment).
  - [ ] Implement "Loop-Synchronized-Capture" test scenario using `loop-test.svg`.
  - [ ] Integrate test runner into CI pipeline and set as mandatory status check.
  - [ ] Implement local baseline snapshot capture process.
  - [ ] Update DEVELOPER.md to document the new testing modes and commands.
  - [ ] Document pixel-matching assertions for rendering modes.

## 🧪 Verification Plan

- [x] Storybook can be launched via `npm run storybook`.
- [x] `SvgRenderer` renders correctly in Storybook UI with auto-loaded default SVG.
- [ ] Visual regression tests pass locally using `npm run test-storybook` (once path issue resolved).

## 📝 Change Log

- _2026-03-24: Initial spec created for Issue #13._
- _2026-03-25: Storybook 10.3 installed, handshake implemented, and path-related Vitest blocker identified._
