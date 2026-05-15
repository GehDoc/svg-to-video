# Architecture Guide

This document covers the project's technical design, rendering engine, and infrastructure deep-dives.

## 🎨 High-Fidelity SVG Rendering (Bake & Clean)

The `SvgRenderer` uses a specialized "Bake & Clean" algorithm to capture frame-accurate snapshots of SVGs, particularly those with complex CSS or SMIL animations.

### The Challenge

Standard methods like `cloneNode` and `XMLSerializer` often fail to capture the active state of a CSS animation because:

1.  **Browser Optimizations**: The animation engine may not apply computed styles to cloned nodes in the same way as live nodes.
2.  **Style Overrides**: When serializing an SVG with an internal `<style>` block, the original CSS rules (like `@keyframes`) can conflict with or override the static state we intend to capture.
3.  **Dynamic Tags**: Tags like `<script>` or `<animate>` can trigger side effects or "re-run" animations when drawn to a canvas.

### The Solution: Bake & Clean

The renderer (implemented in `web/src/components/SvgRenderer/renderer.js`) follows these steps for every frame capture:

1.  **Baking**:
    - Iterate through all elements in the live SVG.
    - Retrieve the current visual state using `window.getComputedStyle(el)`.
    - Explicitly copy these computed properties (including the animated `transform` matrix) directly onto the cloned element's inline `style` attribute.
    - This "freezes" the current frame's visual representation into the DOM structure.
2.  **Cleaning**:
    - Once the visual state is baked, remove all dynamic and conflicting tags from the clone: `<style>`, `<script>`, `<animate>`, `<animateTransform>`, `<animateMotion>`, and `<set>`.
    - Removing `<style>` is critical to ensure the browser's CSS engine doesn't attempt to re-apply animations to our static "baked" elements.
3.  **Serialization**:
    - The resulting "inert" SVG clone is serialized to an XML string and drawn onto a canvas via an `Image` object for final frame extraction.

This strategy ensures that what the user sees in the "Live Monitor" is exactly what is captured in the final video output.

## 📸 Visual Regression Testing

The `SvgRenderer` component is monitored for visual regressions using native Vitest matchers.

### Running Visual Tests

Snapshots are captured in a headless browser (Chromium) to ensure frame-accurate rendering consistency across different environments.

```bash
# In the web/ directory
npm run test:visual
```

### Updating Baselines

When intentional changes are made to the rendering logic, update the stored snapshots:

```bash
# In the root or web/ directory
npm run test:visual:update
```

### Configuring Pixel-Match Thresholds

To adjust the sensitivity of the visual comparison (e.g., to ignore minor anti-aliasing differences), you can provide a threshold in the visual test configuration:

```typescript
// Example: web/vitest.visual.config.ts
screenshotOptions: {
  threshold: 0.1, // Allow 10% pixel difference
}
```

## 🎥 Extending Output Formats and Transparency Support

This section documents how to add new output formats and manage the alpha channel for transparency.

### Adding New Formats

1.  **Format Support**: Ensure the new format is supported by `mediabunny`.
2.  **Dependencies**: In `web/src/hooks/useRenderer.ts`, update the `getBestCodec` and `render` functions to handle the new `OutputFormat` class.
3.  **UI Dependencies**: Update `isTransparencySupported` in `web/src/utils/isTransparencySupported.ts` to reflect if the format supports transparency.

### Handling Transparency (Alpha Channel)

- **Canvas Initialization**: Always use `canvas.getContext('2d', { alpha: true })` for transparency support. For non-transparent exports, explicitly fill the background with the chosen color.
- **Encoder Configuration**: When using transparency, ensure `alpha: 'keep'` is passed to the `CanvasSource` configuration.
- **Renderer Script**: The internal renderer iframe must clear the canvas (`ctx.clearRect`) instead of filling it when `isTransparent` is true.

### Verification of Transparency

To verify if an export correctly contains an alpha channel:

1.  **Metadata Check**: Use `ffprobe`:
    ```bash
    ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt -of default=noprint_wrappers=1:nokey=1 your-video.webm
    ```
    An output of `yuva420p` or `ya8` confirms alpha support.
2.  **Visual Test**: Import the video into an editor like Figma or DaVinci Resolve and place it over a colored background layer.

### UI Dependency Logic

The `ConfigPanel` implements a two-way dependency:

- **Format Change**: Changing format to one that doesn't support transparency disables the "Transparent Background" checkbox.
- **Transparency Toggle**: Checking "Transparent Background" filters the format dropdown to only show supported formats.

Use the `ConfigPanel.test.tsx` to verify this logic.

## 🔍 Maintaining SEO & Metadata

When adding new features or core capabilities, ensure all public-facing metadata is updated to maintain discoverability and clarity.

### SEO Checklist

1.  **`web/index.html`**:
    - Update `<meta name="description">` with new capabilities.
    - Update Open Graph tags (`og:title`, `og:description`, `og:seeAlso`) for social sharing and repository linking.
    - Enrich the **JSON-LD** script (`application/ld+json`) by updating the `description`, extending the `featureList`, and ensuring `codeRepository` and `license` fields point to the current project.
2.  **`package.json` (Root & Web)**:
    - Update the `description` field to reflect the expanded toolset.
    - Add relevant keywords to the `keywords` array in the root `package.json`.
3.  **`README.md`**:
    - Update the introduction and **🌟 Why SVG to Video?** sections.
    - Add new features to the **🛠 Features** list.
    - Update the **Technical Details** or **Quick Start** if user workflows have changed.
4.  **GitHub Repository**:
    - Update the repository **Description** in the "About" section.
    - Review and add new **Topics** (tags) to match the updated keywords.
