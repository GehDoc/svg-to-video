# Spec: 183 - MCP Media Delivery, Ephemeral Storage & Security Sandboxing

**GitHub Issue**: [#183](https://github.com/GehDoc/svg-to-video/issues/183)
**Status**: 🟢 Completed

## 🎯 Objective

Enhance the MCP server by delivering in-band binary/Base64 media responses, isolating temporary output files in ephemeral `/tmp/` storage, enforcing `MCP_HOSTED=true` security sandboxing against path traversal, upgrading Dockerfile to `node:24-trixie-slim`, optimizing Glama tool descriptions, and updating documentation & badges.

## 🛠 Technical Strategy

- **Core Technologies**: Model Context Protocol (MCP) SDK, Node.js `fs.mkdtempSync` (`os.tmpdir()`), Puppeteer, Docker (`node:24-trixie-slim`).
- **Architecture**: Stdio MCP Server (`src/mcp.ts`), dual in-band image/resource + text JSON metadata payload, environment-driven security mode (`MCP_HOSTED`).
- **Key Dependencies**: `@modelcontextprotocol/sdk`, `commander` (built-in types).

## ✅ Task List

- [x] **MCP Binary & Ephemeral Storage Payload**
  - [x] Implement embedded binary/Base64 content response (`type: "image"` / `resource`) in `src/mcp.ts` for `render_svg_to_video`.
  - [x] Implement ephemeral `/tmp/` file lifecycle: purge `/tmp/` folder after reading to memory; omit `outputFilePath` when `outDir` is omitted.
  - [x] Support explicit `outDir` preservation for local desktop runs (retaining persistent file and returning path).

- [x] **Security Sandboxing (`MCP_HOSTED=true`)**
  - [x] Support `MCP_HOSTED=true` environment variable and `--hosted` CLI flag in `src/mcp.ts`.
  - [x] Support containerized HTTP/SSE mode (`MCP_HOSTED=true` / `mcp --sse`) wrapping `mcp.ts` on port 8080 for hosted cloud deployments.
  - [x] Automatically reject `svgFilePath` and forbid arbitrary `outDir` when `MCP_HOSTED=true` is set.
  - [x] Report security path rejection errors under `file-load` Umami telemetry event.
  - [x] Update `mcp.json` schema to document `MCP_HOSTED` environment variable and port 8080 SSE transport options.

- [x] **Infrastructure & Dependencies**
  - [x] Update `Dockerfile` base image from `node:24-slim` to `node:24-trixie-slim`.
  - [x] Remove legacy `@types/commander` devDependency from root `package.json`.

- [x] **Glama TDQS Tool Description Optimization**
  - [x] Refine `render_svg_to_video` and `inspect_svg_animation` descriptions in `src/mcp.ts` and `mcp.json` with explicit when-to-use guidance, workflow sequence rules, and parameter choice rules.

- [x] **Documentation, SEO & Badges**
  - [x] Add Glama MCP server score badge and rationalize badge layout in `README.md`.
  - [x] Update `docs/MCP.md` with audited MCP Inspector debugging instructions (local node vs docker with `--shm-size=2gb` and `-e PUPPETEER_ARGS="--no-sandbox"` flags).
  - [x] Document Docker memory requirement (`--shm-size=2gb`) and sandbox rules (`PUPPETEER_ARGS="--no-sandbox"`) in `docs/MCP.md` and `README.md`.
  - [x] Add pointers in `docs/MCP.md` to Glama page and MCP Registry published JSON manifest.
  - [x] Update `docs/SECURITY.md` with `MCP_HOSTED=true` security sandboxing guarantees.

- [x] **Testing & Verification**
  - [x] Update `tests/mcp.spec.ts` integration test suite with assertions for temp file isolation, `MCP_HOSTED=true` security path rejection, in-band binary response formats, and `mcp.json` schema compliance.

## 🧪 Verification Plan

- [x] Manual Test: Run `npx -y @modelcontextprotocol/inspector node dist/src/mcp.js` and verify in-band image rendering and temp cleanup.
- [x] Manual Test: Run `MCP_HOSTED=true node dist/src/mcp.js` and verify `svgFilePath` rejection.
- [x] Automated Test: `npm run test:mcp`
- [x] Automated Test: `npm run check:fast`

## 📝 Change Log

- 2026-09-29: Initial spec created by Antigravity AI for Issue #183.
