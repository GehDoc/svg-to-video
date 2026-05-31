# Spec: Add aPNG and Optimized GIF Export Support (Web Studio Only)

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Add support for exporting animations to light alternative formats, specifically aPNG (Animated PNG) and GIF (both optimized opaque and transparent GIF89a), strictly within the Web Studio application, ensuring they are correctly categorized in the UI with transparency support status.

## 🛠 Technical Strategy

- **Core Technologies**: WebCodecs, Canvas API (for rendering)
- **Architecture**:
  - **Format Discovery**: Extend `AVAILABLE_FORMATS` in `web/src/utils/discoverFormats.ts` with stubs for `apng`, `gif` (opaque), and `gif-transparent` (GIF89a).
  - **Encoder Backbone**: Implement a collector that captures raw `ImageBitmap` frames from the renderer.
  - **aPNG Encoding**: Use `upng-js` to encode the collected frames into an Animated PNG.
  - **GIF Encoding**: Use `gif.js` or `omggif`. For transparent GIFs (GIF89a), implement a palette-based approach where the "transparent" background color is mapped to the GIF transparent index.
  - **Renderer Branching**: Modify `web/src/hooks/useRenderer.ts` to detect these special formats and use a custom rendering loop.
- **Key Dependencies**:
  - `upng-js`
  - `gif.js` or `omggif`

## ✅ Task List

- [ ] **Infrastructure & Types (Web Studio)**
  - [x] Define `aPNG` and `GIF` (opaque) formats in `web/src/utils/discoverFormats.ts`.
  - [ ] Add `GIF (Transparent)` format to `web/src/utils/discoverFormats.ts` with `supportsAlpha: true`.
  - [x] Update `VideoFormat` type in `web/src/utils/discoverFormats.ts` to reflect transparency capabilities.
- [ ] **Encoder Implementation**
  - [ ] Implement `ApngEncoder` using `UPNG.js`.
  - [ ] Implement `GifEncoder` supporting both opaque and transparent (GIF89a) modes.
- [ ] **Web Studio Integration**
  - [ ] Update `useRenderer.ts` to support "Collector" based rendering.
  - [ ] Ensure the selected background color is correctly passed to the GIF encoder for transparency mapping.
- [ ] **Testing**
  - [x] Update `web/src/utils/discoverFormats.test.ts` to verify discovery.
  - [ ] Add unit tests for transparency handling in GIF89a.

## 🧪 Verification Plan

- [ ] Manual Test: Run the Web Studio, select aPNG/GIF format, export a sample animation, verify result.
- [ ] Automated Test: `npm run test` in `web/` directory.

## 📝 Change Log

- 2026-05-30: Initial spec created.
- 2026-05-30: CORRECTIVE UPDATE - Reverting status to Pending as implementation was only stubbed. Branch `feat/add-apng-gif-export` created.
