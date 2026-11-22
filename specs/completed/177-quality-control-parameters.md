# Spec: 177 - Quality Control Parameters for Video and Animated Image Exports

**GitHub Issue**: [#177](https://github.com/GehDoc/svg-to-video/issues/177)
**Status**: 🟢 Completed

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

- [x] **Core Options & Types**
  - [x] Extend `CLIFormatOptions` interface in `src/formats/types.ts`.
  - [x] Add option validation logic in `src/utils/validateOptions.ts` and test cases in `src/utils/validateOptions.test.ts`.
- [x] **Format Generators**
  - [x] Update `Mp4FormatGenerator` with conditional `-crf` and `-b:v`.
  - [x] Update `WebmFormatGenerator` with conditional `-crf` and `-b:v`.
  - [x] Update `MkvFormatGenerator` with conditional `-crf` and `-b:v`.
  - [x] Update `MovFormatGenerator` with conditional `-crf` and `-b:v`.
  - [x] Update `GifFormatGenerator` with `max_colors` in `palettegen`.
  - [x] Update `ApngFormatGenerator` with `-compression_level`.
  - [x] Update generator tests in `src/formats/registry.test.ts`.
- [x] **CLI & MCP Integration**
  - [x] Add CLI flags and thread options in `src/index.ts`.
  - [x] Expose schema properties and CLI forwarding in `src/mcp.ts`.
  - [x] Update tests in `tests/cli.spec.ts` and `tests/mcp.spec.ts`.
- [x] **Documentation, Security & Pre-Flight Audits**
  - [x] Update `README.md`, `docs/CLI.md`, `docs/MCP.md`, and `docs/ARCHITECTURE.md`.
  - [x] Audit `docs/SECURITY.md`.
  - [x] Run full test suites (`npm run check:fast`, `npm test`).
  - [x] Mark spec status as `🟡 To be reviewed` awaiting human developer approval.

## 🧪 Verification Plan

- [x] Fast checks: `npm run check:fast`
- [x] Unit tests: `npm run test:unit` (208 passed)
- [x] CLI integration tests: `npm run test:cli` (27 passed)
- [x] MCP integration tests: `npm run test:mcp` (11 passed)
- [x] Pack verification: `npm run test:pack` (3 passed)
- [x] Web E2E tests: `npm run test:web -w web` (24 passed)

## 📝 Change Log

- 2026-11-22: Initialized spec for issue #177 on top of v0.37.1 (synced with main).
- 2026-11-22: Implemented options, validation, generator FFmpeg logic, CLI/MCP wiring, tests, and documentation. All checks verified passing. Handover for review (`🟡 To be reviewed`).
- 2026-11-22: Approved by user, released in v0.38.0 (`🟢 Completed`).
