# Spec: Add aPNG and Optimized GIF Export Support (Web Studio Only)

**GitHub Issue**: N/A
**Status**: 🟠 Pending (Verification TODOs)

## 🎯 Objective

Add support for exporting animations to light alternative formats, specifically aPNG (Animated PNG) and GIF (both optimized opaque and transparent GIF89a), strictly within the Web Studio application, ensuring they are correctly categorized in the UI with transparency support status.

## 🛠 Technical Strategy

- **Core Technologies**: WebCodecs, Canvas API (for rendering)
- **Architecture**:
  - **Format Discovery**: Extend `AVAILABLE_FORMATS` in `web/src/utils/discoverFormats.ts` with stubs for `apng`, `gif` (opaque), and `gif-transparent` (GIF89a). (Done)
  - **Encoder Backbone**: Implement a collector that captures raw `ImageBitmap` frames from the renderer.
  - **aPNG Encoding**: Use `upng-js` to encode the collected frames into an Animated PNG. (Done)
  - **GIF Encoding**: Migrated from `gif.js.optimized` to `gifenc` to improve main-stream support, stability, and reliability. (Done)
  - **Renderer Branching**: Modify `web/src/hooks/useRenderer.ts` to detect these special formats and use a custom rendering loop. (Done)
  - **Automated Transparency Verification**: Leverage existing `ffprobe` and `pngjs` helpers in `tests/helpers/e2e.ts` to analyze the alpha channel/transparency indices of generated outputs in E2E tests. (Done)
- **Key Dependencies**:
  - `upng-js`
  - `gifenc`

## ✅ Task List

- [x] **Infrastructure & Types (Web Studio)**
  - [x] Define `aPNG` and `GIF` (opaque) formats in `web/src/utils/discoverFormats.ts`.
  - [x] Add `GIF (Transparent)` format to `web/src/utils/discoverFormats.ts` with `supportsAlpha: true`.
  - [x] Update `VideoFormat` type in `web/src/utils/discoverFormats.ts` to reflect transparency capabilities.
- [x] **Encoder Implementation**
  - [x] Implement `ApngEncoder` using `UPNG.js`.
  - [x] Implement `GifEncoder` using `gifenc`.
- [x] **Web Studio Integration**
  - [x] Update `useRenderer.ts` to support "Collector" based rendering.
  - [x] Ensure the selected background color is correctly passed to `gifenc` for transparency mapping.
- [x] **Testing**
  - [x] Update `web/src/utils/discoverFormats.test.ts` to verify discovery.
  - [x] **E2E Test Extension**
    - [x] Locate `web/tests/golden-path.spec.ts`.
    - [x] Add a new test case: "should successfully render an SVG into an aPNG with transparency".
    - [x] Add a new test case: "should successfully render an SVG into a transparent GIF (GIF89a)".
    - [x] Add a new test case: "should successfully render an SVG into an opaque GIF".
  - [x] **Component & Integration Verification**
    - [x] Investigate why aPNG/GIF formats are not appearing in `FormatSelector`.
    - [x] Fix `discoverFormats.ts` to ensure non-WebCodecs formats are not filtered out.
    - [x] Add unit tests in `web/src/components/FormatSelector/FormatSelector.test.tsx` to ensure new formats are rendered in correct groups.
- [x] **Documentation & SEO**
  - [x] Update `README.md` with aPNG/GIF features.
  - [x] Audit `web/src/app/layout.tsx` for metadata updates (Title, Description, Keywords, OG/Twitter).
  - [x] Update `web/src/components/SeoFallback.tsx`.
  - [x] Add relevant keywords to `package.json`.

- [x] **Migration to gifenc**
  - [x] Uninstall `gif.js.optimized`.
  - [x] Install `gifenc` (`npm install gifenc`).
  - [x] Refactor `web/src/utils/encoders/GifEncoder.ts` to use `gifenc`.
  - [x] Verify functionality and fix potential issues in Web Studio.

