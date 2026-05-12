# Spec: 44 - Fix CSS Animation Capture

**GitHub Issue**: [#44](https://github.com/GehDoc/svg-to-video/issues/44)
**Status**: 🟠 Pending

## 🎯 Objective

Resolve the issue where CSS animations appear static in video output by implementing a "Bake & Clean" strategy in the renderer and enhancing verification tests.

## 🛠 Technical Strategy

- **Bake & Clean Strategy**:
  - **Baking**: Iterate through live SVG elements and explicitly copy computed styles (including animation matrices) to a cloned node.
  - **Cleaning (Stripping Strategy)**: Remove specific tags to ensure the clone is a static, inert snapshot:
    - `<animate>`, `<animateTransform>`, `<animateMotion>`, `<set>`: Must be removed to prevent SMIL animations from "double-running" or continuing from the baked state during canvas rendering.
    - `<style>`: Must be removed because computed styles are now inlined. Keeping original styles (and `@keyframes`) can cause the browser's CSS engine to override the baked "static" properties.
    - `<script>`: Must be removed for security and to prevent any side effects or DOM manipulation during the capture process.
- **Refactoring**: Clean up `renderer.js` for clarity and index-safety. Make `SvgRenderer.test.tsx` more maintainable by extracting a capture helper.

## ✅ Task List

- [x] **Core Logic (renderer.js)**
  - [x] Refactor the element iteration to use a robust flat mapping (original -> clone) to avoid index mismatches.
  - [x] Implement "Bake" phase: Copy all essential `OPTIMAL_PROPS` (including `transform`) from live elements to clone.
  - [x] Implement "Clean" phase: Consolidate stripping of `animate`, `set`, `style`, and `script` tags.
  - [x] Refactor loops and variable names for clarity and elegance.
- [x] **Testing (SvgRenderer.test.tsx)**
  - [x] Refactor tests to be DRY by extracting a `captureFrameAsDataUrl` helper.
  - [x] Update `CSSAnimation` test to assert visual difference between initial and midway frames.
  - [x] Add new test cases (`StrippedTagsAnimation`) to verify that stripped tags (like SMIL `animate` or `set`) are correctly "baked" into static captures.
- [x] **Documentation**
  - [x] Remove the "Known Issue" section regarding CSS animation capture from `README.md`.

## 🧪 Verification Plan

- [ ] Manual Test: Open Storybook and verify `CSSAnimation` and `SMILAnimation` stories display accurate frame-by-frame previews.
- [x] Automated Test: `npm run test:visual` must pass with all frame-comparison assertions active.

## 📝 Change Log

- 2026-05-12: Initial spec created by Gemini CLI.
- 2026-05-12: Implementation of "Bake & Clean" strategy and test refactoring complete. Refactored `renderer.js` for elegance.
