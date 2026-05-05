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

## 🛠 Technical Strategy

- **CSS Loading**: Ensure Storybook loads global CSS (`index.css` and `App.css`).
- **A11y Addon**: Enable `@storybook/addon-a11y` for WCAG audits.
- **Interaction Testing**: Use Storybook Interaction Tests (via Vitest Browser Mode/Playwright) to perform real-browser accessibility audits, replacing unreliable JSDOM unit tests.

## ✅ Task List

- [x] **Storybook Styling**
  - [x] Configure Storybook to import global CSS/variables.
- [x] **Accessibility Tooling**
  - [x] Register `@storybook/addon-a11y`.
  - [x] Verify accessibility audits in Storybook UI.
- [x] **CI Integration & Remediation**
  - [x] Identify and create missing Storybook stories for UI components.
  - [x] Add automated A11y tests to CI pipeline.
  - [x] Extend A11y test coverage to `ConfigPanel` and `Dropzone` (JSDOM-based).
  - [x] Fix discovered A11y violations in components.
- [ ] **Real-Browser Interaction Testing (New Strategy)**
  - [ ] Remove `jest-axe` dependency and references.
  - [ ] Configure `vitest.storybook.ts` to run A11y audits for all components.
  - [ ] Migrate component accessibility tests from JSDOM to Storybook Interaction tests.
  - [ ] Fix Storybook "run tests" command.
  - [ ] Verify A11y tests execution in GitHub Actions logs.
- [ ] **Documentation Update**
  - [ ] Update `DEVELOPER.md` with the new testing strategy (Real-browser vs JSDOM).
  - [ ] Add Accessibility Protocol to `AGENTS.md`.

## 🧪 Verification Plan

- [ ] **Manual Test**: Verify Storybook components render with correct colors and high-contrast accessibility tools.
- [ ] **Automated Test**: Run CI to confirm accessibility check pass.

## 📝 Change Log

- 2026-05-02: Initial spec created by Gemini CLI.
