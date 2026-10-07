# Spec: Disable Unsupported Video Formats in Selector

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Disable and visually annotate unsupported video/image formats dynamically in the Web Studio format selector based on browser capabilities and target dimensions, automatically falling back to a supported format when needed.

## 🛠 Technical Strategy

- **Core Technologies**: React, WebCodecs, Mediabunny, UPNG.js, gifenc
- **Architecture**: Serverless client-side rendering studio
- **Key Files**:
  - `web/src/utils/encoders/Registry.ts` & `web/src/utils/discoverFormats.ts`: Add resolution-aware format support discovery
  - `web/src/components/FormatSelector/FormatSelector.tsx`: Render disabled state and badge/label for unsupported formats
  - `web/src/components/ConfigPanel.tsx` & `web/src/components/Studio.tsx`: Propagate supported format flags and perform auto-fallback if the current selection is unsupported

## ✅ Task List

- [x] **Core Logic & Format Discovery**
  - [x] Enhance format discovery (`discoverFormats` / `FormatRegistry`) to evaluate `isSupported({ width, height })` for all registered formats.
  - [x] Implement auto-fallback logic in `Studio.tsx` / `ConfigPanel.tsx` to automatically switch to the first supported format if the active format becomes unsupported upon resolution change or SVG load.
- [x] **UI / Integration**
  - [x] Update `FormatSelector.tsx` to accept format items with `isSupported` status.
  - [x] Disable unsupported `<option>` items (`disabled={!format.isSupported}`) and append `(Unsupported)` label annotation.
  - [x] Ensure proper styling and accessibility (`aria-disabled`, screen reader compatibility).
- [x] **Testing & Quality**
  - [x] Add unit tests for `FormatSelector` checking that unsupported options are disabled and labeled.
  - [x] Add unit tests for format discovery and auto-fallback behavior.
- [x] **Documentation & SEO Pre-Flight**
  - [x] Verify `README.md` & `docs/ARCHITECTURE.md` consistency.
  - [x] Audit SEO keywords & metadata per SDD protocol.

## 🧪 Verification Plan

- [x] Unit Test: Verify `FormatSelector` renders `<option disabled>` for unsupported formats.
- [x] Unit Test: Verify format discovery evaluates `isSupported` with resolution.
- [x] Manual Test: In browser environments where specific codecs are unsupported, verify unsupported options are disabled in the dropdown and supported formats remain selectable.

## 📝 Change Log

- 2026-10-07: Initial spec created for disabling unsupported video formats in selector.
- 2026-10-07: Implemented resolution-aware format discovery, dynamic option disabling, and auto-fallback in FormatSelector and ConfigPanel.
