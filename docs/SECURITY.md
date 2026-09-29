# Security Policy & Architecture Guidelines

This document outlines the security architecture, sandboxing model, and pre-flight audit rules for `svg-to-video`.

---

## 🔒 Security Architecture & Sandboxing Model

`svg-to-video` processes CSS/SMIL-animated SVG files and transforms them into video/image assets via Puppeteer and FFmpeg. Because SVG files may contain embedded JavaScript (`<script>`) or CSS styling, the system is designed with multiple layers of isolation:

### 1. Subprocess Execution & Parameter Safety

- **No Shell Interpolation**: All internal CLI and FFmpeg invocations use `execFileSync` or argument arrays (e.g. `execFileSync('npx', args)`). Shell execution strings (`child_process.exec('/bin/sh')`) are strictly forbidden to prevent shell injection vulnerabilities.
- **Machine Payload Boundaries**: Machine interfaces (`--json`) enforce closed, typed JSON payloads (`LoggerJsonOutput`) validated at runtime with type guards (`isLoggerJsonOutput`) to prevent improper data deserialization.

### 2. Browser & Rendering Context Isolation

- **Headless Page Lifecycle**: Each conversion session creates an ephemeral Puppeteer page context (`browser.newPage()`) that is closed upon completion.
- **Temporary Asset Sanitization**: Raw SVG strings ingested via MCP or API endpoints are written to isolated temporary directories (`fs.mkdtempSync`) and purged immediately after render completion.

### 3. Transport, Network & Hosted Security (`MCP_HOSTED=true`)

- **Stdio & SSE Transports**: The Model Context Protocol (MCP) server operates over standard I/O (`stdio`) by default, or containerized HTTP/SSE mode (`mcp --sse` listening on port 8080).
- **Hosted Sandboxing Mode (`MCP_HOSTED=true`)**: When running in hosted or multi-tenant environments, setting `MCP_HOSTED=true` (or passing `--hosted`) automatically enforces path traversal rejection:
  - Rejects any requests providing local filesystem paths (`svgFilePath` or custom `outDir`).
  - Restricts rendering input strictly to raw `svgContent`.
  - Cleans up ephemeral `/tmp/` processing directories immediately after generating base64 in-band media responses.
  - Telemetry logs security path rejections under the `file-load` Umami event with `rejectionReason: "path-traversal-blocked"`.
- **Docker Sandboxing**: For cloud agents or untrusted third-party SVG processing, running `svg-to-video` inside Docker (`docker run -i --rm --shm-size=2gb -e PUPPETEER_ARGS="--no-sandbox" gehdoc/svg-to-video mcp`) provides complete OS-level container isolation.

---

## 🛡️ Security Audit Checklist for Contributors & Pull Requests

Before merging any PR into `main`, ensure all new or modified code satisfies the following checklist:

1. **Subprocess Calls**:
   - [ ] No string concatenation inside shell execution commands.
   - [ ] `execFileSync` or argument arrays must be used for all child process calls.
2. **File System & Temp Cleanup**:
   - [ ] Ephemeral files must use `fs.mkdtempSync` and be cleaned up in a `finally` or `try/catch` block.
   - [ ] Path traversal vectors must be validated when resolving input/output directories.
3. **Browser Lifecycle**:
   - [ ] Browser contexts must close cleanly (`browser.close()`) even if rendering errors out.
4. **Input Validation & Types**:
   - [ ] Subprocess JSON outputs must be validated with runtime type guards (e.g., `isLoggerJsonOutput`).
