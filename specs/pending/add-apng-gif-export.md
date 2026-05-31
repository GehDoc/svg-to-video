# Spec: Add aPNG and Optimized GIF Export Support (Web Studio Only)

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Add support for exporting animations to light alternative formats, specifically aPNG (Animated PNG) and optimized GIF, strictly within the Web Studio application, ensuring they are correctly categorized in the UI with transparency support status.

## 🛠 Technical Strategy

- **Core Technologies**: WebCodecs, Canvas API (for rendering)
- **Architecture**:
  - Extend `VideoFormat` definition within `web/src/utils/discoverFormats.ts`.
  - Implement `ImageSequenceMuxer` (in `web/src/utils/ImageSequenceMuxer.ts`) to collect raw frames.
  - Integrate `UPNG.js` for aPNG encoding.
  - Integrate a GIF encoder (e.g., `gif.js` or `omggif`).
  - Modify `web/src/hooks/useRenderer.ts` to branch the rendering logic for these non-video-codec formats.
- **Key Dependencies**:
  - `upng-js`
  - `gif.js.optimized` (or similar)

## ✅ Task List

- [ ] **Infrastructure & Types (Web Studio)**
  - [x] Define `aPNG` and `GIF` formats in `web/src/utils/discoverFormats.ts` (Stubs added).
  - [x] Update `VideoFormat` type in `web/src/utils/discoverFormats.ts` to reflect transparency capabilities.
  - [ ] Implement robust `OutputFormat` classes for aPNG and GIF.
- [ ] **Encoder Implementation**
  - [ ] Integrate/Implement aPNG encoder using `UPNG.js`.
  - [ ] Integrate/Implement GIF encoder using a suitable library.
  - [x] Create `ImageSequenceMuxer` base class (Initial version created).
- [ ] **Web Studio Integration**
  - [ ] Modify `useRenderer.ts` to handle `ImageSequenceMuxer`-based formats.
  - [ ] Ensure `FormatSelector` handles the new formats correctly (already handles categorization by `supportsAlpha`).
- [ ] **Testing**
  - [ ] Create/Update `web/src/utils/discoverFormats.test.ts` to include new formats.
  - [ ] Add unit tests for `ImageSequenceMuxer` and specific encoders.
  - [ ] Verify export flow in E2E tests (`web/tests/`).

## 🧪 Verification Plan

- [ ] Manual Test: Run the Web Studio, select aPNG/GIF format, export a sample animation, verify result.
- [ ] Automated Test: `npm run test` in `web/` directory.

## 📝 Change Log

- 2026-05-30: Initial spec created.
- 2026-05-30: CORRECTIVE UPDATE - Reverting status to Pending as implementation was only stubbed. Branch `feat/add-apng-gif-export` created.
