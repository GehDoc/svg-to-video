# Frequently Asked Questions

## Q: Are my SVG files uploaded to any external server?

No. The Web Studio runs 100% client-side inside your browser using WebCodecs and the Web Animations API. Your SVG source code and exported video frames never leave your local device.

## Q: How does frame scrubbing work for CSS and SMIL animations?

The engine mounts your SVG in an isolated offscreen canvas, programmatically pauses all CSS and SMIL animations, and advances the animation timeline frame by frame (e.g. at 24, 30, or 60 FPS) to guarantee 100% frame accuracy without skipped frames.

## Q: Can I automate conversions in CI/CD pipelines or AI agents?

Yes! You can use the official CLI tool (`npx -y @gehdoc/svg-to-video`), the Docker image (`gehdoc/svg-to-video`), or connect to the Model Context Protocol (MCP) server for Claude Desktop, Cursor, and Antigravity.

## Q: How do I preserve transparent backgrounds in exported videos?

Select **WebM**, **aPNG**, or **GIF** as your output format, check the "Transparent Background" toggle, and ensure your SVG root element does not declare an opaque background rect.
