# Spec: Umami Analytics Improvements

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Audit, standardize, and expand Umami analytics event tracking across Web Studio to capture file ingestion metrics (`file-load`), sponsorship clicks (`click-sponsor`), conversion duration performance, consistent format/transparency metadata, and centralized version injection (`trackEvent`).

## 🛠 Technical Strategy

- **Core Technologies**: React, TypeScript, Umami Analytics JS API (`umami.track` / `data-umami-event`).
- **Architecture**:
  - Centralized `trackEvent` helper in `web/src/utils/analytics.ts` that enforces `{ ...properties, version: pkg.version }` so caller properties cannot override `version`.
  - Strictly typed `EventProperties = Record<string, unknown> & { version?: never }` to forbid callers from passing `version` in event payloads at compile time.
  - Integration across file handling (`Studio`), rendering pipeline (`useRenderer`), navigation (`HeaderMenu`, `HeaderDropdown`), and output screens (`SuccessView`).
- **Key Dependencies**: `@shared/analyzeSvgAnimation`, `useRenderer`.

## ✅ Task List

- [x] **Centralized Analytics Helper**
  - [x] Create `web/src/utils/analytics.ts` with `trackEvent` helper that appends `version: pkg.version` after spreading `properties` and forbids `version` in `EventProperties` type.
- [x] **Core Event Standardization & Ingestion Tracking**
  - [x] Replace `Open Converter` with `file-load` in `Dropzone.tsx` / `ConfigPanel.tsx`.
  - [x] Refactor all components (`Studio`, `ConfigPanel`, `HeaderMenu`, `HeaderDropdown`, `SuccessView`, `useRenderer`) to use `trackEvent`.
- [x] **Sponsorship & Links Tracking**
  - [x] Add `click-sponsor` tracking in `HeaderMenu.tsx` (`location: 'header'`), `HeaderDropdown.tsx` (`location: 'dropdown'`), and `SuccessView.tsx` (`location: 'success-view'`).
  - [x] Add `click-issue-report` and `click-source-code` events to `HeaderDropdown.tsx`.
- [x] **Conversion Performance & Metadata Tracking**
  - [x] Update `useRenderer.ts` (`conversion-start`, `conversion-success`, `conversion-failed`, `conversion-cancel`) to include `processDurationSec`, `videoDurationSec`, `totalFrames`, `fps`, and `captureMethod`.
  - [x] Update `copy-data-url` in `SuccessView.tsx` to send `{ success, format, isTransparent }`.
- [x] **Documentation & Verification**
  - [x] Update `docs/ANALYTICS.md` and `CONTRIBUTING.md` to document automatic `version` injection and `trackEvent`.
  - [x] Update unit tests in `web/src/components/` to verify `trackEvent` and `version` payload.

## 🧪 Verification Plan

- [x] Automated Test: `npm run test:unit` in `web/` to verify all unit tests pass with version tracking.
- [x] Type Checking: `npm run type-check` to verify `version` override is forbidden by TypeScript.

## 📝 Change Log

- 2026-09-05: Technical strategy updated to add centralized `trackEvent` helper with strict TypeScript typing forbidding property overrides and automatic version payload injection. Implementation completed and verified.
