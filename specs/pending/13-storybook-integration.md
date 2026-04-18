# Spec: 13 - Storybook Component Testing

**GitHub Issue**: [https://github.com/GehDoc/svg-to-video/issues/13](https://github.com/GehDoc/svg-to-video/issues/13)
**Status**: 🟡 In-Progress (Visual validation stable, refining temporal/fidelity assertions)

## 🎯 Objective

Establish visual component testing using Storybook in the `web/` workspace to enable visual regression testing and component-level debugging for the `SvgRenderer`.

## 🛠 Technical Strategy

- **Core Technologies**: Storybook 10.3.3 (Vite integration), Vitest Browser Mode.
- **Visual Regression**: Uses native `expect.element().toMatchScreenshot()` for deterministic pixel-perfect validation, decoupled from the Storybook UI sandbox.
- **Fidelity & Temporal Validation**: Manual frame-data comparison to ensure scrubbing engine progress and cross-mode output fidelity.

## ✅ Task List

### 🚀 Phase 2: Advanced Integration & Gallery

- [x] **Exhaustive Component controls**
- [x] **Procedural Visual Validation Strategy**
- [x] **Visual Test Gallery**
- [x] **Automated Deployment**

### ✨ Phase 3: Final Polish & Stability

- [ ] **Temporal & Fidelity Validation (New)**
  - [ ] Implement `LoopSynchronizedCapture` assertions: Capture at **Start (T0)**, **Middle (T50%)**, and **End (T100%)**.
  - [ ] Assert `T0 != T50` and `T50 != T100` to verify smooth scrubbing progression.
  - [ ] Assert `Frame(Optimal) == Frame(High-Fidelity)` within pixel-distance threshold.
- [ ] **Stabilize Stress Test**: Adjust `AnimationStressTest` parameters to ensure consistent CI pass rates without fragile timeouts.
- [ ] **Final Deployment Verification**: Verify live deployment of the Storybook gallery on GitHub Pages.

## 🧪 Verification Plan

- [x] Storybook can be launched via `npm run storybook`.
- [x] `SvgRenderer` renders correctly in Storybook UI.
- [x] Native visual regression tests (`test:visual`) pass locally.
- [ ] Temporal integrity assertions pass (3-point scrubbing verification).
- [ ] Cross-mode fidelity assertion passes.
- [ ] CI pipeline fully green with no flaky timeouts.

## 📝 Change Log

- _2026-03-24: Initial spec created._
- _2026-03-28: Path issue resolved. Integrated Storybook tests into CI pipeline._
- _2026-04-13: Migrated to native `toMatchScreenshot` and decoupled runners._
- _2026-04-14: Identified `AnimationStressTest` timeout; expanded stability phase to include explicit temporal and fidelity assertions._
