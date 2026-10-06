# Spec: 175 - Target Dimension Preview & Capture Method Tooltips

**GitHub Issue**: [https://github.com/GehDoc/svg-to-video/issues/175](https://github.com/GehDoc/svg-to-video/issues/175)
**Status**: 🟢 Completed

## 🎯 Objective

Display calculated target resolution dimensions (e.g. `1280 x 720 px`) directly in the ConfigPanel resolution selector when an SVG file with detected dimensions is loaded. Additionally, provide informative inline helper text and tooltips for the Capture Method selector explaining the difference between "Optimal (Fast)" and "High Fidelity (Slow)".

## 🛠 Technical Strategy

- **Core Components**: `web/src/components/ConfigPanel.tsx`, `web/src/components/Studio.tsx`
- **Resolution Calculation**: Utilize `calculateFinalDimensions` from `web/src/hooks/useRenderer.ts` or `targetDim` calculated in `Studio.tsx`.
- **UI Elements**: Add hint helper text (`<p className="hint-text hint-text--info">`) under the Resolution selector and under the Capture Method selector. Add `title` attribute tooltips on Capture Method `<option>` elements for hover clarity.

## ✅ Task List

- [x] **Core Logic & UI**
  - [x] Pass `targetDim` prop from `Studio.tsx` to `ConfigPanel.tsx`.
  - [x] Render target resolution preview in `ConfigPanel.tsx` when SVG content is loaded and original dimensions are detected.
  - [x] Add capture method helper text and option tooltips in `ConfigPanel.tsx`.
- [x] **Testing & Stories**
  - [x] Update Storybook stories in `ConfigPanel.stories.tsx`.
  - [x] Add unit tests in `ConfigPanel.test.tsx` verifying dimension preview and capture method tooltips/helper text.
- [x] **Documentation & Pre-flight Checks**
  - [x] Ensure all unit tests and fast checks pass (`npm run test:unit -w web` and `npm run check:fast`).

## 🧪 Verification Plan

- [x] Automated Test: `npm run test:unit -w web`
- [x] Code Quality: `npm run check:fast`

## 📝 Change Log

- 2026-09-28: Initial spec created for Issue #175.
- 2026-09-28: Target dimension preview and capture method tooltips implemented and verified with unit tests. Spec completed.
