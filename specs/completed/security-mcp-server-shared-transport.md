# Spec: Security - Patch MCP TypeScript Server Shared Transport Vulnerability

**Dependabot Alert**: [#119](https://github.com/GehDoc/svg-to-video/security/dependabot/119)
**Advisories**: [GHSA-jm63-cq47-j5jp](https://github.com/advisories/GHSA-jm63-cq47-j5jp)
**Status**: 🟢 Completed

## 🎯 Objective

Eliminate high-severity vulnerability in `@modelcontextprotocol/server` (< 2.3.0) where shared transport or server instances could deliver one HTTP client's messages to another, introduced transitively via `supergateway`.

## 🛠 Technical Strategy

- **Vulnerability**: `GHSA-jm63-cq47-j5jp` — An MCP server reached over HTTP could deliver one client's responses and notifications to another client when clients shared a stateless transport, McpServer, or Server instance.
- **Affected transitive package**: `@modelcontextprotocol/server` (affected: `>= 2.0.0, < 2.3.0`, patched: `2.3.0+`, latest: `2.4.0`).
- **Source**: Pulled in transitively by `supergateway@^4.1.0`.
- **Fix strategy**: Add npm `overrides` in root `package.json` for `@modelcontextprotocol/server` to pin to `2.4.0`.
- **Regenerate lockfile**: Run `npm install` to update `package-lock.json`.
- **Verification**: Run `npm audit` to verify the vulnerability is resolved, `npm run test:mcp` to ensure MCP server functionality, and `npm run test:unit` for regression safety.

## ✅ Task List

- [x] **Infrastructure & Dependency Update**
  - [x] Add `@modelcontextprotocol/server: "2.4.0"` to `overrides` in `package.json`
  - [x] Run `npm install` to regenerate `package-lock.json`
  - [x] Verify `npm audit` no longer reports `@modelcontextprotocol/server` vulnerabilities
- [x] **Verification**
  - [x] Run `npm run test:mcp` to verify MCP server behavior
  - [x] Run `npm run test:unit` to verify CLI and web workspace unit tests
  - [x] Run `npm run check:fast` to ensure linting, format, and type checking pass
- [x] **Documentation & Completion**
  - [x] Mark spec as completed and move to `specs/completed/`

## 🧪 Verification Plan

- [x] Automated Test: `npm run test:mcp`
- [x] Automated Test: `npm run test:unit`
- [x] Audit: `npm audit`
- [x] Fast Check: `npm run check:fast`

## 📝 Change Log

- 2026-11-02: Initial spec created for Dependabot alert #119.
- 2026-11-02: Applied npm override, regenerated lockfile, verified all test suites pass, moved to completed.
