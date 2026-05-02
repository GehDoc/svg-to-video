# Spec: [UI-Refactor] - Refactor MonitorPanel into Mutually Exclusive Components

**GitHub Issue**: [None](https://github.com/GehDoc/svg-to-video/issues)
**Status**: 🟠 Pending

## 🎯 Objective

Refactor the `MonitorPanel` into mutually exclusive `SuccessView`, `RenderingView`, and `LandingView` components to simplify state management and enable clean, state-specific layout styling for the new regulatory/version footer.

## 🛠 Technical Strategy

- **Core Technologies**: React, CSS Modules/Scoped CSS
- **Architecture**: Refactor monolithic component into a controller pattern with clean child components.
- **Regulatory Requirement**: `LandingView` will include a prominent MIT license disclaimer (with no-warranty clause) and a persistent GitHub link at the bottom of the screen.
- **Layout Requirement**: `LandingView` must feature vertically centered "upload prompt" and a footer pinned to the absolute bottom of the viewport.

## ✅ Task List

- [x] **Structural Refactoring**
  - [x] Create `SuccessView`, `RenderingView`, `LandingView` components.
  - [x] Refactor `MonitorPanel` to act as the main controller.
- [ ] **Testing & Validation**
  - [ ] Create Storybook stories for `SuccessView`, `RenderingView`, and `LandingView`.
- [ ] **UI Implementation (LandingView)**
  - [ ] Implement centered upload prompt using flexbox.
  - [ ] Add legal disclaimer (MIT link + no-warranty clause) to footer.
  - [ ] Pin legal/version footer to the absolute bottom of the viewport.
- [ ] **Cleanup**
  - [ ] Remove redundant/broken styles from `App.css`.

## 🧪 Verification Plan

- [ ] **Manual Test**: Verify the new `LandingView` layout across resolutions.
- [ ] **Manual Test**: Confirm no regressions in `RenderingView` and `SuccessView`.
- [ ] **Automated Test**: Run tests in `web/` directory to ensure no regression in core studio functionality.

## 📝 Change Log

- 2026-05-02: Initial spec created by Gemini CLI.
