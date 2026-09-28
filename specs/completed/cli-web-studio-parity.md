# Spec: CLI, MCP Server & Web Studio Functional Parity Assessment

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Analyze and document the functional parity across the CLI/MCP server interfaces and the Web Studio, identifying any feature discrepancies and proposing actionable improvements for each tool.

## 🛠 Technical Strategy

- Audit features, capabilities, and options in CLI (`src/index.ts`), MCP server (`src/mcp.ts`), and Web Studio (`web/src/components/ConfigPanel.tsx`, `web/src/hooks/useRenderer.ts`).
- Create a comprehensive comparison matrix covering input source, output formats, canvas options, resolution, duration/fps, metadata, telemetry, and performance/capture controls.
- Outline specific improvements for Web Studio and CLI/MCP Server to achieve full feature parity where appropriate.

## 📊 Feature Parity Matrix

| Feature / Setting             | CLI & MCP Server                                                 | Web Studio                                                                  | Parity Status / Assessment                                                                                                       |
| :---------------------------- | :--------------------------------------------------------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| **Input Source**              | File path (`svgFilePath`), raw SVG string (`svgContent` in MCP). | File upload (dropzone/picker), drag & drop.                                 | **Parity Achieved** (Adapted to interface)                                                                                       |
| **Output Formats**            | MP4, WebM, GIF, aPNG, MKV, MOV                                   | MP4, WebM, GIF, aPNG, MKV, MOV                                              | **Parity Achieved**                                                                                                              |
| **Resolution Presets**        | `original`, `1080p`, `720p`                                      | `original`, `1080p`, `720p`                                                 | **Parity Achieved**                                                                                                              |
| **Scale Factor**              | Scale factor (1-4x) for original resolution                      | Scale factor (1-4x) for original resolution                                 | **Parity Achieved**                                                                                                              |
| **FPS Control**               | Custom integer (1-60)                                            | Custom integer (1-60 slider/input)                                          | **Parity Achieved**                                                                                                              |
| **Duration & Auto-detection** | Explicit duration (`-d`) or auto-detected                        | Explicit duration or auto-detected                                          | **Parity Achieved**                                                                                                              |
| **Hold Frame Duration**       | `-h, --hold <seconds>`                                           | Hold (s) input field                                                        | **Parity Achieved**                                                                                                              |
| **Background Transparency**   | `--transparent` (WebM, GIF, aPNG, MOV)                           | Toggle checkbox (WebM, GIF, aPNG, MOV)                                      | **Parity Achieved**                                                                                                              |
| **Background Color**          | `--bg-color <hex>`                                               | Color picker & hex text input                                               | **Parity Achieved**                                                                                                              |
| **Metadata Tags**             | `--metadata title="..." comment="..."`                           | Title & Comment metadata input fields                                       | **Parity Achieved**                                                                                                              |
| **Telemetry / Opt-Out**       | Opt-out via `DO_NOT_TRACK` env variable                          | Anonymous Umami tracking (respects DNT)                                     | **Parity Achieved**                                                                                                              |
| **Capture Engine Method**     | Puppeteer frame scrubbing                                        | Optimal (fast canvas/MediaRecorder) vs High Fidelity (slow frame scrubbing) | **Difference Identified**: Web Studio offers "Optimal" vs "High Fidelity" toggle; CLI defaults to high-fidelity frame scrubbing. |
| **Frame Retention**           | `--keep-frames` (preserves temporary `.png` files)               | N/A (runs in browser memory)                                                | **CLI Specific** (By design for local disk debugging)                                                                            |
| **File Overwrite Protection** | Overwrite check with `-f, --force` flag                          | N/A (downloads generated Blob)                                              | **CLI Specific** (By design for file system safety)                                                                              |
| **Clipboard Support**         | N/A (saves file to disk)                                         | Copy Base64 Data URL to Clipboard                                           | **Web Studio Specific** (Browser convenience)                                                                                    |
| **Animation Inspection Tool** | `inspect_svg_animation` MCP tool                                 | Auto-inspects on file load, shows resolution warning                        | **MCP Specific** (Agent tool call)                                                                                               |

## 🚀 List of Recommended Improvements

### A. Web Studio

1. **Dimension Preview Tooltips**: Display target resolution dimensions (e.g. `1280x720` or `1920x1080`) directly next to the preset dropdown options.
2. **Capture Method Explanations**: Add an informative tooltip or helper text explaining the difference between "Optimal" (fast, real-time) and "High Fidelity" (slow, frame-by-frame) capture methods.

### B. CLI & MCP Server

1. **Custom Resolution/Dimensions Flag**: Add support for custom dimensions (e.g. `--resolution 1280x720` or `--width` / `--height` flags) in addition to current presets.
2. **Bitrate / CRF Quality Control**: Expose quality/bitrate parameters for video formats and GIF quantization quality in CLI flags and MCP tool schemas.

## ✅ Task List

- [x] Audit CLI, MCP server, and Web Studio codebase for features and options.
- [x] Construct functional parity comparison matrix.
- [x] Document recommended improvements for both interfaces.

## 📝 Change Log

- 2026-03-31: Initial functional parity assessment spec created.
