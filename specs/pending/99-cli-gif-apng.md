# Spec: 99 - CLI Animated Image Output Support (GIF & aPNG)

**GitHub Issue**: [#99](https://github.com/GehDoc/svg-to-video/issues/99)
**Status**: 🟠 Pending (Phase 2 CLI Refactoring)

## 🎯 Objective

Extend the CLI tool (`svg-to-video`) to support exporting animated image formats (GIF and aPNG) with palette optimization, transparency support, and metadata tag embedding, matching feature parity with video outputs (MP4, WebM, MKV, MOV). Refactor metadata injection helpers to share pure JS Web API implementations across Web Studio and CLI environments. Modularize CLI FFmpeg format generation into decoupled format generator classes managed by a central format registry.

## 🛠 Technical Strategy

- **Core Technologies**: Node.js, FFmpeg (`fluent-ffmpeg` / FFmpeg CLI pipeline), Puppeteer / Chromium frame scraping, Web Standard APIs (`Uint8Array`, `TextEncoder`, `DataView`).
- **Architecture**: Headless CLI tool (`src/index.ts` / CLI module), Shared Metadata Injectors (`shared/crc32.ts`, `shared/gifMetadataInjector.ts`, `shared/apngMetadataInjector.ts`), CLI Format Generators Registry (`src/formats/`).
- **Key Dependencies**: `ffmpeg`, `commander` / CLI parser.

### Exact CLI Options & Accepted Values:

1. **New Option: `--format <format>`**
   - **Accepted Values**: `gif`, `apng`, `png` (alias for `apng`), `mp4`, `webm`, `mkv`, `mov`
   - **Default Behavior**: If omitted, defaults to `webm` (when `--transparent` flag is present) or `mp4` (otherwise).
   - **Output Filename**: Saved inside `<outDir>` as `<inputBasename>.<format>` (e.g., `input.svg` exported with `--format gif` to `./outDir` becomes `./outDir/input.gif`).

2. **Enhanced Existing Options**:
   - `--transparent`: Now supported for `gif` and `apng`/`png` formats (applies alpha channel / palette transparency in FFmpeg) as well as `webm`.
   - `--metadata <items...>`: Supported for `gif` and `apng`/`png` outputs (injecting `title`, `comment`, and software generator metadata via FFmpeg).

### Core Implementation Strategy:

1. **Format Detection & Argument Parsing**:
   - Update `RunOptions` interface and `commander` setup in `src/index.ts` to include `--format` option.
   - Set output filename in `<outDir>` to `<inputBasename>.<format>`.
2. **Phase 1: Mutualized Metadata Injectors (`shared/`)**:
   - Move pure JS CRC32 calculator to `shared/crc32.ts`.
   - Create `shared/gifMetadataInjector.ts` (and `shared/gifMetadataInjector.test.ts`) exporting `injectGifMetadata`.
   - Create `shared/apngMetadataInjector.ts` (and `shared/apngMetadataInjector.test.ts`) exporting `injectApngMetadata`.
   - Ensure all `import` statements in `GifEncoder.ts` and `ApngEncoder.ts` are located strictly at the top of files.
   - Update `web/src/utils/encoders/GifEncoder.ts` and `ApngEncoder.ts` to import from `shared/gifMetadataInjector.js` and `shared/apngMetadataInjector.js`.
   - Update `src/index.ts` (CLI) to import from `shared/gifMetadataInjector.js` and `shared/apngMetadataInjector.js`.
3. **Phase 2: Modularized CLI Format Generators (`src/formats/`)**:
   - Define `CLIFormatGenerator` interface and `CLIFormatOptions` in `src/formats/types.ts`.
   - Implement generator classes in `src/formats/generators/`:
     - `GifFormatGenerator.ts`
     - `ApngFormatGenerator.ts`
     - `Mp4FormatGenerator.ts`
     - `WebmFormatGenerator.ts`
     - `MkvFormatGenerator.ts`
     - `MovFormatGenerator.ts`
   - Implement format registry `src/formats/registry.ts` with `getFormatGenerator(nameOrExtension)` lookup.
   - Refactor `convertToOutput` in `src/index.ts` to delegate argument building and post-processing to the registry.
4. **Integration Testing**:
   - Add test cases in `tests/cli.spec.ts` for GIF and aPNG output generation using `--format gif`, `--format apng`, `--transparent`, and `--metadata`.

## ✅ Task List

- [x] **Infrastructure & CLI Arguments**
  - [x] Update file extension detection and CLI format parameters to include `gif`, `apng`, `png`.
- [x] **Core Logic & FFmpeg Pipeline**
  - [x] Implement palette-optimized GIF encoding pipeline in `src/` FFmpeg integration.
  - [x] Implement aPNG encoding pipeline in `src/` FFmpeg integration.
  - [x] Support `--transparent` flag for GIF and aPNG CLI outputs.
  - [x] Wire `--metadata` parameters (`title`, `comment`) into GIF and aPNG export pipelines.
- [x] **Phase 1: Code Mutualization (`shared/`)**
  - [x] Move universal CRC32 implementation to `shared/crc32.ts`.
  - [x] Split metadata injectors into `shared/gifMetadataInjector.ts` and `shared/apngMetadataInjector.ts`.
  - [x] Split injector unit tests into `shared/gifMetadataInjector.test.ts` and `shared/apngMetadataInjector.test.ts`.
  - [x] Move all `import` statements to the top of `GifEncoder.ts` and `ApngEncoder.ts`.
  - [x] Update `web/src/utils/encoders/GifEncoder.ts` and `ApngEncoder.ts` to use shared injectors.
  - [x] Update `src/index.ts` CLI output post-processing to use shared injectors.
- [ ] **Phase 2: CLI Format Modularization (`src/formats/`)**
  - [ ] Define `CLIFormatGenerator` & `CLIFormatOptions` interfaces in `src/formats/types.ts`.
  - [ ] Implement format generators (`GifFormatGenerator`, `ApngFormatGenerator`, `Mp4FormatGenerator`, `WebmFormatGenerator`, `MkvFormatGenerator`, `MovFormatGenerator`).
  - [ ] Implement `CLIFormatRegistry` in `src/formats/registry.ts`.
  - [ ] Refactor `convertToOutput` in `src/index.ts` to use format registry.
  - [ ] Add unit test suite in `src/formats/registry.test.ts`.
- [x] **Testing**
  - [x] Add integration test coverage for GIF and aPNG exports in `tests/cli.spec.ts`.
- [x] **Documentation & SEO**
  - [x] Update `README.md` (CLI features, usage instructions for GIF and aPNG)
  - [x] Update `docs/CLI.md` (CLI format descriptions and flags)
  - [x] Update `docs/ARCHITECTURE.md` (if CLI pipeline architectural details change)
  - [x] Update SEO keywords & JSON-LD in `web/src/app/layout.tsx`
  - [x] Update static fallback description in `web/src/components/SeoFallback.tsx`
  - [x] Update `package.json` keywords

## 🧪 Verification Plan

- [x] Manual Test: Run CLI export commands generating `.gif` and `.apng` files with `--transparent` and `--metadata` parameters.
- [x] Automated Test: Execute test suite via `npm test` or `npx vitest` / `npx playwright test` to verify `tests/cli.spec.ts`.

## 📝 Change Log

- 2026-08-26: Initial spec created by AI agent for Issue #99.
- 2026-09-02: Added Phase 1 Code Mutualization strategy for shared metadata injectors.
- 2026-09-02: Refined Phase 1 per review feedback (split into gifMetadataInjector / apngMetadataInjector, top-level imports).
- 2026-09-02: Added Phase 2 CLI Format Generators Modularization strategy & task list.
