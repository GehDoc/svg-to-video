# Spec: 13 - Storybook Component Testing

**GitHub Issue**: [https://github.com/GehDoc/svg-to-video/issues/13](https://github.com/GehDoc/svg-to-video/issues/13)
**Status**: 🟡 In-Progress (Decoupled architecture stable; implementing Node-task visual validation)

## 🎯 Objective

Establish visual component testing using Storybook and a robust, headless-compatible visual regression suite that produces human-readable PNG baselines via a Node.js task bridge.

## 🛠 Technical Strategy

- **Core Technologies**: Storybook 10.3.3, Vitest Browser Mode, `pixelmatch`, `pngjs`.
- **Decoupled Runners**:
  - `test:storybook`: UI interaction tests in the browser.
  - `test:visual`: Pixel-matching tests using a dedicated `vitest.visual.config.ts`.
- **Node-Task Bridge**:
  - Use Vitest **Tasks** to bridge the Browser-to-Disk gap.
  - Browser captures `dataUrl` -> Sends to Node.js task via `vi.waitFor` or custom task runner.
  - Node.js task writes binary `.png` and performs `pixelmatch` comparison on the host filesystem.
- **Verification Logic**: 3-point temporal checks (Start/Middle/End) for both loop and filter stories to ensure scrubbing engine continuity.

## ✅ Task List

### 🚀 Phase 2: Advanced Integration & Gallery

- [x] **Exhaustive Component controls**
- [x] **Visual Test Gallery** (Typography, Filters, Loop)
- [x] **Automated Deployment** configuration
- [ ] **Remove AnimationStressTest**: Drop the redundant/unstable stress test as it is no longer required.

### ✨ Phase 3: Robust Visual Validation (Node-Bridge)

- [ ] **Implement Vitest Node Tasks**:
  - [ ] Create `saveAndCompareScreenshot` task in `vitest.visual.config.ts`.
  - [ ] Implement binary `.png` writing in Node.js context (bypassing browser sandbox).
  - [ ] Implement `pixelmatch` logic with configurable thresholds.
- [ ] **Temporal & Fidelity Verification**:
  - [ ] Update `LoopSynchronizedCapture` assertions: Capture at **Start (T0)**, **Middle (T50%)**, and **End (T100%)**.
  - [ ] Update `FilterFidelity` to verify temporal progression of SVG filters (Start/Middle/End).
  - [ ] Assert `Frame(Optimal) == Frame(High-Fidelity)` using the Node-task bridge.

## 🧪 Verification Plan

- [x] Storybook launches and renders correctly.
- [x] Decoupled `test:visual` command executes without Storybook sandbox interference.
- [ ] Visual regression produces viewable, binary `.png` files in `__snapshots__/`.
- [ ] Temporal tests fail if animation is frozen or "jumping" between Start/Middle/End.
- [ ] CI pipeline fully green in headless mode.

## 📝 Change Log

- _2026-03-24: Initial spec created for Issue #13._
- _2026-04-13: Migrated to native decoupled runners and established stable base64 snapshots._
- _2026-04-18: Redrafted Phase 3: Implementing Node-task bridge for binary PNG storage, expanding temporal checks to Filter story, and removing redundant AnimationStressTest._
