# Spec: 183 - MCP Media Delivery, Ephemeral Storage & Security Sandboxing

**GitHub Issue**: [#183](https://github.com/GehDoc/svg-to-video/issues/183)  
**Status**: 🟠 Pending

## 🎯 Objective

Enhance the MCP server by delivering in-band binary/Base64 media responses, isolating temporary output files in ephemeral `/tmp/` storage, enforcing `MCP_HOSTED=true` security sandboxing against path traversal, upgrading Dockerfile to `node:24-trixie-slim`, optimizing Glama tool descriptions, and updating documentation & badges.

## 🛠 Technical Strategy

- **Core Technologies**: Model Context Protocol (MCP) SDK, Node.js `fs.mkdtempSync` (`os.tmpdir()`), Puppeteer, Docker (`node:24-trixie-slim`).
- **Architecture**: Stdio MCP Server (`src/mcp.ts`), dual in-band image/resource + text JSON metadata payload, environment-driven security mode (`MCP_HOSTED`).
- **Key Dependencies**: `@modelcontextprotocol/sdk`, `commander` (built-in types).

## ✅ Task List

- [ ] **MCP Binary & Ephemeral Storage Payload**
  - [ ] Implement embedded binary/Base64 content response (`type: "image"` / `resource`) in `src/mcp.ts` for `render_svg_to_video`.
  - [ ] Implement ephemeral `/tmp/` file lifecycle: purge `/tmp/` folder after reading to memory; omit `outputFilePath` when `outDir` is omitted.
  - [ ] Support explicit `outDir` preservation for local desktop runs (retaining persistent file and returning path).

- [ ] **Security Sandboxing (`MCP_HOSTED=true`)**
  - [ ] Support `MCP_HOSTED=true` environment variable and `--hosted` CLI flag in `src/mcp.ts`.
  - [ ] Support containerized HTTP/SSE mode (`MCP_HOSTED=true` / `mcp --sse`) wrapping `mcp.ts` with `mcp-proxy` on port 8080 for hosted cloud deployments.
  - [ ] Automatically reject `svgFilePath` and forbid arbitrary `outDir` when `MCP_HOSTED=true` is set.
  - [ ] Report security path rejection errors under `file-load` Umami telemetry event.
  - [ ] Update `mcp.json` schema to document `MCP_HOSTED` environment variable and port 8080 SSE transport options.

- [ ] **Infrastructure & Dependencies**
  - [ ] Update `Dockerfile` base image from `node:24-slim` to `node:24-trixie-slim`.
  - [ ] Remove legacy `@types/commander` devDependency from root `package.json`.

- [ ] **Glama TDQS Tool Description Optimization**
  - [ ] Refine `render_svg_to_video` and `inspect_svg_animation` descriptions in `src/mcp.ts` and `mcp.json` with explicit when-to-use guidance, workflow sequence rules, and parameter choice rules.

- [ ] **Documentation, SEO & Badges**
  - [ ] Add Glama MCP server score badge and rationalize badge layout in `README.md`.
  - [ ] Update `docs/MCP.md` with audited MCP Inspector debugging instructions (local node vs docker with `--shm-size=2gb` and `-e PUPPETEER_ARGS="--no-sandbox"` flags).
  - [ ] Document Docker memory requirement (`--shm-size=2gb`) and sandbox rules (`PUPPETEER_ARGS="--no-sandbox"`) in `docs/MCP.md` and `README.md`.
  - [ ] Add pointers in `docs/MCP.md` to Glama page and MCP Registry published JSON manifest.
  - [ ] Update `docs/SECURITY.md` with `MCP_HOSTED=true` security sandboxing guarantees.

- [ ] **Testing & Verification**
  - [ ] Update `tests/mcp.spec.ts` integration test suite with assertions for temp file isolation, `MCP_HOSTED=true` security path rejection, in-band binary response formats, and `mcp.json` schema compliance.

## 🧪 Verification Plan

- [ ] Manual Test: Run `npx -y @modelcontextprotocol/inspector node dist/src/mcp.js` and verify in-band image rendering and temp cleanup.
- [ ] Manual Test: Run `MCP_HOSTED=true node dist/src/mcp.js` and verify `svgFilePath` rejection.
- [ ] Automated Test: `npm run test:mcp`
- [ ] Automated Test: `npm run check:fast`

## 📝 Change Log

- 2026-09-29: Initial spec created by Antigravity AI for Issue #183.
