# Spec: [15] - Accessibility & Storybook Setup

**GitHub Issue**: [None](https://github.com/GehDoc/svg-to-video/issues)
**Status**: 🟢 Completed

## 🎯 Objective

Improve UI readability and accessibility by ensuring Storybook correctly loads global CSS and integrating automated accessibility (A11y) validation.

## 🛠 Technical Strategy

- **CSS Loading**: Ensure Storybook loads global CSS (`index.css` and `App.css`) so theme variables are available.
- **A11y Addon**: Enable and configure `@storybook/addon-a11y` to audit stories for contrast and WCAG compliance.
- **Automation**: Use official Storybook Test Runner to perform real-browser accessibility checks, replacing unreliable JSDOM unit tests.
- **Unified Config**: Merge Storybook-specific Vitest configuration into `vite.config.ts` to enable integrated UI testing features.
- **CI Optimization**: Implement Playwright browser caching and target only Chromium to significantly reduce pipeline execution time.

## ✅ Task List

- [x] **Storybook Styling**
  - [x] Configure Storybook to import global CSS/variables.
- [x] **Accessibility Tooling**
  - [x] Register `@storybook/addon-a11y`.
  - [x] Verify accessibility audits in Storybook UI.
- [x] **CI Integration & Remediation**
  - [x] Identify and create missing Storybook stories for UI components.
  - [x] Add automated A11y tests to CI pipeline (via `npm run test:storybook`).
  - [x] Extend A11y test coverage to all major components.
  - [x] Fix discovered A11y violations in components (contrast, labels).
- [x] **Real-Browser Interaction Testing (New Strategy)**
  - [x] Configure Storybook Test Runner to run A11y audits.
  - [x] Migrate component accessibility tests from JSDOM to Storybook Interaction tests.
  - [x] ~~**Fix Storybook "run tests" command within the UI**~~ (Won't Do)
- [x] **UI/UX Refinements**
  - [x] **Decouple SvgRenderer Tests (Parity Plan)**:
    - [x] **Test: Loop Synchronized Capture**
    - [x] **Test: Animation Stress Test**
    - [x] **Test: Filter Fidelity**
  - [x] **Verify Test Pass**: Run and confirm all unit tests pass after decoupling.
  - [x] **Refactor SvgRenderer Stories**: Remove buttons from UI and simplify.
  - [x] **Fix Header Favicon**: Replace Storybook favicon with application icon via `vite-plugin-svgr`.
  - [x] **Restore Header Aesthetics**: Fix 'Studio' badge/name color and font.
  - [x] ~~**Refine "Live Monitor" label**: Adjust style for better integration.~~ (Won't Do)
- [x] **Final Cleanup & Verification**
  - [x] Remove `jest-axe` dependency and references.
  - [x] Update E2E test locators (Golden Path and Smoke Tests) to be robust.
  - [x] Optimize CI Playwright installation (Caching + Chromium-only).
  - [x] Verify A11y tests execution in local runner (simulating CI).
- [x] **Documentation Update**
  - [x] Update `DEVELOPER.md` with the new testing strategy (Real-browser vs JSDOM).
  - [x] Add Accessibility Protocol to `AGENTS.md`.

## 🧪 Verification Plan

- [x] **Manual Test**: Verified Storybook components pass A11y audits in the UI panel.
- [x] **Automated Test**: `npm run test:storybook` passes locally with 0 violations.
- [x] **CI Check**: Optimized Playwright installation verified in `ci.yml`.

## 📝 Change Log

- 2026-05-02: Initial spec created by Gemini CLI.
- 2026-05-05: Finalized migration to Storybook Test Runner and unified Vitest configuration. Remediation complete for all contrast violations. Refactored E2E locators for robustness. Optimized CI pipeline performance (caching, Chromium target) and fixed Storybook server execution in CI. Upgraded GitHub Actions runtime to Node.js 24.
