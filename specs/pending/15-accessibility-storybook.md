# Spec: [15] - Accessibility & Storybook Setup

**GitHub Issue**: [None](https://github.com/GehDoc/svg-to-video/issues)
**Status**: 🟠 Pending

## 🎯 Objective

Improve UI readability and accessibility by ensuring Storybook correctly loads global CSS and integrating automated accessibility (A11y) validation.

## 🛠 Technical Strategy

- **CSS Loading**: Ensure Storybook loads global CSS (`index.css` and `App.css`) so theme variables are available.
- **A11y Addon**: Enable and configure `@storybook/addon-a11y` to audit stories for contrast and WCAG compliance.
- **Automation**: Extend CI tests to perform automated accessibility checks using `axe-core` within the Storybook test suite.

## ✅ Task List

- [x] **Storybook Styling**
  - [x] Configure Storybook to import global CSS/variables.
- [x] **Accessibility Tooling**
  - [x] Register `@storybook/addon-a11y`.
  - [x] Verify accessibility audits in Storybook UI.
- [ ] **CI Integration & Remediation**
  - [x] Identify and create missing Storybook stories for UI components (Header, ErrorView, etc.).
  - [x] Add automated A11y tests to CI pipeline (via `test:unit`).
  - [x] Extend A11y test coverage to `ConfigPanel` and fix discovered violations.
  - [x] Extend A11y test coverage to `Dropzone` and fix discovered violations.
  - [x] Fix A11y violations in all newly created stories.
  - [ ] Fix Storybook "run tests" command within the UI.
  - [ ] Verify A11y tests execution in GitHub Actions logs.

## 🧪 Verification Plan

- [ ] **Manual Test**: Verify Storybook components render with correct colors and high-contrast accessibility tools.
- [ ] **Automated Test**: Run CI to confirm accessibility check pass.

## 📝 Change Log

- 2026-05-02: Initial spec created by Gemini CLI.
