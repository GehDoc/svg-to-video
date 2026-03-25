# Spec: 13 - Storybook Component Testing

**GitHub Issue**: [https://github.com/GehDoc/svg-to-video/issues/13](https://github.com/GehDoc/svg-to-video/issues/13)
**Status**: 🟠 Pending

## 🎯 Objective

Establish visual component testing using Storybook in the `web/` workspace to enable visual regression testing and component-level debugging for the `SvgRenderer`.

## 🛠 Technical Strategy

- **Core Technologies**: Storybook (Vite integration), Storybook Test Runner (Playwright-based), Chromatic (optional, but standard for visual regression).
- **Architecture**: Move from brute-force E2E tests to component-level sandboxing.
- **Component Sandbox**: Create `SvgRenderer.stories.tsx` to expose `seek` and `capture` controls, allowing inspection of `SvgRenderer` in isolation.
- **Visual Regression**: Implement baseline screenshots for different rendering modes (Optimal vs. High-Fidelity) at critical timestamps.

## ✅ Task List

- [ ] **Infrastructure**
  - [ ] Add Storybook dependencies (`@storybook/react`, etc.) to `web/package.json`.
  - [ ] Configure `storybook/` directory and Vite integration.
- [ ] **Component Integration**
  - [ ] Create `SvgRenderer.stories.tsx` with controls.
  - [ ] Expose `seek` and `capture` controls via Storybook Controls pane.
- [ ] **Testing**
  - [ ] Configure Storybook Test Runner.
  - [ ] Implement "Loop-Synchronized-Capture" test scenario (Fixture: `loop-test.svg`).
  - [ ] Verify T0 vs T1 pixel-matching.

## 🧪 Verification Plan

- [ ] Storybook can be launched via `npm run storybook`.
- [ ] Visual regression tests pass locally using `test-storybook`.

## 📝 Change Log

- _2026-03-24: Initial spec created for Issue #13._
