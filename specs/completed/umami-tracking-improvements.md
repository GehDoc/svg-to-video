# Spec: Umami Analytics Improvements

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Audit, standardize, and expand Umami analytics event tracking across Web Studio to capture file ingestion metrics (`file-load`), sponsorship clicks (`click-sponsor`), conversion duration performance, and consistent format/transparency metadata.

## 🛠 Technical Strategy

- **Core Technologies**: React, TypeScript, Umami Analytics JS API (`umami.track` / `data-umami-event`).
- **Architecture**: Client-side event tracking integrated directly into file handling callbacks (`onSvgContentChange` in `Studio`), rendering pipeline (`useRenderer`), navigation (`HeaderMenu`, `HeaderDropdown`), and output screens (`SuccessView`).
- **Key Dependencies**: `@shared/analyzeSvgAnimation`, `useRenderer`.

## ✅ Task List

- [x] **Core Event Standardization & Ingestion Tracking**
  - [x] Replace `Open Converter` with `file-load` in `Dropzone.tsx` / `ConfigPanel.tsx`.
  - [x] Update `onSvgContentChange` callback in `Studio.tsx` to handle `method: 'file-picker' | 'drag-and-drop'`, compute SVG parameters once, and fire a single `file-load` event with `{ method, aspectRatio, hasAnimation, detectedDuration, isDimensionsDetected }` inside the event handler (no `useEffect`, no duplicate parsing).
- [x] **Sponsorship & Links Tracking**
  - [x] Add `click-sponsor` tracking in `HeaderMenu.tsx` (`location: 'header'`), `HeaderDropdown.tsx` (`location: 'dropdown'`), and `SuccessView.tsx` (`location: 'success-view'`).
  - [x] Add `click-issue-report` and `click-source-code` events to `HeaderDropdown.tsx`.
- [x] **Conversion Performance & Metadata Tracking**
  - [x] Update `useRenderer.ts` (`conversion-start`, `conversion-success`, `conversion-failed`, `conversion-cancel`) to include `processDurationSec`, `videoDurationSec`, `totalFrames`, `fps`, and `captureMethod`.
  - [x] Update `copy-data-url` in `SuccessView.tsx` to send `{ success, format, isTransparent }`.
- [x] **Documentation & Verification**
  - [x] Update `docs/ANALYTICS.md` with single `file-load` event schema.
  - [x] Update component & hook tests in `web/src/components/` to verify unified `file-load`.

## 🧪 Verification Plan

- [x] Automated Test: `npm run test:unit` in `web/` to verify all unit tests pass.
- [x] Manual Test: Verify `file-load` fires once inside `onSvgContentChange` with method and extracted SVG metadata.

## 📝 Change Log

- 2026-09-04: Initial spec created and completed by Antigravity Agent using event-handler-driven tracking strategy.
