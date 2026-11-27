# Spec: 265 - Configure Animation Looping and Duration Controls

**GitHub Issue**: [#265](https://github.com/GehDoc/svg-to-video/issues/265)
**Status**: 🟠 Pending

## 🎯 Objective

Provide user control over animation looping (infinite vs. play-once / custom loop counts) for animated formats (GIF, aPNG) and preview playback across Web Studio, CLI, and MCP, while adding a duration reset button and >5-minute warning indicator in Web Studio.

## 🛠 Technical Strategy

- **Core Technologies**: TypeScript, FFmpeg, UPNG (`upng-js`), `gifenc`, React, Next.js, SCSS.
- **Architecture**:
  - **Shared Format Capabilities (`shared/formatCapabilities.ts`)**:
    - Add `supportsLoop: boolean` to `FormatCapability`.
    - Mark `gif` and `apng` as `supportsLoop: true`; video formats (`mp4`, `webm`, `mkv`, `mov`) as `supportsLoop: false`.
    - Surface `supportsLoop` through `BaseCLIFormatGenerator`, `BaseFormat`, and `discoverFormats.ts`.
  - **CLI & MCP Format Generators**:
    - Add `--loop <count>` option and `--no-loop` flag to CLI (`src/index.ts`).
    - Add `loop` parameter to MCP `render_svg_to_video` tool schema (`src/mcp.ts`).
    - Update `GifFormatGenerator`: pass `-loop 0` for infinite, `-loop -1` (or custom count) for play-once.
    - Update `ApngFormatGenerator`: pass `-plays 0` for infinite, `-plays 1` (or custom count) for play-once.
  - **Web Studio Encoders**:
    - Extend `EncoderOptions` with `loop?: boolean` (or `repeat?: number`).
    - `GifEncoder`: pass `repeat: loop === false ? -1 : 0` to `gifenc` (prevents Netscape loop extension when loop is disabled).
    - `ApngEncoder`: patch the `acTL` chunk in generated APNG buffer with `num_plays: loop === false ? 1 : 0` and recalculate CRC32.
  - **Web Studio State & UI**:
    - Store `detectedDuration?: number` in `StudioSourceState` when an SVG is loaded.
    - Add `loop: boolean` to `StudioConfig` and `DEFAULT_STUDIO_CONFIG` (defaulting to `true`).
    - In `ConfigPanel`:
      - Render "Loop Animation" checkbox toggle only when the active format capability has `supportsLoop: true`.
      - Add a "Reset to detected duration" button next to the duration input when a detected duration exists and differs from current duration.
      - Apply a visual warning indicator and border styling when the detected or configured duration exceeds 5 minutes (300 seconds).
    - In `SuccessView`:
      - Pass `loop={loop}` to `<video>` preview element so preview playback respects the user's loop selection.
- **State Architecture & Source of Truth**:
  - Single source of truth for configuration is `useStudioState` reducer and `DEFAULT_STUDIO_CONFIG` in `web/src/types/studio.ts`.
  - Atomic reset contract preserved via `RESET_STUDIO` action.
- **UI, Interaction & Motion Budget**:
  - Layout stability: Duration reset button and warning indicator use persistent, non-shifting layouts.
  - CSS hygiene: Zero `!important`; use semantic CSS variables (e.g. `var(--text-muted)`, `var(--panel-border)`, `var(--warning, #f59e0b)`) from `web/src/styles/`.
  - Motion budget: Smooth opacity transitions without bouncing or scaling hover effects.

## ✅ Task List

- [ ] **Infrastructure & Shared Capabilities**
  - [ ] Add `supportsLoop: boolean` to `FormatCapability` interface and definitions in `shared/formatCapabilities.ts` (`gif`: true, `apng`: true, others: false)
  - [ ] Update `shared/formatCapabilities.test.ts` to verify `supportsLoop` for all formats
  - [ ] Expose `supportsLoop` in `BaseCLIFormatGenerator`, `BaseFormat`, and `discoverFormats.ts`
- [ ] **CLI & MCP Looping Support**
  - [ ] Add `--loop <count>` and `--no-loop` flags in CLI options (`src/index.ts` & `src/utils/validateOptions.ts`)
  - [ ] Add `loop` parameter to `render_svg_to_video` schema in `src/mcp.ts`
  - [ ] Update `GifFormatGenerator.ts` to output appropriate `-loop` argument based on options
  - [ ] Update `ApngFormatGenerator.ts` to output appropriate `-plays` argument based on options
  - [ ] Add CLI and MCP integration tests for loop options (`tests/cli.spec.ts`, `tests/mcp.spec.ts`)
- [ ] **Web Studio Encoders & Architecture**
  - [ ] Update `EncoderOptions` in `web/src/utils/encoders/types.ts` to include `loop?: boolean`
  - [ ] Update `GifEncoder.ts` to pass `repeat: -1` when `loop: false`, `0` when `loop: true`
  - [ ] Create/update APNG helper in `shared/apngMetadataInjector.ts` or encoder to configure `num_plays` in `acTL` chunk with valid CRC32
  - [ ] Add unit tests for `GifEncoder` and `ApngEncoder` verifying loop flag behavior
- [ ] **Web Studio State & UI Integration**
  - [ ] Update `StudioSourceState` to retain `detectedDuration` in `web/src/types/studio.ts` and `web/src/hooks/useStudioState.ts`
  - [ ] Update `StudioConfig` and `DEFAULT_STUDIO_CONFIG` to include `loop: boolean` (default `true`)
  - [ ] Update `ConfigPanel.tsx`:
    - [ ] Render "Loop Animation" toggle when `supportsLoop` is true for selected format
    - [ ] Add reset duration button when `detectedDuration` is available
    - [ ] Add warning indicator and border styling when duration > 300 seconds (5 minutes)
  - [ ] Update `ConfigPanel.scss` with semantic styles for warning state and duration reset button
  - [ ] Update `SuccessView.tsx` to bind `<video loop={loop}>` dynamically
  - [ ] Update Storybook stories and tests (`ConfigPanel.test.tsx`, `ConfigPanel.stories.tsx`, `SuccessView.test.tsx`)
- [ ] **Documentation, Security & SEO Pre-Flight**
  - [ ] Audit and update `README.md` (CLI usage options, Web Studio features)
  - [ ] Audit and update `docs/CLI.md` and `docs/MCP.md` with `--loop`, `--no-loop`, and loop schema
  - [ ] Audit `docs/ARCHITECTURE.md` (format capabilities and looping contract)
  - [ ] Audit `docs/SECURITY.md` (type guards, argument sanitization)
  - [ ] Audit `docs/ANALYTICS.md` (telemetry payload alignment if applicable)
  - [ ] Audit `web/src/app/layout.tsx`, `web/src/components/SeoFallback.tsx`, and `package.json`
- [ ] **Architecture & Maintainability Pre-Flight (`🟡 To be reviewed`)**
  - [ ] Single source of truth and atomic state reset verified in `useStudioState`
  - [ ] CSS hygiene verified (zero `!important`, design tokens used)
  - [ ] UI layout stability and motion budget verified
  - [ ] Full automated test suite passing cleanly (`npm run check`)

## 🧪 Verification Plan

- [ ] Unit Tests: `npm run test:unit` and `npm run test:unit -w web`
- [ ] CLI Tests: `npm run test:cli`
- [ ] MCP Tests: `npm run test:mcp`
- [ ] Fast Quality Checks: `npm run check:fast`
- [ ] Web Studio Component Tests & Storybook: `npm run test:storybook -w web`
- [ ] Full Verification: `npm run check`

## 📝 Change Log

- 2026-11-27: Initial spec created for issue #265 by Antigravity.
