### Title

feat(cli,mcp): Expose bitrate and quality control parameters for video and animated image exports

### Description

#### Problem Statement

The CLI and MCP server currently use default encoding bitrates and quality settings hardcoded into FFmpeg argument builders for MP4, WebM, MOV, MKV, GIF, and aPNG. Users and AI agents cannot adjust encoding quality, bitrate, or quantization parameters to balance file size against visual quality for bandwidth-constrained distribution.

#### Proposed Solution

1. **CLI Quality Flags**:
   - Add `--bitrate <rate>` (e.g., `5M`, `2000k`) or `--crf <value>` (e.g., `18-28`) for video formats (MP4, WebM, MOV, MKV).
   - Add `--quality <level>` for GIF/aPNG frame quantization in `src/formats/generators/`.
2. **MCP Tool Schema**: Expose optional `bitrate` and `quality` parameters in the `render_svg_to_video` tool schema in `src/mcp.ts`.
3. **FFmpeg Generator Wiring**: Pass quality options through `CLIFormatOptions` into `buildFfmpegArgs` in format generators (`Mp4FormatGenerator`, `WebmFormatGenerator`, `GifFormatGenerator`, etc.).

#### Technical Scope

- `src/formats/types.ts` (`CLIFormatOptions` interface extension)
- `src/formats/generators/*.ts` (FFmpeg argument building logic)
- `src/index.ts` (CLI options)
- `src/mcp.ts` (MCP tool schema definition and CLI execution mapping)
- CLI and MCP test suites in `tests/cli.spec.ts` and `tests/mcp.spec.ts`.

#### Acceptance Criteria

- [ ] CLI supports quality/bitrate options (e.g. `--bitrate 8M` or `--crf 20`).
- [ ] MCP tool schema exposes `bitrate` / `quality` options for agent calls.
- [ ] FFmpeg argument generators correctly format quality flags when provided.
- [ ] Tests verify that format generators accept and pass quality options correctly.
