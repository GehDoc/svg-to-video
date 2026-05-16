# Spec: add-video-metadata

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Enable the injection of custom metadata into generated MP4 files to support attribution and user-defined information, implemented consistently across both the web studio and the CLI tool, with mandatory E2E verification.

## 🛠 Technical Strategy

- **Core Technologies**: WebCodecs (Web), FFmpeg (CLI), container metadata headers.
- **Architecture**:
  - **Shared**: Define a standard metadata schema in `shared/types.ts` and a shared utility for metadata comment merging.
  - **Web**: Extend `useRenderer` to include metadata in the final muxing phase. Utilize mediabunny's format/codec querying.
  - **CLI**: Update the `src/` rendering pipeline to pass metadata to the FFmpeg process.
- **Attribution**: Standardized merge function applied in shared utility for "Converted from SVG with https://gehdoc.github.io/svg-to-video/".
- **User Customization**:
  - **Web**: Add a UI input in the Studio settings. Fields 'title' and 'comment' will be disabled if `mediabunny` indicates the selected format does not support them.
  - **CLI**: Introduce a new flag (e.g., `--metadata "key=value"`).

## ✅ Task List

- [x] **Research**
  - [x] Define standard metadata keys (title, comment).
  - [x] Investigate FFmpeg metadata flag syntax for MP4/WEBM.
  - [x] Research `mediabunny` API to query format-specific metadata support.
- [x] **Infrastructure & Shared**
  - [x] Update `shared/types.ts` to include `VideoMetadata` interface.
  - [x] Implement shared `mergeMetadataComments(userComment?: string): string` utility.
- [x] **Web Studio**
  - [x] Implement metadata capability discovery: check support for `title`/`comment` using `mediabunny` and propagate to UI state.
  - [x] Add metadata UI inputs to `web/src/components/Studio.tsx` and `web/src/components/ConfigPanel.tsx`.
  - [x] Update rendering hooks to process `VideoMetadata`.
- [x] **CLI Implementation**
  - [x] Research npm library to query FFmpeg for format-specific metadata capabilities.
  - [x] Update `src/index.ts` to parse metadata arguments.
  - [x] Rework `src/index.ts` to use shared comment merging utility.
- [x] **Verification**
  - [x] Implement E2E tests for Web Studio metadata (Playwright).
  - [x] Implement E2E tests for CLI metadata (ffprobe).

## 🧪 Verification Plan

- [x] **Unit Testing**: Add tests to `shared/` and `web/` components.
- [x] **E2E Testing (CLI)**: Integration test in `tests/cli.spec.ts` using `ffprobe` to validate metadata tags in generated files.
- [x] **E2E Testing (Web)**: Update `web/tests/golden-path.spec.ts` to simulate metadata input and use `ffprobe` (or a helper) to verify properties of the downloaded file.

## 📝 Change Log

- 2026-05-16: Initial spec created.
- 2026-05-16: Scope expanded to include CLI and E2E verification requirements.
