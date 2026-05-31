# Spec: Add aPNG and Optimized GIF Export Support (Web Studio Only)

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Add support for exporting animations to light alternative formats, specifically aPNG (Animated PNG) and optimized GIF, strictly within the Web Studio application, ensuring they are correctly categorized in the UI with transparency support status.

## 🛠 Technical Strategy

- **Core Technologies**: WebCodecs, Canvas API (for rendering)
- **Architecture**:
  - **Format Discovery**: Extend `AVAILABLE_FORMATS` in `web/src/utils/discoverFormats.ts` with stubs that satisfy `Mediabunny.OutputFormat`. (Done)
  - **Encoder Backbone**: Implement a collector that captures raw `ImageBitmap` frames from the renderer.
  - **aPNG Encoding**: Use `upng-js` to encode the collected frames into an Animated PNG.
  - **GIF Encoding**: Use `gif.js` or `omggif` to encode frames into an optimized GIF.
  - **Renderer Branching**: Modify `web/src/hooks/useRenderer.ts` to detect these special formats and use a custom rendering loop that skips `Mediabunny.Output` and instead feeds frames to the collector.
- **Key Dependencies**:
  - `upng-js`
  - `gif.js` or `omggif`

## ✅ Task List

- [ ] **Infrastructure & Types (Web Studio)**
  - [x] Define `aPNG` and `GIF` formats in `web/src/utils/discoverFormats.ts`.
  - [x] Update `VideoFormat` type in `web/src/utils/discoverFormats.ts` to reflect transparency capabilities.
  - [ ] Refine `OutputFormat` stubs if necessary during integration.
- [ ] **Encoder Implementation**
  - [ ] Research and select the best GIF library for performance/size.
  - [ ] Implement `ApngEncoder` using `UPNG.js`.
  - [ ] Implement `GifEncoder` using the selected library.
- [ ] **Web Studio Integration**
  - [ ] Update `useRenderer.ts` to support "Collector" based rendering.
  - [ ] Implement the frame collection logic in `useRenderer.ts`.
  - [ ] Integrate encoders into the finalization step of `useRenderer.ts`.
- [ ] **Testing**
  - [x] Update `web/src/utils/discoverFormats.test.ts` to verify discovery. (Done)
  - [ ] Add unit tests for the new encoders.
  - [ ] Add an E2E test case for aPNG and GIF export.

## 🧪 Verification Plan

- [ ] Manual Test: Run the Web Studio, select aPNG/GIF format, export a sample animation, verify result.
- [ ] Automated Test: `npm run test` in `web/` directory.

## 📝 Change Log

- 2026-05-30: Initial spec created.
- 2026-05-30: CORRECTIVE UPDATE - Reverting status to Pending as implementation was only stubbed. Branch `feat/add-apng-gif-export` created.
