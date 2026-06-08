# Spec: Refactor Encoder Coupling

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Refactor the format discovery mechanism and `useRenderer.ts` to decouple them from direct knowledge of concrete `OutputFormat` classes, promoting a cleaner, factory-based architecture.

## 🛠 Technical Strategy

- **Architectural Change**:
  - Remove `OutputFormatClass` from `VideoFormat` interface in `web/src/utils/discoverFormats.ts`.
  - Introduce an `EncoderFactory` interface that `useRenderer` will use to obtain an `Encoder` instance.
  - Each `VideoFormat` will be associated with its own `EncoderFactory` instance.
  - The `Encoder` implementation will encapsulate configuration (output format, hooks, etc.) previously held in `VideoFormat` or managed directly by `useRenderer`.

- **Dependencies**: Mediabunny (internal)

## ✅ Task List

- [ ] **Core Logic**
  - [ ] Define `EncoderFactory` interface.
  - [ ] Update `VideoFormat` interface and `AVAILABLE_FORMATS` in `web/src/utils/discoverFormats.ts` to use `EncoderFactory` instead of `OutputFormatClass`.
  - [ ] Update `discoverFormats` to work with the new factory-based setup.
- [ ] **Renderer Integration**
  - [ ] Update `useRenderer.ts` to use `EncoderFactory` to initialize the encoder.
  - [ ] Update existing encoder implementations if necessary to support the new contract.
- [ ] **Verification**
  - [ ] Update unit tests for `discoverFormats`.
  - [ ] Update unit tests for `useRenderer`.

## 🧪 Verification Plan

- [ ] Run `npm run test` in `web/` to ensure no regressions in format discovery and rendering.
- [ ] Manual test: Verify that rendering works correctly for all formats (MP4, WebM, GIF, etc.) through the UI.

## 📝 Change Log

- 2026-06-08: Initial spec created.
