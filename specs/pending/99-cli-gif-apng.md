# Spec: 99 - CLI Animated Image Output Support (GIF & aPNG)

**GitHub Issue**: [#99](https://github.com/GehDoc/svg-to-video/issues/99)
**Status**: 🟠 Pending

## 🎯 Objective

Extend the CLI tool (`svg-to-video`) to support exporting animated image formats (GIF and aPNG) with palette optimization, transparency support, and metadata tag embedding, matching feature parity with video outputs (MP4, WebM, MKV, MOV).

## 🛠 Technical Strategy

- **Core Technologies**: Node.js, FFmpeg (`fluent-ffmpeg` / FFmpeg CLI pipeline), Puppeteer / Chromium frame scraping.
- **Architecture**: Headless CLI tool (`src/index.ts` / CLI module).
- **Key Dependencies**: `ffmpeg`, `commander` / CLI parser.

### Core Changes:

1. **Format Detection & Argument Parsing**:
   - Update file extension parsing and CLI options in `src/index.ts` (and related CLI utilities) to support `.gif`, `.apng`, and `.png` (when specified for animated PNG).
2. **FFmpeg GIF Pipeline**:
   - Implement complex filter graphs for palette generation (`palettegen`) and application (`paletteuse`) to generate high-quality GIFs.
   - Respect `--transparent` / background options for GIF alpha transparency / palette handling.
3. **FFmpeg aPNG Pipeline**:
   - Configure FFmpeg output options for aPNG format (`-f apng` or `.apng`/`.png` target).
   - Preserve alpha channel when `--transparent` is supplied.
4. **Metadata Embedding**:
   - Ensure metadata arguments (`--metadata title="..." comment="..."` or custom tags) are properly mapped to FFmpeg format metadata parameters for GIF and aPNG.
5. **Integration Testing**:
   - Add comprehensive tests in `tests/cli.spec.ts` validating GIF and aPNG export commands, transparency options, and output file existence/validity.

## ✅ Task List

- [ ] **Infrastructure & CLI Arguments**
  - [ ] Update file extension detection and CLI format parameters to include `gif`, `apng`, `png`.
- [ ] **Core Logic & FFmpeg Pipeline**
  - [ ] Implement palette-optimized GIF encoding pipeline in `src/` FFmpeg integration.
  - [ ] Implement aPNG encoding pipeline in `src/` FFmpeg integration.
  - [ ] Support `--transparent` flag for GIF and aPNG CLI outputs.
  - [ ] Wire `--metadata` parameters (`title`, `comment`) into GIF and aPNG export pipelines.
- [ ] **Testing**
  - [ ] Add integration test coverage for GIF and aPNG exports in `tests/cli.spec.ts`.
- [ ] **Documentation & SEO**
  - [ ] Update `README.md` (CLI features, usage instructions for GIF and aPNG)
  - [ ] Update `docs/CLI.md` (CLI format descriptions and flags)
  - [ ] Update `docs/ARCHITECTURE.md` (if CLI pipeline architectural details change)
  - [ ] Update SEO keywords & JSON-LD in `web/src/app/layout.tsx`
  - [ ] Update static fallback description in `web/src/components/SeoFallback.tsx`
  - [ ] Update `package.json` keywords

## 🧪 Verification Plan

- [ ] Manual Test: Run CLI export commands generating `.gif` and `.apng` files with `--transparent` and `--metadata` parameters.
- [ ] Automated Test: Execute test suite via `npm test` or `npx vitest` / `npx playwright test` to verify `tests/cli.spec.ts`.

## 📝 Change Log

- 2026-08-26: Initial spec created by AI agent for Issue #99.
