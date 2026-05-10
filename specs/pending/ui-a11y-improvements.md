# Spec: UI-A11Y-IMPROVEMENTS - UI and Accessibility Improvements

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Improve the visual distinction of disabled UI elements and ensure accessibility compliance for the application's dark mode, including automated CI testing.

## 🛠 Technical Strategy

- **Core Technologies**: React, SCSS, CSS Variables, Storybook, Axe-Playwright, GitHub Actions.
- **Approach**:
  - Audit CSS properties to ensure high distinction between enabled and disabled states.
  - Enhance visual feedback for `:disabled` and `.is-locked` states.
  - Implement automated A11Y testing in Storybook for both light and dark modes.
  - Integrate A11Y checks into the CI pipeline.

## ✅ Task List

- [x] **Research & Audit**
  - [x] Audit `index.css` for contrast "improvements" that reduced distinction.
  - [x] Audit `ConfigPanel.scss` and `Button.scss` for unnecessary properties in disabled states.
- [x] **UI Implementation**
  - [x] Update `.config-panel` input/select/range disabled styles.
  - [x] Update `.btn:disabled` styles.
  - [x] Strengthen `.is-locked` visual feedback in `App.css`.
- [x] **Automated Testing & CI**
  - [x] Create `web/.storybook/test-runner.ts` with `axe-playwright` integration.
  - [x] Update `.github/workflows/ci.yml` to run Storybook A11Y tests for both themes.
- [x] **Storybook Updates**
  - [x] Add "Disabled" stories to all components.
  - [x] Add "Locked" state story for `ConfigPanel`.

## 🧪 Verification Plan

- [ ] **Manual**: Verify visual distinction in Chrome DevTools (emulate dark mode).
- [ ] **Automated**: `npm run test:storybook` passing in CI for both themes.
- [ ] **Audit**: No WCAG AA violations found by Axe.

## 📝 Change Log

- 2026-05-10: Initial spec created by Gemini CLI based on approved plan.
