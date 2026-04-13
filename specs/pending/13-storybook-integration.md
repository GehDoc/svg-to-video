# Spec: 13 - Storybook Component Testing

**GitHub Issue**: [https://github.com/GehDoc/svg-to-video/issues/13](https://github.com/GehDoc/svg-to-video/issues/13)
**Status**: 🟡 In-Progress (Visual validation stable, investigating stress test performance)

## 🎯 Objective

Establish visual component testing using Storybook in the `web/` workspace to enable visual regression testing and component-level debugging for the `SvgRenderer`.

## 🛠 Technical Strategy

- **Core Technologies**: Storybook 10.3.3 (Vite integration), Vitest Browser Mode.
- **Visual Regression**: Uses native `expect.element().toMatchScreenshot()` for deterministic pixel-perfect validation.

## ✅ Task List

### 🚀 Phase 2: Advanced Integration & Gallery

- [x] **Exhaustive Component controls**
  - [x] Refactor `Wrapper` to support declarative `svgContent` updates via Storybook Controls.
  - [x] Add `width`, `height`, and `backgroundColor` as interactive knobs.
  - [x] Replace `window.alert` with **Storybook Actions** for cleaner event logging.
- [x] **Procedural Visual Validation Strategy**
  - [x] Implement capture logic in `Wrapper` to extract pixel data.
  - [x] Implement `toMatchScreenshot` using native browser mode.
- [x] **Visual Test Gallery**
  - [x] Create `TypographySuite.story`.
  - [x] Create `AnimationStressTest.story` (investigating performance timeout).
  - [x] Create `FilterFidelity.story`.
- [x] **Automated Deployment**
  - [x] Update `.github/workflows/deploy.yml` for Storybook.
  - [x] Ensure `coi-serviceworker` is active.

## 🧪 Verification Plan

- [x] Storybook can be launched via `npm run storybook`.
- [x] `SvgRenderer` renders correctly in Storybook UI with auto-loaded default SVG.
- [x] Visual regression tests pass locally using `npm run test:storybook` (AnimationStressTest currently timing out).

## 📝 Change Log

- _2026-03-24: Initial spec created for Issue #13._
- _2026-03-28: Path issue resolved. Integrated Storybook tests into CI pipeline._
- _2026-04-13: Migrated to native `toMatchScreenshot` for visual regression._
- _2026-04-14: Identified `AnimationStressTest` performance timeout; current focus is optimizing capture or increasing timeout headroom._
