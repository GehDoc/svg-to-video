# Spec: 177 - Quality Control Parameters for Video and Animated Image Exports

**GitHub Issue**: [#177](https://github.com/GehDoc/svg-to-video/issues/177)
**Status**: 🟢 Completed

## 🎯 Objective

Expose bitrate, CRF, and quality control parameters via CLI flags and MCP tool parameters, passing them through FFmpeg argument generators for MP4, WebM, MOV, MKV, GIF, and aPNG outputs.

## 🛠 Technical Strategy

- **CLI Interface (`src/index.ts`)**:
  - Add `--bitrate <rate>` (e.g. `5M`, `2000k`) option.
  - Add `--crf <value>` (e.g. `0-51`, typically `18-28`) option.
  - Add `--quality <level>` (e.g. `1-100`) option for animated images and general quality control.
- **MCP Tool Schema (`src/mcp.ts`)**:
  - Add optional properties `bitrate`, `crf`, and `quality` to `render_svg_to_video` tool input schema.
  - Forward these parameters into CLI command args.
- **Format Options & Generators (`src/formats/`)**:
  - Extend `CLIFormatOptions` in `src/formats/types.ts` with optional `bitrate`, `crf`, `quality`.
  - Update `Mp4FormatGenerator`, `WebmFormatGenerator`, `MovFormatGenerator`, `MkvFormatGenerator`, `GifFormatGenerator`, `ApngFormatGenerator` to construct corresponding FFmpeg parameters when provided.
- **Option Validation (`src/utils/validateOptions.ts`)**:
  - Validate `crf` and `quality` bounds and `bitrate` format when provided.

## ✅ Task List

- [x] **Core Options & Types**
  - [x] Extend `CLIFormatOptions` interface in `src/formats/types.ts`.
  - [x] Add option validation logic in `src/utils/validateOptions.ts`.
- [x] **Format Generators**
  - [x] Update `Mp4FormatGenerator` with `-crf` and `-b:v`.
  - [x] Update `WebmFormatGenerator` with `-crf` and `-b:v`.
  - [x] Update `MovFormatGenerator` with `-crf` and `-b:v`.
  - [x] Update `MkvFormatGenerator` with `-crf` and `-b:v`.
  - [x] Update `GifFormatGenerator` and `ApngFormatGenerator` with quality parameters.
- [x] **CLI & MCP Integration**
  - [x] Add CLI flags in `src/index.ts`.
  - [x] Expose schema properties and CLI forwarding in `src/mcp.ts`.
- [x] **Documentation & Testing**
  - [x] Update `README.md` with new parameters.
  - [x] Update `src/formats/registry.test.ts` and option validation unit tests.

## 🧪 Verification Plan

- [ ] Unit tests: `npm run test:unit`
- [ ] Fast checks: `npm run check:fast`

## 📝 Change Log

- 2026-09-29: Initial spec created for issue #177.
