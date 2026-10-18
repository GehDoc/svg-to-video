# Spec: CLI & MCP Option Constraints, Color Keying, and Resolution Simplification

**Pull Request**: [#222](https://github.com/GehDoc/svg-to-video/pull/222)
**Status**: 🟢 Completed

## 🎯 Objective

Remove the default `#ffffff` assignment for `--bg-color` across the CLI and MCP interfaces, implement color-keying during frame rendering for transparent GIFs when `--bg-color` is supplied to achieve parity with Web Studio (mutualized via `shared/canvasCompositing.ts`), simplify the resolution API by removing the redundant `custom` preset and `--width`/`--height` flags in favor of `--resolution <preset|WIDTHxHEIGHT>`, and update documentation and tool schemas.

## 🛠 Technical Strategy

- **Core Technologies**: Node.js, Puppeteer, HTML5 Canvas, Commander, FFmpeg.
- **Architecture**: Shared compositing helper (`shared/canvasCompositing.ts`), CLI (`src/index.ts`), Model Context Protocol server (`src/mcp.ts`), Web Studio (`web/src/hooks/useRenderer.ts`).
- **Option Handling & Resolution Simplification**:
  - Remove `'#ffffff'` default from `--bg-color` in `src/index.ts`. `options.bgColor` is `undefined` when omitted.
  - Simplify resolution options: eliminate `--width`, `--height`, and the `custom` preset. Custom dimensions are passed directly to `--resolution <WIDTHxHEIGHT>` (e.g., `1080x1920`, `1080x1080`).
  - In `src/utils/validateOptions.ts`, check `options.resolution` against presets `['original', '1080p', '720p']` or `^\d+x\d+$`.
  - In `src/utils/validateOptions.ts`, reject `--bg-color` with `--transparent` only when `!generator.needsColorKeying`.
  - In `src/mcp.ts`, align `render_svg_to_video` schema: remove `width` and `height`, update `resolution` to accept presets or `WIDTHxHEIGHT`, remove default from `bgColor`.
- **Rendering & Color Keying**:
  - Shared compositing function `compositeFrame(ctx, imageSource, width, height, bgColor, transparent, needsColorKeying)` in `shared/canvasCompositing.ts`.
  - In Web Studio (`web/src/hooks/useRenderer.ts`), refactored frame compositing to use `compositeFrame`.
  - In CLI (`src/index.ts` `createFrames`), when `transparent && bgColor && needsColorKeying` (GIF), execute canvas compositing inside Puppeteer using `compositeFrame` logic (`source-in` fill followed by `source-over` image).
- **Documentation & Schemas**:
  - Updated `docs/CLI.md`, `docs/MCP.md`, `README.md`, and `skills/svg-to-video/SKILL.md` to document simplified resolution syntax (`WIDTHxHEIGHT`), `--bg-color` without default, and GIF keying behavior.
  - Regenerated `web/src/data/seoDocumentation.json` via `generate-seo-data.ts`.

## ✅ Task List

- [x] **CLI & Option Validation**
  - [x] Remove default `'#ffffff'` from `--bg-color` option definition in `src/index.ts`.
  - [x] Simplify resolution options: remove `--width`, `--height`, and `custom` preset; enforce `original|1080p|720p|WIDTHxHEIGHT`.
  - [x] Update `src/utils/validateOptions.ts` and `src/utils/validateOptions.test.ts`.
  - [x] Align MCP schema and execution in `src/mcp.ts`.
- [x] **Frame Rendering & Color Keying**
  - [x] Extract and test `compositeFrame` helper in `shared/canvasCompositing.ts`.
  - [x] Refactor `web/src/hooks/useRenderer.ts` to use `compositeFrame`.
  - [x] In `src/index.ts` (`createFrames`), implement color keying for transparent frames when `bgColor` is specified and format requires color keying.
  - [x] Add CLI integration test in `tests/cli.spec.ts` for transparent GIF with `--bg-color` verifying edge/pixel keying.
- [x] **Documentation & Schemas**
  - [x] Update `docs/CLI.md` for `--resolution` (preserves `WIDTHxHEIGHT`, removes `--width`/`--height`) and `--bg-color`.
  - [x] Update `docs/MCP.md` for resolution, dimensions, and `bgColor`.
  - [x] Update tool parameter descriptions in `src/mcp.ts`.
  - [x] Update `README.md` and `skills/svg-to-video/SKILL.md`.
  - [x] Regenerate `web/src/data/seoDocumentation.json`.

## 🧪 Verification Plan

- [x] Unit Tests: `npm run test:unit` (including `validateOptions.test.ts`, `shared/canvasCompositing.test.ts`, and web tests).
- [x] CLI Integration Tests: `npm run test:cli` (including transparent GIF with `--bg-color` keying test and resolution tests).
- [x] MCP Integration Tests: `npm run test:mcp` (including custom resolution `1080x1080`).
- [x] Lint, Format & Typecheck: `npm run check:fast` (all pass).
- [x] Build: `npm run build` (clean compilation).

## 📝 Change Log

- 2026-10-16: Initial spec created for CLI/MCP option validation alignment, color keying, and documentation updates.
- 2026-10-17: Mutualized canvas compositing with Web Studio in `shared/canvasCompositing.ts`.
- 2026-10-17: Simplified resolution API by removing `custom`, `--width`, and `--height` in favor of `--resolution WIDTHxHEIGHT`.
- 2026-10-18: Completed all documentation updates, tests, and verification.
