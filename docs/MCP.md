# Model Context Protocol (MCP) & Agent Skill Guide

This document describes how to connect `svg-to-video` to AI Assistants (Claude Desktop, Cursor, Antigravity, AutoGPT, etc.) via the Model Context Protocol (MCP) or native Agent Skills.

---

## 🌟 Overview

AI coding assistants often generate complex animated vector graphics (SVGs with CSS keyframes, SMIL, or Web Animations API). However, running in text/headless contexts, LLMs lack native tools to compile these SVGs into downloadable video or animated image assets (`.mp4`, `.webm`, `.gif`, `.apng`).

`svg-to-video` provides a standard Model Context Protocol (MCP) server and file-based agent skill (`SKILL.md`) that allow AI assistants to render their SVG animations programmatically with high fidelity, background transparency, and auto-detected durations.

---

## 🚀 Quick Start for Agent Operators

### 1. Claude Desktop Configuration

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "svg-to-video": {
      "command": "npx",
      "args": ["-y", "svg-to-video", "mcp"]
    }
  }
}
```

### 2. Cursor IDE Configuration

Add a new MCP server in **Cursor Settings > Features > MCP**:

- **Name**: `svg-to-video`
- **Type**: `command`
- **Command**: `npx -y svg-to-video mcp`

### 3. Dockerized MCP Server (Zero Dependencies)

If running in cloud environments or sandboxes without local Chromium/FFmpeg:

```bash
docker run -i --rm -v $(pwd):/app/data gehdoc/svg-to-video mcp
```

---

## 🛠 Exposed MCP Tools

The MCP server (`src/mcp.ts`) exposes two primary tools over `stdio`:

### 1. `render_svg_to_video`

Converts raw SVG content or an SVG file path into a video or animated image file.

| Parameter     | Type      | Default         | Description                                                 |
| :------------ | :-------- | :-------------- | :---------------------------------------------------------- |
| `svgFilePath` | `string`  | —               | Path to the input `.svg` file.                              |
| `svgContent`  | `string`  | —               | Raw SVG XML string (if `svgFilePath` is not provided).      |
| `outDir`      | `string`  | current dir     | Directory to save output file.                              |
| `fps`         | `number`  | `60`            | Frames per second.                                          |
| `duration`    | `number`  | _auto-detected_ | Desired animation duration in seconds.                      |
| `format`      | `string`  | `mp4` / `webm`  | Output format (`mp4`, `webm`, `gif`, `apng`, `mkv`, `mov`). |
| `transparent` | `boolean` | `false`         | Enable full alpha-channel background transparency.          |
| `resolution`  | `string`  | `original`      | Resolution preset (`original`, `1080p`, `720p`).            |
| `scale`       | `number`  | `1`             | Scale factor (1-4) for original resolution.                 |
| `bgColor`     | `string`  | `#ffffff`       | Background hex color (cannot be used with `transparent`).   |
| `hold`        | `number`  | `0`             | Seconds to freeze the final frame.                          |

### 2. `inspect_svg_animation`

Inspects an SVG string or file to estimate animation duration, CSS keyframes, and dimensions.

| Parameter     | Type     | Description                         |
| :------------ | :------- | :---------------------------------- |
| `svgFilePath` | `string` | Path to the `.svg` file to inspect. |
| `svgContent`  | `string` | Raw SVG content to inspect.         |

---

## 💬 Prompting Examples for AI Agents

Once connected, you can prompt your AI assistant directly:

- **Generate & Convert**:

  > _"Create an animated SVG loader icon with glowing circles, then use `render_svg_to_video` to export it as a 60fps transparent WebM video."_

- **GIF Export**:

  > _"Take `assets/banner.svg` and export it as an optimized 3-second animated GIF with a transparent background."_

- **Inspect Animation**:
  > _"Inspect `animation.svg` using `inspect_svg_animation` and tell me its detected duration and resolution."_
