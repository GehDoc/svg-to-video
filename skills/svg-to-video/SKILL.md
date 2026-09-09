---
name: svg-to-video
description: Convert CSS-animated SVG files or SVG string content into high-quality MP4/WebM/MKV/MOV videos, lightweight animated GIFs, or aPNG images with optional alpha-channel background transparency.
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
3. **Auto-Duration Detection**: Automatically detects CSS keyframe and animation loop durations if not specified.
4. **Resolution Presets**: Supports `original`, `1080p`, `720p`, and custom scaling factors (1x-4x).

## Usage Guidelines for AI Agents

When asked to generate a video or GIF from an SVG animation:

1. **Option A: Via MCP Tools (Recommended)**:
   - Call `render_svg_to_video` directly passing either `svgContent` (raw XML string) or `svgFilePath`.
   - Set `transparent: true` and `format: "webm"` or `format: "gif"` if a transparent overlay is requested.

2. **Option B: Via CLI Command**:

   ```bash
   npx svg-to-video input.svg 60 ./out-dir -d 5 --format gif --transparent --json
   ```

3. **Option C: Via Docker**:
   ```bash
   docker run -i --rm -v $(pwd):/app/data gehdoc/svg-to-video mcp
   ```
