# Spec: 177 - Quality Control Parameters for Video and Animated Image Exports

**GitHub Issue**: [#177](https://github.com/GehDoc/svg-to-video/issues/177)
**Status**: 🔵 In Progress

## 🎯 Objective

Expose bitrate, CRF, and quality parameters across CLI flags and MCP tool schemas, forwarding them through FFmpeg format generators (MP4, WebM, MOV, MKV, GIF, aPNG) to give users and AI agents granular control over output file size and visual fidelity.

## 🛠 Technical Strategy

- **CLI Interface (`src/index.ts`)**:
  - Add `--bitrate <rate>` (e.g. `5M`, `2000k`) option.
  - Add `--crf <value>` (e.g. `18-28`, valid `0-63`) option.
  - Add `--quality <level>` (e.g. `1-100`) option for animated images and general compression control.
  - Thread options through `RunOptions` into `renderAndEncodeFrames`.
- **MCP Tool Schema (`src/mcp.ts`)**:
  - Add optional `bitrate`, `crf`, and `quality` properties to `render_svg_to_video` input schema.
  - Forward these arguments into the CLI invocation.
- **Format Options & Generators (`src/formats/`)**:
  - Extend `CLIFormatOptions` in `src/formats/types.ts` with `bitrate?: string`, `crf?: number`, `quality?: number`.
  - `Mp4FormatGenerator`:
    - If `options.crf !== undefined`, emit `-crf <crf>`.
    - If `options.bitrate` is provided, emit `-b:v <bitrate>`.
    - If neither is provided, default to `-crf 20`.
    - Avoid emitting default `-crf 20` when user explicitly requested `--bitrate` without `--crf` so `libx264` operates in target bitrate mode.
  - `WebmFormatGenerator`:
    - If `options.crf !== undefined`, emit `-crf <crf>` (and `-b:v 0` if `!options.bitrate` for VP9 constant quality).
    - If `options.bitrate` is provided, emit `-b:v <bitrate>`.
  - `MkvFormatGenerator`:
    - Transparent mode (VP9): follow VP9 crf/bitrate logic.
    - Non-transparent mode (libx264): follow libx264 crf/bitrate logic.
  - `MovFormatGenerator`:
    - Non-transparent mode (libx264): follow libx264 crf/bitrate logic.
  - `GifFormatGenerator`:
    - When `options.quality !== undefined`, map quality (1-100) to `max_colors` (16-256): `Math.max(16, Math.min(256, Math.round((options.quality / 100) * 256)))`.
    - Append `:max_colors=${colors}` to `palettegen`, preserving Bayer dithering in `paletteuse`.
  - `ApngFormatGenerator`:
    - When `options.quality !== undefined`, map quality (1-100) to zlib compression level (1-9): `Math.max(1, Math.min(9, Math.round((options.quality / 100) * 9)))`.
    - Pass `-compression_level <level>`.
- **Validation (`src/utils/validateOptions.ts`)**:
  - Enforce `crf` between 0 and 63.
  - Enforce `quality` between 1 and 100.
  - Enforce `bitrate` matches `/^\d+(\.\d+)?[kKmMgG]?$/`.
- **Documentation & Security**:
  - Audit `docs/SECURITY.md`: options are validated and passed as discrete spawn arguments (no shell injection risk).
  - Update `README.md`, `docs/CLI.md`, `docs/MCP.md`, and `docs/ARCHITECTURE.md`.

## ✅ Task List

- [ ] **Core Options & Types**
  - [ ] Extend `CLIFormatOptions` interface in `src/formats/types.ts`.
  - [ ] Add option validation logic in `src/utils/validateOptions.ts` and test cases in `src/utils/validateOptions.test.ts`.
- [ ] **Format Generators**
  - [ ] Update `Mp4FormatGenerator` with conditional `-crf` and `-b:v`.
  - [ ] Update `WebmFormatGenerator` with conditional `-crf` and `-b:v`.
  - [ ] Update `MkvFormatGenerator` with conditional `-crf` and `-b:v`.
  - [ ] Update `MovFormatGenerator` with conditional `-crf` and `-b:v`.
  - [ ] Update `GifFormatGenerator` with `max_colors` in `palettegen`.
  - [ ] Update `ApngFormatGenerator` with `-compression_level`.
  - [ ] Update generator tests in `src/formats/registry.test.ts`.
- [ ] **CLI & MCP Integration**
  - [ ] Add CLI flags and thread options in `src/index.ts`.
  - [ ] Expose schema properties and CLI forwarding in `src/mcp.ts`.
  - [ ] Update tests in `tests/cli.spec.ts` and `tests/mcp.spec.ts`.
- [ ] **Documentation, Security & Pre-Flight Audits**
  - [ ] Update `README.md`, `docs/CLI.md`, `docs/MCP.md`, and `docs/ARCHITECTURE.md`.
  - [ ] Audit `docs/SECURITY.md`.
  - [ ] Run full test suites (`npm run check:fast`, `npm test`).
  - [ ] Update spec status to `🟢 Completed` and move to `specs/completed/177-quality-control-parameters.md`.

## 🧪 Verification Plan

- [ ] Fast checks: `npm run check:fast`
- [ ] Unit & integration tests: `npm test`
- [ ] Format generator tests: `npm run test:unit -- src/formats/registry.test.ts`
- [ ] Validation tests: `npm run test:unit -- src/utils/validateOptions.test.ts`
- [ ] CLI tests: `npx playwright test tests/cli.spec.ts`
- [ ] MCP tests: `npx playwright test tests/mcp.spec.ts`

## 📝 Change Log

- 2026-11-22: Initialized spec for issue #177 on top of v0.37.1 (synced with main).
