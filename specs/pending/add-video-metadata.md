# Spec: add-video-metadata

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Enable the injection of custom metadata into generated MP4 files to support attribution and user-defined information, implemented consistently across both the web studio and the CLI tool, with mandatory E2E verification.

## 🛠 Technical Strategy

- **Core Technologies**: WebCodecs (Web), FFmpeg (CLI), container metadata headers.
- **Architecture**:
  - **Shared**: Define a standard metadata schema in `shared/types.ts`.
  - **Web**: Extend `useRenderer` to include metadata in the final muxing phase. Utilize mediabunny's format/codec querying to discover metadata capabilities for MP4, WEBM, and MKV.
  - **CLI**: Update the `src/` rendering pipeline to pass metadata to the FFmpeg process.
- **Attribution**: Automatically include "Converted from SVG with https://gehdoc.github.io/svg-to-video/" as a mandatory default field.
- **User Customization**:
  - **Web**: Add a UI input in the Studio settings.
  - **CLI**: Introduce a new flag (e.g., `--metadata "key=value"`).

## ✅ Task List

- [ ] **Research**
  - [ ] Define standard metadata keys.
  - [ ] Investigate FFmpeg metadata flag syntax for MP4/WEBM.
  - [ ] Research `mediabunny` API to query format-specific metadata support.
- [ ] **Infrastructure & Shared**
  - [ ] Update `shared/types.ts` to include `VideoMetadata` interface.
- [ ] **Web Studio**
  - [ ] Implement metadata capability discovery using mediabunny.
  - [ ] Update rendering hooks to process `VideoMetadata`.
  - [ ] Add metadata UI inputs to `web/src/components/Studio.tsx`.
- [ ] **CLI Implementation**
  - [ ] Research npm library to query FFmpeg for format-specific metadata capabilities (to avoid hardcoding).
  - [ ] Update `src/index.ts` to parse metadata arguments.
  - [ ] Update renderer to apply metadata during file creation using queried capabilities.
- [ ] **Verification**
  - [ ] Implement E2E tests for Web Studio metadata.
  - [ ] Implement E2E tests for CLI metadata.

## 🧪 Verification Plan

- [ ] **Unit Testing**: Add tests to `shared/` and `web/` components.
- [ ] **E2E Testing (CLI)**: Add integration test case in `tests/cli.spec.ts` using `ffprobe` to validate metadata tags in generated files.
- [ ] **E2E Testing (Web)**: Add test case in `web/tests/golden-path.spec.ts` (or equivalent) to simulate user metadata input and verify output file properties.

## 📝 Change Log

- 2026-05-16: Initial spec created.
- 2026-05-16: Scope expanded to include CLI and E2E verification requirements.
