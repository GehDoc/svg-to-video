# Spec: Refactor Encoder Coupling (Decentralized Registry)

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Further decentralize the encoder architecture by moving format metadata and factories into the encoder implementations, ensuring the system is resolution-agnostic during discovery, and removing the central `Formats.ts` registration file.

## 🛠 Technical Strategy

- **Decentralized Metadata**:
  - Move `VideoFormat` implementations (factories) into their respective encoder files (`MediaBunnyEncoder.ts`, `ApngEncoder.ts`, `GifEncoder.ts`).
  - Encoders will export their corresponding `VideoFormat` instances.
- **Explicit Registration**:
  - Remove auto-registration from module load time.
  - `discoverFormats.ts` will explicitly register the known format factories into the `FormatRegistry`.
- **Resolution-Agnostic Discovery**:
  - `discoverFormats` will return all registered formats for the UI selector without performing `isSupported` resolution checks.
- **Renderer-Level Validation**:
  - `useRenderer.ts` will perform the `isSupported(resolution)` check right before starting the render process.
- **Registry as a Service**:
  - Keep `FormatRegistry` but ensure it's used as a controlled service rather than a hidden global side-effect.

## ✅ Task List

- [x] **Encoders Refactoring**
  - [x] Move `MediaBunnyFormat` and its registrations to `MediaBunnyEncoder.ts`.
  - [x] Move `ApngFormat` to `ApngEncoder.ts`.
  - [x] Move `GifFormat` to `GifEncoder.ts`.
- [x] **Registry & Discovery Refactoring**
  - [x] Remove `web/src/utils/encoders/Formats.ts`.
  - [x] Update `web/src/utils/discoverFormats.ts` to register formats explicitly.
  - [x] Remove resolution filtering from `discoverFormats`.
- [x] **Code Quality & Redundancy**
  - [x] Implement `BaseFormat` to provide sensible defaults for format metadata and support checks.
  - [x] Refactor `ApngFormat`, `GifFormat`, and `MediaBunnyFormat` to extend `BaseFormat`.
- [x] **Renderer Integration**
  - [x] Update `useRenderer.ts` to call `format.isSupported({ width, height })` and handle the error if not supported.
- [x] **Verification**
  - [x] Update unit tests to match the new discovery and registration flow.

- [x] **Documentation**
  - [x] Update `docs/ARCHITECTURE.md` to reflect the new registry-based architecture.

## 🧪 Verification Plan

- [x] Automated Test: `npm run test:unit -w web`.
- [x] Manual Test: Verify the format selector shows all formats initially, and rendering fails gracefully if a resolution is unsupported.

## 📝 Change Log

- 2026-06-08: Initial spec created.
- 2026-06-08: Redesigned to use a central Format Registry and Factory pattern for complete decoupling.
- 2026-06-08: Further decentralized by moving metadata to encoders and deferring support checks.
- 2026-06-08: Refactored to use `BaseFormat` abstract class and updated architecture documentation.
