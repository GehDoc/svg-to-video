# Spec: UI-UX-Refinement - Web Studio UI/UX Enhancements

**GitHub Issue**: [None](https://github.com/GehDoc/svg-to-video/issues)
**Status**: 🟠 Pending

## 🎯 Objective

Improve the Web Studio's visual layout, responsiveness, and interactive feedback loop while unifying the theme system and ensuring a stable, predictable UI.

## 🛠 Technical Strategy

- **Core Technologies**: React, SCSS, CSS Variables, StudioContext
- **Theme**: Consolidate CSS variables from `index.css` and `App.css` into a single source of truth.
- **Layout**: Transition from a fixed-width centered layout to a full-bleed application layout.
- **Interactivity**: Enhance the "Live Preview" by syncing `StudioContext` state with the `SvgRenderer` before the rendering process starts.
- **Stability**: Refactor `ProgressOverlay` to use "placeholder/disabled" patterns instead of conditional mounting to prevent layout shifts.

## ✅ Task List

### Step 1: Layout & Theme Unification (Infrastructure)

### Step 1: Layout & Theme Unification (Infrastructure)

- [x] **Full-Width Layout Implementation**
  - [x] Remove fixed `1126px` width from `#root` in `index.css`.
  - [x] Ensure `app-container` and `studio-layout` correctly fill the viewport.
  - [x] _Verification_: Visual inspection and Storybook "Viewport" tests.
- [x] **CSS Variable Unification**
  - [x] Consolidate variables from `web/src/App.css` and `web/src/index.css` into `web/src/index.css`.
  - [x] Standardize naming (e.g., `--studio-bg`, `--studio-panel`, etc.).
  - [x] _Verification_: Storybook smoke test to ensure colors are consistent across components.

### Step 2: ConfigPanel State & Locking (Core Logic)

- [x] **Context-Aware Locking**
  - [x] Modify `ConfigPanel` sections to be disabled when `!svgContent`.
  - [x] Ensure inputs are functionally disabled AND visually styled as such.
  - [x] _Verification_: Vitest unit test for `ConfigPanel` (checking disabled attributes when no SVG).

### Step 3: Live Preview & Interaction Sync (Integration)

### Step 3: Live Preview & Interaction Sync (Integration)

- [x] **Initial Frame Preview**
  - [x] Update `useRenderer` / `StudioProvider` to render the initial frame as soon as `svgContent` is available.
  - [x] _Verification_: Manual test: dropping an SVG shows it immediately in the monitor.
- [x] **Real-time Param Sync**
  - [x] Ensure changes to `duration`, `fps`, `scale`, and `backgroundColor` in the `ConfigPanel` trigger a re-render of the preview frame in `SvgRenderer`.
  - [x] _Verification_: Vitest unit tests in `StudioProvider.test.tsx` confirm `loadSvg` is called with updated params.

### Step 4: Progress Overlay Stability (UI Polish)

- [ ] **Refactor ProgressOverlay**
  - [ ] Replace conditional rendering of `MetaDisplay` and status text with visibility/opacity/disabled patterns.
  - [ ] Define fixed height/slots for all potential overlay elements to prevent layout "pop".
  - [ ] _Verification_: Storybook "Chromatic" or manual visual inspection of the transition from "Idle" to "Rendering".

### Step 5: Form Control Refinement (Nice to Have)

- [ ] **Modernize Inputs**
  - [ ] Update SCSS for `select`, `input[type='number']`, and `input[type='text']` with custom focus rings and consistent padding.
  - [ ] _Verification_: Visual review in Storybook.

## 🧪 Verification Plan

### Automated Tests

- **Vitest (Unit)**: `npm run test:unit`
  - New test cases for `ConfigPanel` locking logic.
  - Assert that `StudioContext` updates trigger necessary component re-renders.
- **Storybook (Interaction)**: `npm run test:storybook`
  - Verify that changing a value in `ConfigPanel` updates the `SvgRenderer` state.
- **Visual Regression**: `npm run test:visual`
  - Update baselines after theme/layout changes.

### Manual Test Plan

1. Open Studio.
2. Verify sidebar is locked and "LandingView" is centered.
3. Drop `examples/example.svg`.
4. Verify SVG appears immediately.
5. Change Background Color; verify preview updates instantly.
6. Click Export; verify `ProgressOverlay` appears without layout shift.

## 📝 Change Log

- 2026-05-08: Initial spec created by Gemini CLI.
