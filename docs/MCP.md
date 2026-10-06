# Model Context Protocol (MCP) & Agent Skill Guide

This document describes how to connect `svg-to-video` to AI Assistants (Claude Desktop, Cursor, Antigravity, AutoGPT) via the Model Context Protocol (MCP) or native Agent Skills.

---

## 🌟 Overview

AI coding assistants frequently generate complex animated vector graphics (SVGs with CSS keyframes, SMIL, or Web Animations API). However, running in text/headless contexts, LLMs lack native tools to compile these SVGs into downloadable video or animated image assets (`.mp4`, `.webm`, `.gif`, `.apng`).

`svg-to-video` provides a standard Model Context Protocol (MCP) server and file-based agent skill (`SKILL.md`) that allow AI assistants to render their SVG animations programmatically with high fidelity, background transparency, and auto-detected durations.

Official package metadata is published to the [Model Context Protocol Registry](https://registry.modelcontextprotocol.io/) via `mcp.json`.

---

## 🚀 Quick Start

Get from zero to rendering videos with your AI Assistant in 3 steps:

### Step 1: Add MCP Server Config

Add `svg-to-video` to your assistant's MCP configuration file (e.g. `claude_desktop_config.json` or Cursor MCP settings):

```json
{
  "mcpServers": {
    "svg-to-video": {
      "command": "npx",
      "args": ["-y", "-p", "@gehdoc/svg-to-video", "svg-to-video-mcp"]
    }
  }
}
```

### Step 2: Prompt Your AI Assistant

Ask your agent to convert an SVG file or generate a new animated vector graphic:

> _"Convert `examples/example.svg` into a 60fps transparent WebM video with custom resolution 1080x1920."_

### Step 3: Receive Generated Media

The AI assistant invokes `render_svg_to_video` in the background and returns the path to the rendered video file.

---

## ⚙️ Platform Setup Guides

### Claude Desktop

Add the `mcpServers` snippet to `claude_desktop_config.json`:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

### Cursor IDE

Open **Cursor Settings > Features > MCP**:

1. Click **+ Add New MCP Server**.
2. **Name**: `svg-to-video`
3. **Type**: `command`
4. **Command**: `npx -y -p @gehdoc/svg-to-video svg-to-video-mcp`

### Dockerized MCP Server (Zero Dependencies)

For cloud agents or sandbox environments without local Chromium or FFmpeg pre-installed:

```bash
# Containerized SSE MCP Server mode
docker run --rm -p 8080:8080 --shm-size=2gb -e PUPPETEER_ARGS="--no-sandbox" gehdoc/svg-to-video --mcp
```

> **Note**: Chromium memory constraints in containerized environments require passing `--shm-size=2gb` and `-e PUPPETEER_ARGS="--no-sandbox"` to prevent browser crashes during heavy rendering.

### 🛠 Local Development & Building (Contributors)

To test a local checkout of the repository as an MCP server:

```json
{
  "mcpServers": {
    "svg-to-video-local": {
      "command": "node",
      "args": ["/absolute/path/to/svg-to-video/dist/src/mcp.js"]
    }
  }
}
```

> **Contributor Note**: Always run `npm run build` before launching local compiled MCP servers, or use `npx tsx src/mcp.ts` during active development. See **[CONTRIBUTING.md](../CONTRIBUTING.md#commands--testing-strategy)** for complete instructions.

### 🔒 Security, Telemetry & Privacy

- **Stdio & SSE Transports**: The MCP server supports standard `stdio` or containerized HTTP/SSE mode via `supergateway`.
- **Hosted Sandboxing (`MCP_HOSTED=true` / `--hosted`)**: Enforces path traversal security by omitting local filesystem parameters (`svgFilePath` and `outDir`) from tool schemas and rejecting any local path arguments in multi-tenant or web environments, ensuring pure in-band media delivery. Activated via `MCP_HOSTED=true` environment variable or `--hosted` CLI flag. For details, see **[docs/SECURITY.md](./SECURITY.md)**.
- **Anonymous Telemetry**: Standard usage events (`file-load`, `conversion-start`, `conversion-success`) are reported anonymously to Umami for feature improvement without collecting file contents or PII. To opt out, set `DO_NOT_TRACK=1` in your environment. See **[docs/ANALYTICS.md](./ANALYTICS.md)** for full event schemas and opt-out details.

### 🌿 Environment Variables

The MCP server respects the following environment variables (defined in `mcp.json`):

| Environment Variable        | Format     | Description                                                                                       | Default |
| :-------------------------- | :--------- | :------------------------------------------------------------------------------------------------ | :------ |
| `DO_NOT_TRACK`              | `string`   | Set to `1` or `true` to opt out of anonymous telemetry collection.                                | `0`     |
| `MCP_HOSTED`                | `boolean`  | Set to `true` or `1` (or pass `--hosted` CLI flag) to enforce path traversal security sandboxing. | `false` |
| `PUPPETEER_EXECUTABLE_PATH` | `filepath` | Custom file path to a system Chromium or Chrome binary.                                           | —       |
| `PUPPETEER_ARGS`            | `string`   | Additional command-line flags to pass to Puppeteer Chromium (e.g., `--no-sandbox`).               | —       |

---

## 🛠 Exposed MCP Tools

The MCP server (`src/mcp.ts`) exposes two primary tools over `stdio` (or SSE via `supergateway`):

### 1. `render_svg_to_video`

Converts raw SVG content or an SVG file path into a video or animated image file.

| Parameter     | Type      | Default         | Description                                                                                                 |
| :------------ | :-------- | :-------------- | :---------------------------------------------------------------------------------------------------------- |
| `svgFilePath` | `string`  | —               | Path to the input `.svg` file.                                                                              |
| `svgContent`  | `string`  | —               | Raw SVG XML string (if `svgFilePath` is not provided).                                                      |
| `outDir`      | `string`  | current dir     | Directory to save output file.                                                                              |
| `fps`         | `number`  | `60`            | Frames per second.                                                                                          |
| `duration`    | `number`  | _auto-detected_ | Desired animation duration in seconds.                                                                      |
| `format`      | `string`  | `mp4` / `webm`  | Output format (`mp4`, `webm`, `gif`, `apng`, `mkv`, `mov`).                                                 |
| `transparent` | `boolean` | `false`         | Enable full alpha-channel background transparency.                                                          |
| `resolution`  | `string`  | `original`      | Resolution preset (`original`, `1080p`, `720p`) or custom formatted string (e.g. `1080x1080`, `1080x1920`). |
| `scale`       | `number`  | `1`             | Scale factor (1-4) for original resolution.                                                                 |
| `width`       | `number`  | —               | Custom output video width in pixels.                                                                        |
| `height`      | `number`  | —               | Custom output video height in pixels.                                                                       |
| `bgColor`     | `string`  | `#ffffff`       | Background hex color (cannot be used with `transparent`).                                                   |
| `hold`        | `number`  | `0`             | Seconds to freeze the final frame.                                                                          |

### 2. `inspect_svg_animation`

Inspects an SVG string or file to estimate animation duration, CSS keyframes, and dimensions.

| Parameter     | Type     | Description                                                                                                                |
| :------------ | :------- | :------------------------------------------------------------------------------------------------------------------------- |
| `svgFilePath` | `string` | Path to the input `.svg` file (required if `svgContent` is not provided; local mode only, omitted when `MCP_HOSTED=true`). |
| `svgContent`  | `string` | Raw SVG XML string content.                                                                                                |

---

## 🔍 Debugging with MCP Inspector

You can inspect and manually test the MCP server using the official `@modelcontextprotocol/inspector` CLI tool.

### Local Node.js Execution

```bash
npx -y @modelcontextprotocol/inspector node dist/src/mcp.js
```

### Dockerized MCP Inspector Test

```bash
docker run --rm --shm-size=2gb -e PUPPETEER_ARGS="--no-sandbox" gehdoc/svg-to-video --mcp &
npx -y @modelcontextprotocol/inspector
```

In this writable interface:

1. Click + Add Server (or edit the server card).
2. Choose SSE as the transport type.
3. Set the URL to http://localhost:8080/sse.
4. Click Connect!

---

## 💬 Agent Operator Prompting Guide

Once connected, agent operators can use natural prompts to trigger media rendering:

- **Generate & Convert with Custom Dimensions**:

  > _"Create an animated SVG loader icon with glowing circles, then use `render_svg_to_video` to export it as a 60fps transparent WebM video with 1080x1920 vertical resolution."_

- **GIF Export for Documentation**:

  > _"Take `assets/banner.svg` and export it as an optimized 3-second animated GIF with a transparent background and 1200x630 banner dimensions for GitHub documentation."_

- **Inspect Animation Metadata**:
  > _"Inspect `animation.svg` using `inspect_svg_animation` and tell me its detected duration and resolution."_

## 🤗 Live Interactive Demo (HuggingFace Space)

If you want to test the MCP server without installing Docker or Node.js locally, try our hosted demo: **[GehDoc/svg-to-video-mcp on HuggingFace Spaces](https://huggingface.co/spaces/GehDoc/svg-to-video-mcp)**

> **Architecture note**: The HuggingFace Space exposes the MCP server via a **Python wrapper** (not a Dockerfile) for cost reasons — it installs and invokes the npm package at runtime. The Space is backed by a dedicated **HuggingFace repository** ([`GehDoc/svg-to-video-mcp`](https://huggingface.co/GehDoc/svg-to-video-mcp)) that requires **Python development** for any changes to the hosting layer.
