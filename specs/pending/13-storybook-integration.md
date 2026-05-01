# Spec: 13 - Storybook Component Testing

**GitHub Issue**: [https://github.com/GehDoc/svg-to-video/issues/13](https://github.com/GehDoc/svg-to-video/issues/13)
**Status**: 🟡 In-Progress (Decoupled architecture stable; implementing Node-task visual validation)

## 🎯 Objective

Establish visual component testing using Storybook and a robust, headless-compatible visual regression suite that produces human-readable PNG baselines via a Node.js task bridge.

## 🛠 Technical Strategy

- **Core Technologies**: Storybook 10.3.5, Vitest 4.1.4 (Browser Mode), `pixelmatch`, `pngjs`.
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
- [x] **Demo/Stress Test Strategy**: Retain `AnimationStressTest` as a permanent demo/performance benchmark. Stabilized snapshots by using deterministic 1s seeking before capture.

### ✨ Phase 3: Robust Visual Validation (Node-Bridge)

> [!IMPORTANT]
> **DEFERRED**: This phase has been moved to GitHub Issue [#28](https://github.com/GehDoc/svg-to-video/issues/28) to decouple Storybook stabilization from the infrastructure enhancement.

- [~] **Implement Vitest Node Tasks**: (Won't do now - see #28)
- [~] **Temporal & Fidelity Verification**: (Won't do now - see #28)

## 🧪 Verification Plan

- [x] Storybook launches and renders correctly.
- [x] Decoupled `test:visual` command executes without Storybook sandbox interference.
- [x] Visual regression produces stable base64 snapshots in `__snapshots__/`.
- [ ] CI pipeline fully green in headless mode.

### ⚠️ Known Limitations & Risks

> [!CAUTION]
> The current visual regression suite relies on base64 snapshots. These are **not** 100% reliable due to the following architectural gaps:

1. **Live Preview Interference**: The live monitor currently displays the "live" SVG. If the SVG is not explicitly frozen before a snapshot, the browser's rendering cycle might capture a frame while the animation is still progressing.
2. **Temporal Mismatch**: The snapshot moment in the test suite must be strictly identical to the moment used for actual MP4 generation. Any drift between the test capture and the production encoder will result in visual mismatches.
3. **Animation State Management**: The `seekAnimations` engine is expected to control playing status. The current implementation relies on "pausing" and "cloning," but the animation state (playing vs. paused) must be globally enforced as "always paused, only seeked" to ensure deterministic captures.

_These issues are now tracked as part of the visual validation infrastructure requirements._


## 📝 Change Log

- _2026-03-24: Initial spec created for Issue #13._
- _2026-04-13: Migrated to native decoupled runners and established stable base64 snapshots._
- _2026-04-18: Upgraded Storybook to 10.3.5, fixed Vitest 4.1.4 version conflict via root overrides, and deferred Phase 3 to Issue #28._
