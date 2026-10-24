# Spec: 226 - Unify Export Format Capabilities

**GitHub Issue**: [https://github.com/GehDoc/svg-to-video/issues/226](https://github.com/GehDoc/svg-to-video/issues/226)
**Status**: 🟢 Completed

## 🎯 Objective

Centralize export format metadata, extensions, MIME types, alpha transparency support, and color keying requirements into a shared module (`shared/formatCapabilities.ts`) so CLI and Web Studio consume a single source of truth and eliminate capability drift.

## 🛠 Technical Strategy

- **Core Technologies**: TypeScript (Shared / Node.js / Web)
- **Architecture**: Single Source of Truth in `shared/` imported by both CLI (`src/formats/generators/*.ts`, `src/formats/registry.ts`) and Web Studio (`web/src/utils/encoders/*.ts`, `web/src/utils/discoverFormats.ts`).
- **Key Dependencies**: Shared module imported via `#shared/formatCapabilities.js` (CLI) and `@shared/formatCapabilities` (Web).

## ✅ Task List

- [x] **Infrastructure**
  - [x] Create `shared/formatCapabilities.ts` containing `FormatCapability` interface, `FORMAT_CAPABILITIES` mapping, and lookup helpers (`getFormatCapability`, `getAllFormatCapabilities`).
  - [x] Add unit tests in `shared/formatCapabilities.test.ts` to verify resolution and properties for all formats (`mp4`, `webm`, `gif`, `apng`, `mkv`, `mov`).

- [x] **Core Logic (CLI)**
  - [x] Refactor CLI format generators (`Mp4FormatGenerator`, `WebmFormatGenerator`, `GifFormatGenerator`, `ApngFormatGenerator`, `MkvFormatGenerator`, `MovFormatGenerator`) in `src/formats/generators/` to source capability properties from `FORMAT_CAPABILITIES`.
  - [x] Refactor `CLIFormatRegistry` in `src/formats/registry.ts` and `src/utils/validateOptions.ts` if needed to utilize shared capabilities.

- [x] **UI / Integration (Web Studio)**
  - [x] Refactor `BaseFormat`, `MediaBunnyFormat`, `ApngFormat`, and `GifFormat` in `web/src/utils/encoders/` to source capability properties from `FORMAT_CAPABILITIES`.
  - [x] Refactor `web/src/utils/discoverFormats.ts` to consume `FORMAT_CAPABILITIES`.

- [x] **Documentation & SEO Pre-Flight**
  - [x] Update `docs/ARCHITECTURE.md` to document `shared/formatCapabilities.ts` as the central capability registry.
  - [x] Audit `docs/ANALYTICS.md` (no event changes, verified alignment).
  - [x] Verify fast checks and unit tests (`npm run check:fast`, `npm run test:unit`, `npm run test:unit -w web`).

## 🧪 Verification Plan

- [x] Automated Test: `npm run test:unit`
- [x] Automated Test: `npm run test:unit -w web`
- [x] Fast Quality Check: `npm run check:fast`

## 📝 Change Log

- 2026-10-18: Initial spec created for issue #226 by Jules.
- 2026-10-18: Implementation and verification completed.
