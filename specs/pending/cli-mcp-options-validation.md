# Spec: CLI & MCP Option Constraints, Color Keying, and Resolution Documentation

**Pull Request**: [#222](https://github.com/GehDoc/svg-to-video/pull/222)
**Status**: 🟠 Pending

## 🎯 Objective

Remove the default `#ffffff` assignment for `--bg-color` across the CLI and MCP interfaces, implement color-keying during frame rendering for transparent GIFs when `--bg-color` is supplied to achieve parity with Web Studio, and update documentation and tool schemas for `resolution`, `bg-color`, and `transparent`.

## 🛠 Technical Strategy

- **Core Technologies**: Node.js, Puppeteer, HTML5 Canvas, Commander, FFmpeg.
- **Architecture**: CLI & Model Context Protocol (MCP) server.
- **Option Handling**:
  - Remove `'#ffffff'` default from `--bg-color` in `src/index.ts`. `options.bgColor` will be `undefined` when not explicitly passed.
  - In `src/utils/validateOptions.ts`, check `if (options.bgColor && !generator.needsColorKeying)` to reject `--bg-color` with `--transparent` only for formats that do not need color keying (e.g. WebM, aPNG, MOV).
  - In `src/mcp.ts`, ensure `bgColor` parameter has no default and is passed to the CLI only when provided.
- **Rendering & Color Keying**:
  - In `src/index.ts` (`createFrames`), when `transparent` is true and `bgColor` is provided for a format requiring color keying (`needsColorKeying === true`, i.e., GIF):
    Use HTML5 Canvas compositing inside Puppeteer (`globalCompositeOperation = 'source-in'` with `bgColor`, followed by `globalCompositeOperation = 'source-over'`) to matte edge pixels against the keying color while preserving the transparent background.
- **Documentation & Tool Schemas**:
  - Update `docs/CLI.md`, `docs/MCP.md`, `src/mcp.ts`, and `README.md` to document the `custom` resolution preset, custom `--width` and `--height` constraints, the behavior of `--bg-color` (no default), and transparent GIF color keying.

## ✅ Task List

- [ ] **CLI & Option Validation**
  - [x] Remove default `'#ffffff'` from `--bg-color` option definition in `src/index.ts`.
  - [x] Update `src/utils/validateOptions.ts` and `src/utils/validateOptions.test.ts` to check `options.bgColor` cleanly without hardcoded `#ffffff` checks.
  - [x] Verify MCP schema and execution in `src/mcp.ts` does not assume a default for `bgColor`.
- [ ] **Frame Rendering & Color Keying**
  - [ ] In `src/index.ts` (`createFrames`), implement color keying for transparent frames when `bgColor` is specified and format requires color keying.
  - [ ] Add CLI integration test in `tests/cli.spec.ts` for transparent GIF with `--bg-color` verifying edge/pixel keying.
- [ ] **Documentation & Schemas**
  - [ ] Update `docs/CLI.md` for `--resolution`, `--width`/`--height`, and `--bg-color`.
  - [ ] Update `docs/MCP.md` for resolution, dimensions, and `bgColor`.
  - [ ] Update tool parameter descriptions in `src/mcp.ts`.
  - [ ] Audit `README.md` and `docs/ARCHITECTURE.md` if applicable.

## 🧪 Verification Plan

- [ ] Unit Tests: `npm run test` (including `validateOptions.test.ts` and `registry.test.ts`).
- [ ] CLI Integration Tests: `npm run test:cli` (including new transparent GIF with `--bg-color` test).
- [ ] Lint & Typecheck: `npm run lint` and `npm run type-check`.

## 📝 Change Log

- 2026-10-16: Initial spec created for CLI/MCP option validation alignment, color keying, and documentation updates.
