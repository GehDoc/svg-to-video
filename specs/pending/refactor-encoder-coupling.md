# Spec: Refactor Encoder Coupling (Registry Pattern)

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Refactor the encoder discovery and creation system to use a centralized `FormatRegistry`. This ensures that format-specific knowledge is fully encapsulated within `VideoFormat` factory objects, and `useRenderer.ts` is decoupled from concrete encoder implementations.

## 🛠 Technical Strategy

- **`VideoFormat` as a Factory**: Enhance the `VideoFormat` interface to include metadata (`mimeType`, `extension`, `supportsAlpha`) and factory methods (`createEncoder`, `isSupported`).
- **`FormatRegistry`**: A central singleton to manage the list of available `VideoFormat` objects. It provides methods to discover supported formats and retrieve them by ID.
- **`VideoEncoder` Interface**: Generic contract for all encoders, including runtime hooks like `needsColorKeying` to keep the renderer logic agnostic.
- **Encapsulation**: - No direct knowledge of `Mediabunny`, `UPNG`, or `gifenc` in `useRenderer.ts` or `discoverFormats.ts`. - Knowledge of specific `OutputFormat` classes is moved into the `VideoFormat` implementations.
  **Status**: 🟢 Completed

...

## ✅ Task List

- [x] **Core Logic & Interfaces (`web/src/utils/encoders/types.ts`)**
  - [x] Update `VideoEncoder` interface with `needsColorKeying`.
  - [x] Define `VideoFormat` as a metadata + factory interface.
- [x] **Registry Implementation (`web/src/utils/encoders/Registry.ts`)**
  - [x] Create `FormatRegistry` to manage `VideoFormat` instances.
- [x] **Format Implementations (`web/src/utils/encoders/Formats.ts`)**
  - [x] Implement `Mp4Format`, `WebMFormat`, `ApngFormat`, `GifFormat`, etc.
  - [x] Register them in the central `FormatRegistry`.
- [x] **Integration**
  - [x] Refactor `web/src/utils/discoverFormats.ts` to delegate to `FormatRegistry`.
  - [x] Refactor `useRenderer.ts` to use `FormatRegistry` for encoder instantiation.
- [x] **Verification**
  - [x] Update and run unit tests for discovery and rendering.

- [ ] Automated Test: `npm run test` in `web/`.
- [ ] Manual Test: Verify all formats (MP4, WebM, APNG, GIF) render correctly with appropriate transparency support.

## 📝 Change Log

- 2026-06-08: Initial spec created.
- 2026-06-08: Redesigned to use a central Format Registry and Factory pattern for complete decoupling.
