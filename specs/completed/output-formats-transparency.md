# Specification: Add Output Formats and Transparency Support

Status: 🟢 Completed

## Objective

Enable users to select different output formats (MP4, WebM) and achieve a "Transparent Background" in the exported video by leveraging the Alpha Channel.

## Detailed UI/UX Flow

1. **Format Selector**: A dropdown to select output format (`MP4`, `WebM`).
2. **Transparency Toggle**: A checkbox for "Transparent Background".
   - **Behavior**: When checked, this acts as an explicit override. It disables the existing background color picker input. During the render, the background will be rendered with full transparency (alpha = 0). When unchecked, the background color picker is enabled, and the render uses that specific color.
3. **Dependency Logic & Hints**:
   - **Format Change**: If user selects a format that does _not_ support transparency (e.g., MP4), the Transparency toggle is unchecked and disabled, and a hint "Transparency only supported for WebM" is displayed.
   - **Transparency Toggle**: If user checks "Transparent Background", only formats supporting transparency (e.g., WebM) remain enabled in the Format dropdown. If a non-transparent format is forced, a hint "Transparency requires WebM format" is shown next to the format selector.
   - **Helper Method**: `isTransparencySupported(format: 'mp4' | 'webm'): boolean` centralizes this check.

## Technical Strategy

1. **Capability Detection**:
   - "Transparent Background" is achieved by encoding an **Alpha Channel** (`alpha: 'keep'` in `mediabunny`).
   - Use `mediabunny`'s `VideoEncodingAdditionalOptions.alpha = 'keep'` for WebM/Matroska.
2. **Renderer (`renderer.js`) Logic**:
   - If `transparent` is passed in `payload` to `CAPTURE`:
     - The renderer calls `ctx.clearRect(0, 0, width, height)` to ensure transparency is captured.
3. **`useRenderer.ts` Integration**:
   - Update `render()` function to dynamically choose `OutputFormat` (`WebMOutputFormat` or `Mp4OutputFormat`) and set `alpha` encoding options.
4. **State Management**:
   - `format` and `isTransparent` states stored in `StudioContext` with defaults (`format = 'mp4'`, `isTransparent = false`).
5. **Live Monitor Preview**:
   - When "Transparent Background" is checked, the `RendererMonitor` viewport applies a CSS checkerboard pattern to indicate transparency.
   - `SvgRenderer` handles the preview background dynamically: `iframe` background is set to `transparent`, while `RendererMonitor` handles the checkerboard or opaque background color.

## Task List

- [x] Implement `isTransparencySupported` utility.
- [x] Update `StudioContext` to store `format` and `isTransparent` state (with defaults).
- [x] Refactor `ConfigPanel`: Add dropdown, checkbox, and dependency-enforcing logic.
- [x] Modify `renderer.js`: Add conditional clear-canvas logic for `CAPTURE` event.
- [x] Modify `useRenderer.ts`: Update `render` method to dynamically initialize `OutputFormat` and set `alpha` encoding options.
- [x] Add unit tests for `useRenderer` format/alpha handling and utility helpers.
- [x] Add Storybook test for UI interaction.
