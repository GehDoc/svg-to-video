# Spec: 195 - MCP Hosted Input Schema Optimization

**GitHub Issue**: [#195](https://github.com/GehDoc/svg-to-video/issues/195)
**Status**: 🟢 Completed

## 🎯 Objective

Optimize the Model Context Protocol (MCP) tool definitions so that unsupported parameters (`svgFilePath` and `outDir`) are excluded from input schemas in hosted sandboxing mode (`isHosted === true`), while simplifying parameter descriptions for local mode.

## 🛠 Technical Strategy

- **MCP Tool Registration**: Conditionally include `svgFilePath` and `outDir` in the `inputSchema` properties in `src/mcp.ts` based on the `isHosted` flag.
- **Description Clean-up**: Simplify the descriptions of `svgFilePath` and `outDir` in `src/mcp.ts` by removing redundant `(forbidden in hosted sandboxed mode)` text.
- **Integration Tests**: Verify schema filtering in `tests/mcp.spec.ts` using `listTools()` for both default (`MCP_HOSTED=false`) and hosted (`MCP_HOSTED=true`) configurations, asserting `0.0.0-0` placeholder version contract stability for `mcp.json`.
- **CI Pipeline Enhancement**: Add `npm run test:unit` and `npm run test:mcp` to `.github/workflows/ci.yml` in Docker environment to run backend unit and MCP integration test suites automatically on PRs and pushes.
- **Documentation Alignment**: Update `docs/MCP.md` and `docs/SECURITY.md` to reflect that hosted mode excludes local filesystem parameters from schema definitions.
- **Version Bump**: Increment package patch version in `package.json` and `web/package.json`, keep `0.0.0-0` placeholders in `mcp.json`, and synchronize `package-lock.json`.

## ✅ Task List

- [x] **MCP Core Logic**
  - [x] Conditionally omit `svgFilePath` and `outDir` in `src/mcp.ts` when `isHosted === true`
  - [x] Simplify parameter descriptions in `src/mcp.ts`
- [x] **Testing & CI**
  - [x] Add assertions in `tests/mcp.spec.ts` to test tool schemas in hosted vs non-hosted mode and verify `0.0.0-0` placeholders in `mcp.json`
  - [x] Add `mcp-and-unit-tests` job to `.github/workflows/ci.yml`
- [x] **Documentation & Versioning**
  - [x] Update `docs/MCP.md` and `docs/SECURITY.md`
  - [x] Bump patch version in `package.json` and `web/package.json`
  - [x] Keep `0.0.0-0` placeholders in `mcp.json`
  - [x] Run `npm install` to update `package-lock.json`

## 🧪 Verification Plan

- [x] Automated Test: `npm run test:unit` & `npm run check:fast`
- [x] Docker CI Test Pipeline: `ci.yml` `mcp-and-unit-tests` step

## 📝 Change Log

- 2026-10-04: Initial spec created for Issue #195 by Jules Agent.
- 2026-10-04: Implemented schema filtering, parameter description simplification, docs updates, version bump, `mcp.json` placeholder contract tests, and Docker CI workflow integration.
