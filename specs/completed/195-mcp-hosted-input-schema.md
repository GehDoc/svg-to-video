# Spec: 195 - MCP Hosted Input Schema Optimization

**GitHub Issue**: [#195](https://github.com/GehDoc/svg-to-video/issues/195)
**Status**: 🟢 Completed

## 🎯 Objective

Optimize the Model Context Protocol (MCP) tool definitions so that unsupported parameters (`svgFilePath` and `outDir`) are excluded from input schemas in hosted sandboxing mode (`isHosted === true`), while refactoring parameter descriptions to be DRY and carry conditional requirements on `svgFilePath`.

## 🛠 Technical Strategy

- **MCP Tool Registration**: Conditionally include `svgFilePath` and `outDir` in the `inputSchema` properties in `src/mcp.ts` based on the `isHosted` flag.
- **DRY Parameter Definitions**: Define shared constants (`SVG_FILE_PATH_PARAM`, `SVG_CONTENT_PARAM`) in `src/mcp.ts` where `svgFilePath` carries the conditional requirement (`required if svgContent is not provided`) and `svgContent` is `'Raw SVG XML string content.'`.
- **Integration Tests**: Verify schema filtering in `tests/mcp.spec.ts` using `listTools()` for both default (`MCP_HOSTED=false`) and hosted (`MCP_HOSTED=true`) configurations, asserting `0.0.0-0` placeholder version contract stability for `mcp.json`.
- **CI Pipeline Optimization**: Group Docker CLI and MCP integration tests (`test:cli` and `test:mcp`) under `docker-integration-tests` and unify root and web unit tests under `unit-tests` in `.github/workflows/ci.yml`.
- **Documentation Alignment**: Update `docs/MCP.md`, `README.md`, and `docs/SECURITY.md` to reflect synchronized parameter descriptions, corrected default values (`outDir`, `bgColor`), updated `-y -p @gehdoc/svg-to-video svg-to-video-mcp` execution snippets, and hosted mode schema parameter omissions.
- **Version Bump**: Increment package patch version in `package.json` and `web/package.json`, keep `0.0.0-0` placeholders in `mcp.json`, and synchronize `package-lock.json`.

## ✅ Task List

- [x] **MCP Core Logic**
  - [x] Conditionally omit `svgFilePath` and `outDir` in `src/mcp.ts` when `isHosted === true`
  - [x] Refactor parameter descriptions to be DRY across `render_svg_to_video` and `inspect_svg_animation`
- [x] **Testing & CI**
  - [x] Add assertions in `tests/mcp.spec.ts` to test tool schemas in hosted vs non-hosted mode and verify `0.0.0-0` placeholders in `mcp.json`
  - [x] Consolidate `test:cli` and `test:mcp` under `docker-integration-tests` and `npm run test:unit` under `unit-tests` in `.github/workflows/ci.yml`
- [x] **Documentation & Versioning**
  - [x] Update `docs/MCP.md`, `README.md`, and `docs/SECURITY.md`
  - [x] Bump patch version in `package.json` and `web/package.json`
  - [x] Keep `0.0.0-0` placeholders in `mcp.json`
  - [x] Run `npm install` to update `package-lock.json`

## 🧪 Verification Plan

- [x] Automated Test: `npm run test:unit` & `npm run check:fast`
- [x] Docker CI Test Pipeline: `ci.yml` `docker-integration-tests` step

## 📝 Change Log

- 2026-10-04: Initial spec created for Issue #195 by Jules Agent.
- 2026-10-04: Implemented schema filtering, DRY parameter description refactoring, docs updates, version bump, `mcp.json` placeholder contract tests, and Docker CI workflow integration.
