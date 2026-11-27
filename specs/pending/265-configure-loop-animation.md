# Spec: 265 - Configure Animation Looping and Duration Controls

**GitHub Issue**: [#265](https://github.com/GehDoc/svg-to-video/issues/265)
**Status**: 🟡 To be reviewed

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
      - To prevent UI layout hiccups and jitter, the "Loop Animation" checkbox is **always rendered** in Section 2 (Format) and disabled (`disabled={isOptionsDisabled || !getFormatById(format)?.supportsLoop}`) when the active format does not support looping.
      - Add a "Reset to detected duration" button next to the duration input when a detected duration exists and differs from current duration (non-shifting inline alignment).
      - Apply a visual warning indicator and border styling when the detected or configured duration exceeds 5 minutes (300 seconds).
    - In `SuccessView`:
      - Pass `loop={loop}` to `<video>` preview element so preview playback respects the user's loop selection.
- **State Architecture & Source of Truth**:
  - Single source of truth for configuration is `useStudioState` reducer and `DEFAULT_STUDIO_CONFIG` in `web/src/types/studio.ts`.
  - Atomic reset contract preserved via `RESET_STUDIO` action.
- **UI, Interaction & Motion Budget**:
  - Layout stability: Loop Animation checkbox is always present (disabled for video formats) and duration reset button is inline, preventing UI layout shifts and control movement.
  - CSS hygiene: Zero `!important`; use semantic CSS variables (e.g. `var(--text-muted)`, `var(--panel-border)`, `var(--warning-border, #f59e0b)`, `var(--warning-text, #92400e)`) from `web/src/styles/`.
  - Motion budget: Smooth opacity transitions without bouncing or scaling hover effects.

## ✅ Task List

- [x] **Infrastructure & Shared Capabilities**
  - [x] Add `supportsLoop: boolean` to `FormatCapability` interface and definitions in `shared/formatCapabilities.ts` (`gif`: true, `apng`: true, others: false)
  - [x] Update `shared/formatCapabilities.test.ts` to verify `supportsLoop` for all formats
  - [x] Expose `supportsLoop` in `BaseCLIFormatGenerator`, `BaseFormat`, and `discoverFormats.ts`
- [x] **CLI & MCP Looping Support**
  - [x] Add `--loop <count>` and `--no-loop` flags in CLI options (`src/index.ts` & `src/utils/validateOptions.ts`)
  - [x] Add `loop` parameter to `render_svg_to_video` schema in `src/mcp.ts`
  - [x] Update `GifFormatGenerator.ts` to output appropriate `-loop` argument based on options
  - [x] Update `ApngFormatGenerator.ts` to output appropriate `-plays` argument based on options
  - [x] Add CLI and MCP integration tests for loop options (`tests/cli.spec.ts`, `tests/mcp.spec.ts`)
- [x] **Web Studio Encoders & Architecture**
  - [x] Update `EncoderOptions` in `web/src/utils/encoders/types.ts` to include `loop?: boolean`
  - [x] Update `GifEncoder.ts` to pass `repeat: -1` when `loop: false`, `0` when `loop: true`
  - [x] Create/update APNG helper in `shared/apngMetadataInjector.ts` or encoder to configure `num_plays` in `acTL` chunk with valid CRC32
  - [x] Add unit tests for `GifEncoder` and `ApngEncoder` verifying loop flag behavior
- [x] **Web Studio State & UI Integration (Zero-Shift Refinement)**
  - [x] Update `StudioSourceState` to retain `detectedDuration` in `web/src/types/studio.ts` and `web/src/hooks/useStudioState.ts`
  - [x] Update `StudioConfig` and `DEFAULT_STUDIO_CONFIG` to include `loop: boolean` (default `true`)
  - [x] Update `ConfigPanel.tsx`:
    - [x] Always render "Loop Animation" toggle in Section 2, disabling it when `!supportsLoop` to eliminate layout shift / hiccups
    - [x] Add reset duration button when `detectedDuration` is available
    - [x] Add warning indicator and border styling when duration > 300 seconds (5 minutes)
  - [x] Update `ConfigPanel.scss` with semantic styles for warning state and duration reset button
  - [x] Update `SuccessView.tsx` to bind `<video loop={loop}>` dynamically
  - [x] Update Storybook stories and tests (`ConfigPanel.test.tsx`, `ConfigPanel.stories.tsx`)
- [x] **Documentation, Security & SEO Pre-Flight**
  - [x] Audit and update `README.md` (CLI usage options, Web Studio features)
  - [x] Audit and update `docs/CLI.md` and `docs/MCP.md` with `--loop`, `--no-loop`, and loop schema
  - [x] Audit `docs/ARCHITECTURE.md` (format capabilities and looping contract)
  - [x] Audit `docs/SECURITY.md` (type guards, argument sanitization)
  - [x] Audit `docs/ANALYTICS.md` (telemetry payload alignment if applicable)
  - [x] Audit `web/src/app/layout.tsx`, `web/src/components/SeoFallback.tsx`, and `package.json`
- [x] **Architecture & Maintainability Pre-Flight (`🟡 To be reviewed`)**
  - [x] Zero layout shift verified on format change
  - [x] Single source of truth and atomic state reset verified in `useStudioState`
  - [x] CSS hygiene verified (zero `!important`, design tokens used)
  - [x] Full automated test suite passing cleanly (`npm run check`)

## 🧪 Verification Plan

- [x] Unit Tests: `npm run test:unit` and `npm run test:unit -w web`
- [x] Storybook Tests: `npm run test:storybook -w web`
- [x] Fast Quality Checks: `npm run check:fast`

## 📝 Change Log

- 2026-11-27: Initial spec created for issue #265 by Antigravity.
- 2026-11-27: Implementation complete across shared capabilities, CLI/MCP generators, Web Studio encoders, and UI controls.
- 2026-11-28: UI/UX refinement per review: keep Loop Animation checkbox permanently rendered and disable it on unsupported formats to prevent layout shifts.
