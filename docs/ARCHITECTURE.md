# Architecture Guide

This document covers the project's technical design, rendering engine, and infrastructure deep-dives.

## 🌐 Web Studio Architecture (Next.js App Router)

The Web Studio is built using **Next.js (App Router)** to provide a hybrid rendering model that optimizes for both SEO and heavy client-side computation.

### Hybrid Rendering Strategy

- **Server-Side Rendering (SSR)**: The landing page structure, meta tags, and critical CSS are pre-rendered on the server. This ensures that search engines can crawl the application's version and feature set.
- **Client-Side Rendering (CSR)**: The core conversion engine (Studio) is isolated as a client-side component. This is necessary because the Studio relies heavily on browser-only APIs such as `WebCodecs`, `Canvas`, and `SharedArrayBuffer`.

### Handling Browser-Only APIs

To prevent hydration mismatches and server-side crashes, browser-only logic is handled in three ways:

1.  **Dynamic Imports**: The `Studio` component is imported using `next/dynamic` with `ssr: false`.
2.  **SSR Guards**: Critical utilities (like transparency support checks) use a "guard" pattern:
    ```typescript
    if (typeof window === 'undefined') return false;
    ```
3.  **Client Directives**: Components that use hooks or browser events are marked with the `"use client"` directive at the top of the file.

### Security Headers (COOP/COEP)

The Studio requires `SharedArrayBuffer` for high-performance video encoding. For this to work in modern browsers, the site must be "Cross-Origin Isolated". This is achieved by serving the following headers:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp`

In development, these are configured in `next.config.js`. In production (GitHub Pages), we utilize the `coi-serviceworker.js` to intercept requests and apply these headers on the client side.

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

The project uses a **Registry of Format Factories** to decouple the rendering engine from specific encoder implementations.

1.  **Encoder Implementation**: Create a new encoder class (if needed) in `web/src/utils/encoders/` that implements the `VideoEncoder` interface.
2.  **Format Factory**: Implement a new `VideoFormat` class (usually extending `BaseFormat` for sensible defaults) in the same file as your encoder.
    - Define properties like `id`, `label`, `extension`, `mimeType`.
    - Set `supportsAlpha` and `needsColorKeying` as needed.
3.  **Registration**: Export your format instance(s) and register them in `web/src/utils/discoverFormats.ts` within the `registerFormats` function.

```typescript
// Example: web/src/utils/discoverFormats.ts
const registerFormats = () => {
  if (formatRegistry.getAllFormats().length > 0) return;
  // ...
  formatRegistry.register(new MyNewFormat());
};
```

### Handling Transparency (Alpha Channel)

- **Canvas Initialization**: Always use `canvas.getContext('2d', { alpha: true })` for transparency support. For non-transparent exports, explicitly fill the background with the chosen color.
- **Encoder Configuration**: When using transparency, ensure `alpha: 'keep'` is passed to the `CanvasSource` configuration.
- **GIF Transparency**: The `GifEncoder` uses a palette reservation strategy. When transparency is enabled, visible colors are quantized to 255 slots, leaving the 256th slot guaranteed for the fully transparent color (`rgba(0,0,0,0)`). This ensures robust transparency even in color-rich animations.
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

## 🚀 CI/CD Pipeline Design

The `svg-to-video` CI/CD pipeline is designed for high-performance and reliable releases.

### Design Principles

1. **Independent Parallelization**: All CI jobs run concurrently. Test suites are decoupled, ensuring that a slow test suite doesn't throttle the entire pipeline.
2. **Production-Gated Deployment**: Deployment to GitHub Pages is gated by the success of all critical test jobs. This ensures only fully validated code reaches the production environment.
3. **Dependency Synchronization**: We use `actions/cache` keyed on `package-lock.json` to synchronize `node_modules` across parallel jobs. This is more robust than artifact sharing as it preserves binary integrity and path resolution.
4. **Environment Consistency**: By using `docker compose` to run CLI tests, we ensure the rendering engine is tested in a consistent, containerized environment that matches production.

### Workflow Orchestration

- **`ci.yml`**: Defines the parallel test matrix. The `build-web` job acts as a production-build smoke-test (skipped on `main` to avoid redundant builds during deployment).
- **`deploy.yml`**: Triggers only on `main` merges. It builds the project from source and deploys the assets only after all CI test jobs have successfully passed.
