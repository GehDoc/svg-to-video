# Spec: 176 - Custom Width and Height Resolution Parameter Support

**GitHub Issue**: [#176](https://github.com/GehDoc/svg-to-video/issues/176)
**Status**: 🟢 Completed

## 🎯 Objective

Enable users and MCP AI agents to render SVGs into custom video dimensions (e.g., square 1080x1080, vertical 1080x1920, or custom banners 1200x630) by adding `--width` and `--height` CLI options as well as supporting formatted resolution strings (e.g., `--resolution 1080x1080`) and updating the MCP `render_svg_to_video` tool schema.

## 🛠 Technical Strategy

- **Core Technologies**: Node.js, Commander.js, Puppeteer viewport rendering, Model Context Protocol (MCP) SDK.
- **Architecture**: CLI argument parsing in `src/index.ts`, option validation in `src/utils/validateOptions.ts`, and MCP request handling in `src/mcp.ts`.
- **Key Dependencies**: `@modelcontextprotocol/sdk`, `commander`, `puppeteer`.

## ✅ Task List

- [x] **Infrastructure & Options Validation**
  - [x] Add `width` and `height` properties to `ValidateOptionsParams` in `src/utils/validateOptions.ts`.
  - [x] Implement validation logic for custom width/height and formatted resolution string (`WIDTHxHEIGHT`).
  - [x] Add unit tests in `src/utils/validateOptions.test.ts`.
- [x] **CLI Core Logic**
  - [x] Add `-w, --width <pixels>` and `--height <pixels>` options to Commander CLI definition in `src/index.ts`.
  - [x] Parse explicit dimensions / formatted resolution strings and calculate viewport width and height (preserving aspect ratio if only one dimension is specified).
  - [x] Pipe calculated viewport dimensions into Puppeteer rendering pipeline.
- [x] **MCP Tool Integration**
  - [x] Update `render_svg_to_video` schema in `src/mcp.ts` with `width` and `height` properties.
  - [x] Map MCP `width` and `height` arguments to CLI execution args.
- [x] **E2E & Integration Tests**
  - [x] Add CLI tests in `tests/cli.spec.ts` for `--width`, `--height`, and custom `--resolution 1080x1080`.
  - [x] Add MCP tool tests in `tests/mcp.spec.ts`.
- [x] **Documentation & Audit**
  - [x] Update `README.md`, `docs/CLI.md`, and `docs/MCP.md`.
  - [x] Perform security and type guard audit per AGENTS.md.

## 🧪 Verification Plan

- [x] Unit Test: `npm run test:unit`
- [x] CLI Integration Test: `npm run test:cli`
- [x] MCP Test: `npm run test:mcp`
- [x] Full Suite: `npm test`

## 📝 Change Log

- _2026-09-28: Initial spec created for Issue #176._
- _2026-09-28: Implementation complete and verified across all test suites._