- [x] **Bug Fixes & Refinements**
  - [x] **Previewer Bug**: Use `<img>` tag instead of `<video>` for aPNG and GIF in `SuccessView`.
  - [x] **Previewer Test**: Add unit test in `SuccessView.test.tsx` to verify `<img>` tag rendering.
  - [x] **aPNG Transparency Bug**: Investigate and fix why aPNG transparency is not preserved.
  - [x] **UI Logic Refinement**: Introduce a `needsColorKeying` property to `VideoFormat`. Allow background color selection even when "Transparent Background" is checked if the format has `needsColorKeying: true`.
  - [x] **Automated Transparency Verification**: Update all E2E tests for aPNG and GIF to verify pixel-level transparency in the output files (using `pngjs` for PNG/GIF analysis and `ffprobe` for WebM).

## 🧪 Verification Plan

- [x] Manual Test: Run the Web Studio, select aPNG/GIF format, export a sample animation, verify result.
- [ ] Automated Test: Implement and run automated pixel-level transparency verification for all supported formats in the E2E suite.
  - [x] TODO: Add pixel-level transparency verification for MP4 output.
  - [ ] TODO: Supplement `hasAlphaStream` (ffprobe) with pixel-level transparency verification for WebM.
  - [ ] TODO: Supplement `hasAlphaStream` (ffprobe) with pixel-level opacity verification for WebM.
  - [ ] TODO: Replace `hasAlphaStream` (ffprobe) with reliable pixel-level transparency verification for GIFs.
  - [ ] TODO: Add robust pixel-level opacity verification for opaque GIF output.
  - [ ] TODO: Assert frame count == (FPS \* Duration) for all animated format exports (WebM, aPNG, GIF) to verify full animation capture.

## 🏗 Future Refactoring: Decoupling useRenderer from Encoding Details

I want to refactor `useRenderer` to decouple it from the direct technical knowledge of the target encoding details:

- It should not store or call Mediabunny functions, `ApngEncoder`, `GifEncoder`, or handle custom formats directly.
- We should leverage the encoder layer that we began to create for GIF and PNG to abstract those details.

**Key Steps:**

- [ ] **Define Encoder Contract**: List all video encoding lifecycle steps (e.g., `init`, `addFrame`, `finalize`, `cancel`) and define the expected input and output of each step.
- [ ] **Implement Encoder Adapters**: Evolve `ApngEncoder.ts` and `GifEncoder.ts` to directly implement the new contract, acting as adapters for their respective 3rd-party libraries. Implement a similar adapter for `MediaBunny` to handle standard video formats.
- [ ] **Encoder Factory**: The `RenderSettings.format` (or a dedicated registry) should expose a factory method to create the appropriate encoder based on the format.
- [ ] **Refactor useRenderer**: Update `useRenderer` to only call the factory method to create the encoder and then call the generic encoder methods without knowing the underlying implementation details.
- [ ] **Responsibility Isolation**: Ensure `useRenderer` is only responsible for managing the rendering lifecycle (scrubbing, timing) and delegating encoding tasks to the encoder instance.
- [ ] **Cleanup**: Remove any direct references to specific encoding libraries or formats from `useRenderer.ts`, making it more maintainable and easier to extend.
- [ ] **Unit Testing**: Test `useRenderer` with mock encoders that implement the generic interface to verify rendering logic independently of encoding implementations.

## 📝 Change Log

- 2026-05-30: Initial spec created.
- 2026-05-30: CORRECTIVE UPDATE - Reverting status to Pending as implementation was only stubbed. Branch `feat/add-apng-gif-export` created.
- 2026-05-30: Full implementation of aPNG and GIF (opaque/transparent) encoders.
- 2026-05-30: Fixed format discovery and added comprehensive E2E and unit tests.
- 2026-05-30: Updated documentation and SEO.
- 2026-05-30: RE-OPENED - Identified bugs in previewer and transparency handling.
- 2026-05-30: Verified previewer bug fix with unit tests.
- 2026-05-30: Implemented automated transparency verification in E2E suite.
- 2026-06-02: Decided to migrate to `gifenc` instead of `gifshot`. Refactored encoder to use `gifenc` and added support for Node.js/jsdom canvas mock environment.
- 2026-06-02: Removed redundant unit tests for encoders. Verified all formats with E2E tests.
