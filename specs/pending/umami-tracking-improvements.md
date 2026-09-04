# Spec: Umami Analytics Improvements

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Audit, standardize, and expand Umami analytics event tracking across Web Studio to capture file ingestion metrics (`file-load`), sponsorship clicks (`click-sponsor`), conversion duration performance, and consistent format/transparency metadata.

## 🛠 Technical Strategy

- **Core Technologies**: React, TypeScript, Umami Analytics JS API (`umami.track` / `data-umami-event`).
- **Architecture**: Client-side event tracking integrated into file handling (`Dropzone`, `ConfigPanel`), rendering pipeline (`useRenderer`), navigation (`HeaderMenu`, `HeaderDropdown`), and output screens (`SuccessView`).
- **Key Dependencies**: `@shared/analyzeSvgAnimation`, `useRenderer`.

## ✅ Task List

- [ ] **Core Event Standardization & Ingestion Tracking**
  - [ ] Replace `Open Converter` with `file-load` (or standardized `kebab-case` event) in `Dropzone.tsx` / `ConfigPanel.tsx`.
  - [ ] Add ingestion metadata payload to `file-load`: `{ method: 'file-picker' | 'drag-and-drop', aspectRatio, hasAnimation, detectedDuration, isDimensionsDetected }`.
- [ ] **Sponsorship & Links Tracking**
  - [ ] Add `click-sponsor` tracking in `HeaderMenu.tsx` (`location: 'header'`), `HeaderDropdown.tsx` (`location: 'dropdown'`), and `SuccessView.tsx` (`location: 'success-view'`).
  - [ ] Add `click-issue-report` and `click-source-code` events to `HeaderDropdown.tsx`.
- [ ] **Conversion Performance & Metadata Tracking**
  - [ ] Update `useRenderer.ts` (`conversion-start`, `conversion-success`, `conversion-failed`, `conversion-cancel`) to include `processDurationSec`, `videoDurationSec`, `totalFrames`, `fps`, and `captureMethod`.
  - [ ] Update `copy-data-url` in `SuccessView.tsx` to send `{ success, format, isTransparent }`.
- [ ] **Documentation & Verification**
  - [ ] Update `docs/ANALYTICS.md` with full event schema and payload property descriptions.
  - [ ] Update and add component & hook tests in `web/src/components/` to verify Umami event calls.

## 🧪 Verification Plan

- [ ] Automated Test: `npm test` in `web/` to verify all unit tests pass with mocked `umami.track`.
- [ ] Manual Test: Run `npm run dev` in `web/`, trigger file upload, drag-and-drop, conversion, copy URL, and sponsor link clicks while inspecting `window.umami.track` mock calls.

## 📝 Change Log

- 2026-09-04: Initial spec created by Antigravity Agent.
