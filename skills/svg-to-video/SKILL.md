---
name: svg-to-video
description: Convert animated SVG files (CSS & SMIL) or SVG string content into high-quality MP4/WebM/MKV/MOV videos, lightweight animated GIFs, or aPNG images with optional alpha-channel background transparency.
tools:
  - name: render_svg_to_video
    description: Convert an animated SVG to video or animated image format.
  - name: inspect_svg_animation
    description: Inspect an SVG animation to estimate duration, keyframes, and dimensions.
---

# SVG to Video Agent Skill

This skill enables AI agents to render animated vector graphics (SVGs with CSS animations, SMIL keyframes, or Web Animations API) into binary video and image assets.

## Capabilities

1. **Format Export**: Converts SVGs into `mp4`, `webm`, `gif`, `apng`, `mkv`, and `mov`.
2. **Transparent Backgrounds**: Supports full alpha-channel transparency for `webm`, `gif`, `apng`, and `mov`.
3. **Configurable Animation Looping**: Supports loop control for animated formats (`gif`, `apng`) via `loop` parameter (0 = infinite [default], 1 or -1 / false = play once, N = loop count).
4. **Auto-Duration Detection**: Automatically detects CSS keyframes and SMIL animation loop durations if not specified.
5. **Resolution Presets & Custom Dimensions**: Supports `original`, `1080p`, `720p`, custom scaling factors (1x-4x), or formatted resolution strings (e.g., `WIDTHxHEIGHT` like `1080x1920`, `1080x1080`).

## Usage Guidelines for AI Agents

When asked to generate a video or GIF from an SVG animation:

1. **Option A: Via MCP Tools (Recommended)**:
   - Call `render_svg_to_video` directly passing either `svgContent` (raw XML string) or `svgFilePath`.
   - Set `transparent: true` and `format: "webm"` or `format: "gif"` if a transparent overlay is requested.
   - Set custom `resolution: "1080x1920"` for specific video aspect ratios (e.g. square 1080x1080, vertical 1080x1920).

2. **Option B: Via CLI Command**:

   ```bash
   npx -y -p @gehdoc/svg-to-video svg-to-video input.svg 60 ./out-dir -d 5 --resolution 1080x1920 --format webm --transparent --json
   ```

3. **Option C: Via Docker (Containerized SSE Server)**:
   ```bash
   docker run --rm -p 8080:8080 --shm-size=2gb -e PUPPETEER_ARGS="--no-sandbox" gehdoc/svg-to-video mcp
   ```
   Connect your MCP client to `http://localhost:8080/sse`. Both `mcp` and `--mcp` flags are supported.
