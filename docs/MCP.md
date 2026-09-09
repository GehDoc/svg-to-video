# Model Context Protocol (MCP) & Agent Skill Guide

This document describes how to connect `svg-to-video` to AI Assistants (Claude Desktop, Cursor, Antigravity, AutoGPT) via the Model Context Protocol (MCP) or native Agent Skills.

---

## 🌟 Overview

AI coding assistants frequently generate complex animated vector graphics (SVGs with CSS keyframes, SMIL, or Web Animations API). However, running in text/headless contexts, LLMs lack native tools to compile these SVGs into downloadable video or animated image assets (`.mp4`, `.webm`, `.gif`, `.apng`).

`svg-to-video` provides a standard Model Context Protocol (MCP) server and file-based agent skill (`SKILL.md`) that allow AI assistants to render their SVG animations programmatically with high fidelity, background transparency, and auto-detected durations.

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
      "args": ["-y", "svg-to-video", "mcp"]
    }
  }
}
```

### Step 2: Prompt Your AI Assistant

Ask your agent to convert an SVG file or generate a new animated vector graphic:

> _"Convert `examples/example.svg` into a 60fps transparent WebM video."_

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
4. **Command**: `npx -y svg-to-video mcp`

### Dockerized MCP Server (Zero Dependencies)

For cloud agents or sandbox environments without local Chromium or FFmpeg pre-installed:

```bash
docker run -i --rm -v $(pwd):/app/data gehdoc/svg-to-video mcp
```

### 🔒 Security & Sandboxing

The MCP server runs over `stdio` without opening external network ports. For details on Chromium browser isolation, argument sanitization, and containerized sandboxing, see **[docs/SECURITY.md](./SECURITY.md)**.

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

## 💬 Agent Operator Prompting Guide

Once connected, agent operators can use natural prompts to trigger media rendering:

- **Generate & Convert**:

  > _"Create an animated SVG loader icon with glowing circles, then use `render_svg_to_video` to export it as a 60fps transparent WebM video."_

- **GIF Export for Documentation**:

  > _"Take `assets/banner.svg` and export it as an optimized 3-second animated GIF with a transparent background for GitHub documentation."_

- **Inspect Animation Metadata**:
  > _"Inspect `animation.svg` using `inspect_svg_animation` and tell me its detected duration and resolution."_
