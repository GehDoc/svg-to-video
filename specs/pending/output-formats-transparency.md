# Specification: Add Output Formats and Transparency Support

## Objective

Enable users to select different output formats (MP4, WebM) and achieve a "Transparent Background" in the exported video by leveraging the Alpha Channel.

## Detailed UI/UX Flow

1. **Format Selector**: A dropdown to select output format (`MP4`, `WebM`).
2. **Transparency Toggle**: A checkbox for "Transparent Background".
   - **Behavior**: When checked, this acts as an explicit override. It disables the existing background color picker input. During the render, the background will be rendered with full transparency (alpha = 0). When unchecked, the background color picker is enabled, and the render uses that specific color. This simplifies the UI compared to an RGBA color picker.
3. **Dependency Logic & Hints**:
   - **Format Change**: If user selects a format that does _not_ support transparency (e.g., MP4), the Transparency toggle is unchecked and disabled, and a hint "Transparency only supported for WebM" is displayed.
   - **Transparency Toggle**: If user checks "Transparent Background", only formats supporting transparency (e.g., WebM) remain enabled in the Format dropdown. If a non-transparent format is forced, a hint "Transparency requires WebM format" is shown next to the format selector.
   - **Helper Method**: `isTransparencySupported(format: 'mp4' | 'webm'): boolean` will centralize this check.

## Technical Strategy

1. **Capability Detection**:
   - "Transparent Background" is achieved by encoding an **Alpha Channel** (`alpha: 'keep'` in `mediabunny`).
   - Centralize format/codec mapping.
   - Use `mediabunny`'s `VideoEncodingAdditionalOptions.alpha = 'keep'` for WebM/Matroska, which preserves the alpha channel, allowing the final video to be transparent where background elements would otherwise be filled.
2. **Renderer (`renderer.js`) Logic**:
   - If `transparent` is passed in `payload` to `CAPTURE`:
     - Instead of `ctx.fillStyle = backgroundColor; ctx.fillRect(...)`, the renderer will call `ctx.clearRect(0, 0, width, height)`.
   - This clears the canvas (alpha = 0), allowing the Alpha Channel to be captured and passed to the encoder.
3. **`useRenderer.ts` Integration**:
   - Update `render()` function to dynamically choose `OutputFormat`:
     ```typescript
     const format =
       settings.format === 'webm'
         ? new WebMOutputFormat()
         : new Mp4OutputFormat();
     const encoderOptions = {
       alpha: settings.transparent ? 'keep' : 'discard',
     };
     ```
   - Pass `alpha` option into `mediabunny`'s codec initialization logic.
4. **State Management**:
   - Add `format` and `isTransparent` to `StudioContext`.
   - `ConfigPanel` will consume these fields and enforce the dependency logic via `useEffect` or computed properties.
5. **Live Monitor Preview**:
   - When "Transparent Background" is checked, the `RendererMonitor` viewport will apply a CSS checkerboard background pattern (e.g., using `background-image: repeating-conic-gradient(...)`) to clearly indicate that the background is transparent.
   - This provides a visual cue that aligns with industry standards for transparency.

6. **Initialization**:
   - Default state: `format = 'mp4'`, `isTransparent = false`.
   - These defaults are set in `StudioContext` initialization to ensure a predictable user experience.

## Task List

- [ ] Implement `isTransparencySupported` utility.
- [ ] Update `StudioContext` to store `format` and `isTransparent` state (with defaults).
- [ ] Refactor `ConfigPanel`: Add dropdown, checkbox, and dependency-enforcing logic.
- [ ] Modify `renderer.js`: Add conditional clear-canvas logic for `CAPTURE` event.
- [ ] Modify `useRenderer.ts`: Update `render` method to dynamically initialize `OutputFormat` and set `alpha` encoding options.
- [ ] Add unit tests for `useRenderer` format/alpha handling.
- [ ] Add Storybook test for UI interaction.
