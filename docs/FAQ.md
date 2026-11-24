# Frequently Asked Questions

## Web Studio

### Q: Are my SVG files uploaded to any external server?

No. The Web Studio runs 100% client-side inside your browser using WebCodecs and the Web Animations API. Your SVG source code and exported video frames never leave your local device.

### Q: How does frame scrubbing work for CSS and SMIL animations?

The engine mounts your SVG in an isolated offscreen canvas, programmatically pauses all CSS and SMIL animations, and advances the animation timeline frame by frame (e.g. at 24, 30, or 60 FPS) to guarantee 100% frame accuracy without skipped frames.

### Q: How does the Web Studio render high-quality, flicker-free GIFs without a server?

Most browser-based GIF tools either snap colors coarsely (causing color banding) or use error diffusion dithering (which produces moving, noisy speckles across frames). The Web Studio features an in-browser encoder with custom 8x8 Bayer ordered dithering and 16-bit `rgb565` palette quantization. This disperses narrow color transitions smoothly without temporal fluttering, delivering FFmpeg-grade GIF quality directly inside your browser.

### Q: How do I preserve transparent backgrounds in exported videos?

Select **WebM**, **aPNG**, or **GIF** as your output format, check the "Transparent Background" toggle, and ensure your SVG root element does not declare an opaque background rect.

## CLI, Docker & MCP Automation

### Q: Can I automate conversions in CI/CD pipelines or AI agents?

Yes! You can use the official CLI tool (`npx -y @gehdoc/svg-to-video`), the Docker image (`gehdoc/svg-to-video`), or connect to the Model Context Protocol (MCP) server for Claude Desktop, Cursor, and Antigravity.

### Q: Do I need to manually install FFmpeg to use the CLI?

No. The CLI automatically uses system FFmpeg if present on your `$PATH`, or falls back to a bundled static FFmpeg binary out of the box. You can also specify a custom binary path using `--ffmpeg-path <path>` or the `FFMPEG_PATH` environment variable.

### Q: How do I control output video quality and file size?

You can fine-tune output size and visual fidelity in the CLI and MCP tools using `--bitrate <rate>` (e.g. `5M`, `2000k`), Constant Rate Factor `--crf <0-63>` (e.g. `18` for near-lossless, `20` by default, `28` for compact), or `--quality <1-100>` for animated GIF (color palette quantization) and aPNG (zlib compression).
