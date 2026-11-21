# Spec: Streamline MCP Registry Commands & Docker SSE Transport

**Pull Request**: [#269](https://github.com/GehDoc/svg-to-video/pull/269)
**Status**: 🟡 To be reviewed

## 🎯 Objective

Align official Model Context Protocol (MCP) registry manifest (`mcp.json`) execution commands with the official MCP schema (`server.schema.json`), resolve the npm argument ordering bug for `npx`, and standardize Docker execution around robust HTTP/SSE transport while keeping stdio optimized for lightweight local execution.

## 🛠 Technical Strategy

- **Core Technologies**: Model Context Protocol (MCP), Docker, Node.js (`npx`), Supergateway
- **Architecture**:
  - **Local Execution (npm / npx)**: Standard I/O (`stdio`) transport for lightweight, zero-port-binding, low-latency execution in local environments (Claude Desktop, Cursor, local CLI).
  - **Containerized Execution (OCI / Docker)**: Server-Sent Events (`sse`) transport on port `8080` via `supergateway` with `--hosted` sandboxing, eliminating Docker-specific stdio pollution (TTY buffering, carriage return corruption, container startup noise) while providing full Chromium/FFmpeg isolation.
- **MCP Registry Schema Alignment (`mcp.json`)**:
  - For `registryType: "npm"`: Move `"mcp"` from `runtimeArguments` to `packageArguments` to adhere to `npx <runtimeArgs> <identifier>@<version> <packageArgs>`, ensuring `npx @gehdoc/svg-to-video@<version> mcp` is constructed.
  - For `registryType: "oci"`: Declare `transport: { "type": "sse", "url": "http://localhost:8080/sse" }` with runtime port mapping (`-p 8080:8080`, `--shm-size 2gb`) and package arguments (`mcp`).
- **Container Entrypoint Simplification (`docker-entrypoint.sh`)**:
  - Unify routing so `mcp`, `--mcp`, or `mcp:sse` consistently trigger the containerized SSE server on port 8080 with `--hosted`.
  - Maintain `mcp:stdio` as an explicit fallback if an operator requires containerized stdio.
  - Route all other arguments to the CLI conversion engine (`node /app/dist/src/index.js "$@"`).

## ✅ Task List

- [x] **Infrastructure & Manifest Alignment**
  - [x] Fix `mcp.json` npm entry: move `"mcp"` from `runtimeArguments` to `packageArguments` with `transport: { type: "stdio" }`
  - [x] Update `mcp.json` OCI entry: declare `transport: { type: "sse", url: "http://localhost:8080/sse" }` with runtimeArguments (`-p 8080:8080`, `--shm-size 2gb`) and packageArguments (`mcp`)
  - [x] Update [docker-entrypoint.sh](file:///home/ge/Documents/Takako/universite/boite-noire/svg-to-video/docker-entrypoint.sh) to cleanly route `mcp`, `--mcp`, and `mcp:sse` to Supergateway SSE
- [x] **Contract Tests & Validation**
  - [x] Update `tests/mcp.spec.ts` contract tests to assert both npm (stdio) and OCI (SSE) package transport schemas in `mcp.json`
  - [x] Verify test suite passes (`npm run test:mcp`)
- [x] **Documentation, Security & SEO Pre-Flight**
  - [x] Audit and update `docs/MCP.md` (clarify local stdio vs containerized SSE, schema execution paths)
  - [x] Audit and update `docs/SECURITY.md` (document containerized SSE sandboxing and path-traversal protections)
  - [x] Audit `README.md` and `skills/svg-to-video/SKILL.md` (verify Docker and npx invocation snippets)
  - [x] Verify `CONTRIBUTING.md` pre-flight checklists

## 🧪 Verification Plan

- [x] Automated Test: `npm run test:mcp` (verifies MCP tools, sandboxing, and `mcp.json` registry schema contract)
- [x] Package / Build Integrity: `npm run check:fast`
- [x] Docker Entrypoint Inspection: verify shell script routing for both `mcp`, `--mcp`, and CLI arguments

## 📝 Change Log

- _2026-11-21: Initial spec created to align MCP registry commands and streamline Docker SSE transport._
