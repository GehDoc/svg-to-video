# Spec: Umami Analytics Improvements

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Audit, standardize, and expand Umami analytics event tracking across Web Studio to capture lightweight file ingestion (`file-load`), separate SVG metadata extraction (`file-parsed`), sponsorship clicks (`click-sponsor`), conversion duration performance, and consistent format/transparency metadata.

## 🛠 Technical Strategy

- **Core Technologies**: React, TypeScript, Umami Analytics JS API (`umami.track` / `data-umami-event`).
- **Architecture**: Client-side event tracking integrated into file handling (`Dropzone`, `ConfigPanel`), studio state initialization (`Studio`), rendering pipeline (`useRenderer`), navigation (`HeaderMenu`, `HeaderDropdown`), and output screens (`SuccessView`).
- **Key Dependencies**: `@shared/analyzeSvgAnimation`, `useRenderer`.

## ✅ Task List

- [x] **Core Event Standardization & Ingestion Tracking**
  - [x] Replace `Open Converter` with `file-load` in `Dropzone.tsx` / `ConfigPanel.tsx`.
  - [x] Simplify `file-load` to send lightweight payload: `{ method: 'file-picker' | 'drag-and-drop' }`.
  - [x] Add `file-parsed` event in `Studio.tsx` when SVG parameters are extracted: `{ aspectRatio, hasAnimation, detectedDuration, isDimensionsDetected }` using pre-calculated dimensions & animation analysis without duplicate parsing.
- [x] **Sponsorship & Links Tracking**
  - [x] Add `click-sponsor` tracking in `HeaderMenu.tsx` (`location: 'header'`), `HeaderDropdown.tsx` (`location: 'dropdown'`), and `SuccessView.tsx` (`location: 'success-view'`).
  - [x] Add `click-issue-report` and `click-source-code` events to `HeaderDropdown.tsx`.
- [x] **Conversion Performance & Metadata Tracking**
  - [x] Update `useRenderer.ts` (`conversion-start`, `conversion-success`, `conversion-failed`, `conversion-cancel`) to include `processDurationSec`, `videoDurationSec`, `totalFrames`, `fps`, and `captureMethod`.
  - [x] Update `copy-data-url` in `SuccessView.tsx` to send `{ success, format, isTransparent }`.
- [x] **Documentation & Verification**
  - [x] Update `docs/ANALYTICS.md` with full event schema (`file-load` and `file-parsed`).
  - [x] Update component & hook tests in `web/src/components/` to verify simplified `file-load` and `file-parsed`.

## 🧪 Verification Plan

- [x] Automated Test: `npm run test:unit` in `web/` to verify all unit tests pass.
- [x] Manual Test: Verify `file-load` fires with method and `file-parsed` fires with SVG metadata without double parsing.

## 📝 Change Log

- 2026-09-04: Initial spec created and completed by Antigravity Agent.
