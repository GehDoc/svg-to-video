# Spec: 99 - CLI Animated Image Output Support (GIF & aPNG)

**GitHub Issue**: [#99](https://github.com/GehDoc/svg-to-video/issues/99)
**Status**: 🟢 Completed

## 🎯 Objective

Extend the CLI tool (`svg-to-video`) to support exporting animated image formats (GIF and aPNG) with palette optimization, transparency support, and metadata tag embedding, matching feature parity with video outputs (MP4, WebM, MKV, MOV).

## 🛠 Technical Strategy

- **Core Technologies**: Node.js, FFmpeg (`fluent-ffmpeg` / FFmpeg CLI pipeline), Puppeteer / Chromium frame scraping.
- **Architecture**: Headless CLI tool (`src/index.ts` / CLI module).
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
2. **FFmpeg GIF Pipeline**:
   - Implement complex filter graph using `palettegen` and `paletteuse` for high-quality palette-optimized GIFs (`-filter_complex "[0:v] palettegen=reserve_transparent=1 [p]; [0:v][p] paletteuse"` when transparent).
3. **FFmpeg aPNG Pipeline**:
   - Configure FFmpeg aPNG output (`-f apng`, `-plays 0` for infinite looping).
4. **Metadata & Transparency**:
   - Wire metadata parameters (`title`, `comment`) and background transparency flags into GIF and aPNG FFmpeg invocations.
5. **Integration Testing**:
   - Add test cases in `tests/cli.spec.ts` for GIF and aPNG output generation using `--format gif`, `--format apng`, `--transparent`, and `--metadata`.

## ✅ Task List

- [x] **Infrastructure & CLI Arguments**
  - [x] Update file extension detection and CLI format parameters to include `gif`, `apng`, `png`.
- [x] **Core Logic & FFmpeg Pipeline**
  - [x] Implement palette-optimized GIF encoding pipeline in `src/` FFmpeg integration.
  - [x] Implement aPNG encoding pipeline in `src/` FFmpeg integration.
  - [x] Support `--transparent` flag for GIF and aPNG CLI outputs.
  - [x] Wire `--metadata` parameters (`title`, `comment`) into GIF and aPNG export pipelines.
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
