# Spec: 13 - Storybook Component Testing

**GitHub Issue**: [https://github.com/GehDoc/svg-to-video/issues/13](https://github.com/GehDoc/svg-to-video/issues/13)
**Status**: 🟠 Pending

## 🎯 Objective

Establish visual component testing using Storybook in the `web/` workspace to enable visual regression testing and component-level debugging for the `SvgRenderer`.

## 🛠 Technical Strategy

- **Core Technologies**: Storybook (Vite integration), Storybook Test Runner (Playwright-based).
- **Architecture**: Move from brute-force E2E tests to component-level sandboxing.
- **CI Integration**: Integrate `test-storybook` into `.github/workflows/ci.yml` and mandate it as a **required GitHub Status Check** in branch protection rules to block PR merges if visual regressions occur.
- **Component Sandbox**: Create `SvgRenderer.stories.tsx` to expose `seek` and `capture` controls, allowing inspection of `SvgRenderer` in isolation.
- **Visual Regression**: Use native Playwright snapshot testing (via Storybook Test Runner) to compare current renders against baseline images committed to the repo, ensuring zero 3rd-party dependency. Include baseline snapshots for different rendering modes (Optimal vs. High-Fidelity) at critical timestamps.
- **"Loop-Synchronized-Capture" Test**: Implement a specific test scenario using a `loop-test.svg` (360° rotation) to verify temporal integrity (T0 vs T1 frames differ) and fidelity integrity (Optimal vs High-Fidelity outputs match).

## ✅ Task List

- [ ] **Infrastructure**
  - [ ] Add Storybook dependencies (`@storybook/react`, etc.) to `web/package.json`.
  - [ ] Configure `storybook/` directory and Vite integration.
- [ ] **Component Integration**
  - [ ] Create `SvgRenderer.stories.tsx` with controls.
  - [ ] Expose `seek` and `capture` controls via Storybook Controls pane.
- [ ] **Testing**
  - [ ] Configure Storybook Test Runner.
  - [ ] Implement "Loop-Synchronized-Capture" test scenario using `loop-test.svg`.
  - [ ] Integrate test runner into CI pipeline and set as mandatory status check.
  - [ ] Implement local baseline snapshot capture process.
  - [ ] Update DEVELOPER.md to document the new testing modes and commands.
  - [ ] Document pixel-matching assertions for rendering modes.

## 🧪 Verification Plan

- [ ] Storybook can be launched via `npm run storybook`.
- [ ] Visual regression tests pass locally using `test-storybook`.

## 📝 Change Log

- _2026-03-24: Initial spec created for Issue #13._
