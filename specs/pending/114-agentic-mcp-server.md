# Spec: 114 - Agentic Skill & Model Context Protocol (MCP) Integration

**GitHub Issue**: [#114](https://github.com/GehDoc/svg-to-video/issues/114)
**Status**: 🟠 Pending

## 🎯 Objective

Expose `svg-to-video` capabilities as an **Agentic Skill** and **Model Context Protocol (MCP) server**, allowing AI coding assistants and autonomous agents (e.g., Claude Desktop, Cursor, Antigravity) to programmatically render animated SVGs into high-quality MP4, WebM, GIF, and APNG assets.

## 🛠 Technical Strategy

- **CLI Enhancements**:
  - Add `--json` / `--quiet` flags to `src/index.ts` so machine invocations suppress ANSI interactive progress bars (`\r`) and emit clean JSON results for stdio/IPC pipelines.
- **MCP Server Core (`@modelcontextprotocol/sdk`)**:
  - Build an MCP server wrapper exposing two primary tools:
    1. `render_svg_to_video`: Converts SVG string or file path into `.mp4`, `.webm`, `.gif`, or `.apng` using specified resolution, fps, duration, and transparency options.
    2. `inspect_svg_animation`: Analyzes SVG keyframes/animations using `analyzeSvgAnimation` and returns duration & optimal export options.
- **Docker & Skill Packaging**:
  - Support MCP stdio/SSE mode within the existing Docker image (`Dockerfile`) for zero-dependency execution across cloud agents.
  - Create `skills/svg-to-video/SKILL.md` for native agent discovery in file-based skill environments.

## ✅ Task List

- [ ] **CLI Machine Interface**
  - [ ] Add `--quiet` / `--silent` flag to suppress progress logs in `src/index.ts`
  - [ ] Add `--json` flag to return structured JSON stdout on completion
- [ ] **MCP Server Core**
  - [ ] Add `@modelcontextprotocol/sdk` to dependencies
  - [ ] Implement `render_svg_to_video` MCP tool
  - [ ] Implement `inspect_svg_animation` MCP tool
  - [ ] Wire up stdio transport server
- [ ] **Skill Definition & Docker Packaging**
  - [ ] Create `skills/svg-to-video/SKILL.md`
  - [ ] Update `Dockerfile` to support MCP execution entrypoint
- [ ] **Documentation & SEO Audit**
  - [ ] Update `README.md` & `docs/ARCHITECTURE.md`
  - [ ] Update SEO keywords & JSON-LD in `web/src/app/layout.tsx`
  - [ ] Update static fallback description in `web/src/components/SeoFallback.tsx`
  - [ ] Update `package.json` keywords

## 🧪 Verification Plan

- [ ] Manual Test: Run MCP server via stdio test script and invoke `render_svg_to_video` on `examples/example.svg`.
- [ ] Automated Test: `npm run test` validating CLI options (`--quiet`, `--json`) and MCP tool schemas.

## 📝 Change Log

- _2026-09-05: Initial spec created for Issue #114._
