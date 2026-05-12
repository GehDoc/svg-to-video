# Spec: 44 - Fix CSS Animation Capture

**GitHub Issue**: [#44](https://github.com/GehDoc/svg-to-video/issues/44)
**Status**: 🟠 Pending

## 🎯 Objective

Resolve the issue where CSS animations appear static in video output by implementing a "Bake & Clean" strategy in the renderer and enhancing verification tests.

## 🛠 Technical Strategy

- **Bake & Clean Strategy**:
  - **Baking**: Iterate through live SVG elements and explicitly copy computed styles (including animation matrices) to a cloned node.
  - **Cleaning**: Strip all `<style>`, `<script>`, and `<animate*>` tags from the clone _after_ baking to ensure the serialized SVG is a static, frame-accurate representation that doesn't conflict with original styles or re-run animations.
- **Refactoring**: Clean up `renderer.js` for clarity and index-safety. Make `SvgRenderer.test.tsx` more maintainable by extracting a capture helper.

## ✅ Task List

- [ ] **Core Logic (renderer.js)**
  - [ ] Refactor the element iteration to use a robust flat mapping (original -> clone) to avoid index mismatches.
  - [ ] Implement "Bake" phase: Copy all essential `OPTIMAL_PROPS` and force-copy `transform` as an attribute.
  - [ ] Implement "Clean" phase: Consolidate stripping of `animate`, `set`, `style`, and `script` tags.
- [ ] **Testing (SvgRenderer.test.tsx)**
  - [ ] Refactor tests to be DRY by extracting a `captureFrameAsDataUrl` helper.
  - [ ] Update `CSSAnimation` test to assert visual difference between initial and midway frames.
  - [ ] Add new test cases to verify that stripped tags (like SMIL `animate` or `set`) are correctly "baked" into static captures.
- [ ] **Documentation**
  - [ ] Remove the "Known Issue" section regarding CSS animation capture from `README.md`.

## 🧪 Verification Plan

- [ ] Manual Test: Open Storybook and verify `CSSAnimation` and `SMILAnimation` stories display accurate frame-by-frame previews.
- [ ] Automated Test: `npm run test:visual` must pass with all frame-comparison assertions active.

## 📝 Change Log

- 2026-05-12: Initial spec created by Gemini CLI.
