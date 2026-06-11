# Spec: UI/UX Fixes and Metadata Testing

**Status**: 🟠 Pending

## 🎯 Objective

Improve UI robustness by validating numeric inputs, exposing renderer errors earlier, ensuring metadata integrity across all formats via automated tests, refining demo animations, and fixing a transparent GIF recording bug.

## 🛠 Technical Strategy

- **UI Validation**: Use `number` input types with proper `min`/`max` and handle empty/invalid states in `ConfigPanel.tsx`.
- **Error Handling**: Implement a validation check in `Studio.tsx` or `useRenderer` to detect unsupported formats/resolutions before the user clicks Export.
- **Testing**: Refactor E2E helpers to provide a generic "render and verify" pipeline. Create `metadata-integrity.spec.ts`.
- **Demo Animation**: Optimize `driver.js` transitions in `demo.spec.ts` to ensure smooth morphing between highlighted elements by avoiding unnecessary `destroy()` calls or using `move()`.
- **GIF Bug**: Investigate color keying and palette generation in `GifEncoder.ts` to prevent "Transparent color not found" errors when a specific background color is used.
- **Documentation**: Update `docs/CLI.md` or `docs/ARCHITECTURE.md` if any technical changes warrant it.

## ✅ Task List

- [x] **UI Robustness**
  - [x] Prevent empty/NaN values for duration, hold, and fps in `ConfigPanel.tsx`.
  - [x] Ensure input fields are strictly numeric and provide sensible fallbacks.
- [x] **Error Handling**
  - [x] Expose format/resolution support errors to the UI earlier.
  - [x] Disable the Export button or show a warning if the current configuration is invalid.
- [x] **Metadata & Transparency Testing**
  - [x] Refactor `web/tests/rendering-transparency.spec.ts` to extract common E2E infrastructure.
  - [x] Create `web/tests/metadata-integrity.spec.ts` to verify metadata support for all formats.
- [ ] **Demo Enhancements**
  - [ ] Update `demo.spec.ts` to morph the highlight zone between elements instead of resetting it.
- [ ] **Bug Fix: Transparent GIF**
  - [ ] Fix "Transparent color not found in palette" error in `GifEncoder.ts`.
  - [ ] (Waiting for user repro) Verify fix with provided SVG and background color.
- [ ] **Documentation**
  - [ ] Update documentation to reflect any user-facing changes or new testing procedures.
  - [ ] Create a follow-up ticket/issue to add metadata support for aPNG and GIF formats.

## 🧪 Verification Plan

- [ ] Manual Test: Verify ConfigPanel inputs handle deletion and invalid characters gracefully.
- [ ] Manual Test: Select an unsupported resolution and verify early warning/button disabling.
- [ ] Automated Test: `npm run test:web -- tests/metadata-integrity.spec.ts`
- [ ] Automated Test: `npm run test:web -- tests/rendering-transparency.spec.ts` (verify no regressions).
- [ ] Automated Test: `npm run test:demo` and visually inspect the transitions in the recorded video.

## 📝 Change Log

- 2026-06-10: Initial spec created by Gemini CLI.
