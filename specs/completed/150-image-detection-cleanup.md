# Spec: 150 - Image Detection Cleanup

**GitHub Issue**: [#150](https://github.com/GehDoc/svg-to-video/issues/150)
**Status**: 🟢 Completed

## 🎯 Objective

Extract `parseSvgDimensions` into `@shared/analyzeSvgAnimation` so that CLI and MCP share SVG dimension and duration detection logic, and ensure the CLI sends complete `file-load` telemetry payload properties.

## 🛠 Technical Strategy

- **Shared Dimension Parser**: Export `parseSvgDimensions` from `shared/analyzeSvgAnimation.ts` accepting an optional `DOMParser` override (for Node environments via JSDOM or browser native `DOMParser`).
- **Telemetry Payload**: In CLI (`src/index.ts`), parse SVG dimensions and duration prior to sending the `file-load` event, supplying accurate values for `detectedDuration`, `hasAnimation`, `aspectRatio`, and `isDimensionsDetected`.
- **MCP Synchronization**: Refactor `src/mcp.ts` to utilize `parseSvgDimensions` for SVG inspection (`inspect_svg_animation`) and analytics.
- **Web Studio Integration**: Update `web/src/hooks/useRenderer.ts`, `web/src/components/Studio.tsx`, and `web/src/hooks/useRenderer.test.ts` to import `parseSvgDimensions` from `@shared/analyzeSvgAnimation`.

## ✅ Task List

- [x] **Shared Core Logic**
  - [x] Implement and export `parseSvgDimensions` in `shared/analyzeSvgAnimation.ts`
  - [x] Add unit tests for `parseSvgDimensions` in `shared/analyzeSvgAnimation.test.ts`
- [x] **Web Studio Integration**
  - [x] Update `web/src/hooks/useRenderer.ts`, `web/src/components/Studio.tsx`, and `web/src/hooks/useRenderer.test.ts`
- [x] **CLI & MCP Analytics & Image Detection**
  - [x] Update CLI (`src/index.ts`) to use `parseSvgDimensions` and calculate duration before tracking `file-load`
  - [x] Update MCP (`src/mcp.ts`) to use `parseSvgDimensions` in `inspect_svg_animation`
- [x] **Documentation & SEO**
  - [x] Audit `README.md` and documentation if necessary
  - [x] Audit package metadata

## 🧪 Verification Plan

- [x] Unit Tests: `npm run test:unit`
- [x] Web Unit Tests: `npm run test:unit -w web`
- [x] Linting & Type-checking: `npm run check:fast`

## 📝 Change Log

- _2026-09-22: Initial spec created for issue #150 by Jules._
- _2026-09-22: Extracted parseSvgDimensions into shared library, updated CLI, MCP, Web Studio, and added unit tests._
