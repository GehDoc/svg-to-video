# Spec: Add aPNG and Optimized GIF Export Support (Web Studio Only)

**GitHub Issue**: N/A
**Status**: 🟠 Pending (Addressing Bugs)

## 🎯 Objective

Add support for exporting animations to light alternative formats, specifically aPNG (Animated PNG) and GIF (both optimized opaque and transparent GIF89a), strictly within the Web Studio application, ensuring they are correctly categorized in the UI with transparency support status.

## 🛠 Technical Strategy

- **Core Technologies**: WebCodecs, Canvas API (for rendering)
- **Architecture**:
  - **Format Discovery**: Extend `AVAILABLE_FORMATS` in `web/src/utils/discoverFormats.ts` with stubs for `apng`, `gif` (opaque), and `gif-transparent` (GIF89a). (Done)
  - **Encoder Backbone**: Implement a collector that captures raw `ImageBitmap` frames from the renderer.
  - **aPNG Encoding**: Use `upng-js` to encode the collected frames into an Animated PNG. (Done)
  - **GIF Encoding**: Use `gif.js` or `omggif`. For transparent GIFs (GIF89a), implement a palette-based approach where the "transparent" background color is mapped to the GIF transparent index. (Done using `gif.js.optimized`)
  - **Renderer Branching**: Modify `web/src/hooks/useRenderer.ts` to detect these special formats and use a custom rendering loop. (Done)
- **Key Dependencies**:
  - `upng-js`
  - `gif.js.optimized`

## ✅ Task List

- [x] **Infrastructure & Types (Web Studio)**
  - [x] Define `aPNG` and `GIF` (opaque) formats in `web/src/utils/discoverFormats.ts`.
  - [x] Add `GIF (Transparent)` format to `web/src/utils/discoverFormats.ts` with `supportsAlpha: true`.
  - [x] Update `VideoFormat` type in `web/src/utils/discoverFormats.ts` to reflect transparency capabilities.
- [x] **Encoder Implementation**
  - [x] Implement `ApngEncoder` using `UPNG.js`.
  - [x] Implement `GifEncoder` supporting both opaque and transparent (GIF89a) modes.
- [x] **Web Studio Integration**
  - [x] Update `useRenderer.ts` to support "Collector" based rendering.
  - [x] Ensure the selected background color is correctly passed to the GIF encoder for transparency mapping.
- [x] **Testing**
  - [x] Update `web/src/utils/discoverFormats.test.ts` to verify discovery.
  - [x] Add unit tests for transparency handling in GIF89a.
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
  - [x] Update README.md to include aPNG and GIF support.
  - [x] Update `web/src/app/layout.tsx` metadata and JSON-LD.
  - [x] Update `web/src/components/SeoFallback.tsx` description.

- [ ] **Bug Fixes & Refinements**
  - [x] **Previewer Bug**: Use `<img>` tag instead of `<video>` for aPNG and GIF in `SuccessView`.
  - [x] **Previewer Test**: Add unit test in `SuccessView.test.tsx` to verify `<img>` tag rendering.
  - [ ] **aPNG Transparency Bug**: Investigate and fix why aPNG transparency is not preserved.
  - [ ] **UI Logic Refinement**: Introduce a `needsColorKeying` property to `VideoFormat`. Allow background color selection even when "Transparent Background" is checked if the format has `needsColorKeying: true`.

## 🧪 Verification Plan

- [x] Manual Test: Run the Web Studio, select aPNG/GIF format, export a sample animation, verify result.
- [x] Automated Test: `npm run test` in `web/` directory.

## 📝 Change Log

- 2026-05-30: Initial spec created.
- 2026-05-30: CORRECTIVE UPDATE - Reverting status to Pending as implementation was only stubbed. Branch `feat/add-apng-gif-export` created.
- 2026-05-30: Full implementation of aPNG and GIF (opaque/transparent) encoders.
- 2026-05-30: Fixed format discovery and added comprehensive E2E and unit tests.
- 2026-05-30: Updated documentation and SEO.
- 2026-05-30: RE-OPENED - Identified bugs in previewer and transparency handling.
- 2026-05-30: Verified previewer bug fix with unit tests.
