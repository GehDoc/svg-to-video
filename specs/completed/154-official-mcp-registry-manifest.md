# Spec: 154 - Add official MCP Registry manifest (mcp.json) and GitHub Action workflow

**GitHub Issue**: [#154](https://github.com/GehDoc/svg-to-video/issues/154)
**Status**: 🟢 Completed

## 🎯 Objective

Set up official integration with the Model Context Protocol (MCP) registry by adding `mcp.json` at the repository root and adding a GitHub Action release step to publish metadata automatically on releases.

## 🛠 Technical Strategy

- **MCP Manifest (`mcp.json`)**: Create `mcp.json` at repository root defining official MCP server metadata and Docker package reference (`gehdoc/svg-to-video:latest`).
- **Release Automation**: Integrate `modelcontextprotocol/registry-action@v1` into `.github/workflows/release.yml` executing after Docker image publication.
- **Documentation & Agent Protocol Alignment**: Update `AGENTS.md`, `CONTRIBUTING.md`, `docs/MCP.md`, and `README.md` to document the MCP registry manifest synchronization step and registry integration.

## ✅ Task List

- [x] **MCP Manifest & Action**
  - [x] Create `mcp.json` at repository root
  - [x] Update `.github/workflows/release.yml` with `modelcontextprotocol/registry-action@v1`
- [x] **Documentation & SEO**
  - [x] Update `AGENTS.md` (Pre-Flight checklist) to include `mcp.json`
  - [x] Update `CONTRIBUTING.md` (SEO & Metadata Audit Checklist) to include `mcp.json`
  - [x] Update `docs/MCP.md` and `README.md` to reference MCP Registry indexing

## 🧪 Verification Plan

- [x] Validate `mcp.json` syntax and schema compliance via Node JSON parser
- [x] Verify `release.yml` workflow YAML syntax
- [x] Run full project type check, linting, and formatting (`npm run check:fast`)

## 📝 Change Log

- 2026-09-23: Initial spec created for Issue #154.
