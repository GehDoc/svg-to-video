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

## 🧪 Testing Strategy

Our testing strategy covers unit, integration, and E2E container validation to guarantee zero stdio protocol corruption and 100% rendering fidelity:

### 1. CLI Machine Interface Tests (`tests/cli.spec.ts`)

- **`--quiet` / `--silent` Validation**: Assert that stdout produces zero ANSI progress bars or interactive characters (`\r`).
- **`--json` Output Validation**: Assert stdout returns parseable JSON containing output filepath, duration, resolution, and rendering status.

### 2. MCP Server Protocol Tests (`tests/mcp.spec.ts`)

- **Stdio Client-Server Integration**: Use `@modelcontextprotocol/sdk` Client to spawn the MCP server as a child process.
- **`inspect_svg_animation` Tool**: Test against `examples/example.svg` to verify accurate detection of CSS keyframes, animation duration, and dimensions.
- **`render_svg_to_video` Tool**: Execute real conversion invocations (`.mp4`, `.gif`, `.webm`) via MCP calls and assert output file existence and ffprobe validation.
- **Error Handling**: Verify graceful error responses (JSON-RPC error payload) for missing files or malformed SVG input.

### 3. Docker Container E2E Tests

- Test running the MCP server inside Docker (`docker run -i --rm svg-to-video mcp`) over stdio transport to ensure Chrome, FFmpeg, and multi-language fonts resolve cleanly in containerized agent environments.

### 4. Skill Frontmatter & Schema Validation

- Automated check ensuring `skills/svg-to-video/SKILL.md` conforms to standard agent skill format and frontmatter schema.

---

## 🧪 Verification Plan

- [ ] Manual Test: Run MCP server via stdio test script and invoke `render_svg_to_video` on `examples/example.svg`.
- [ ] Automated Test: `npm run test:cli` validating CLI machine options (`--quiet`, `--json`).
- [ ] Automated Test: `npx tsx tests/mcp.spec.ts` validating MCP tool schemas and stdio RPC transport.

## 📝 Change Log

- _2026-09-05: Initial spec created for Issue #114._
- _2026-09-05: Added comprehensive multi-layer testing strategy for Issue #114._
