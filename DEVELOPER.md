# Developer Guide

Welcome! This repository uses **Spec-Driven Development (SDD)** to maintain a clear roadmap and assist AI agents in understanding project state.

## 🧭 Project Navigation

- **User Instructions**: See [README.md](./README.md).
- **AI Agent Protocol**: See [AGENTS.md](./AGENTS.md).
- **Active Roadmap**: Check [specs/pending/](./specs/pending/).

## 🔄 Workflow & Automation

### 🚦 Type Safety & Commit Hooks

To prevent the introduction of breaking changes, the project uses **Husky** to enforce type safety:

- **Pre-commit**: The `.husky/pre-commit` hook automatically runs `npm run type-check` alongside linting and formatting. Commits will fail if `tsc` detects any errors.
- **Manual Check**: You can always run `npm run check:fast` to validate types, linting, and formatting locally.

### 📦 Dependency Management (Vitest & Storybook)

This project requires strict version alignment between **Storybook** and **Vitest** to avoid `Mock` type mismatches.

- **The Problem**: Storybook's `composeStories` often pulls in an internal version of `@vitest/spy` that can conflict with the project's direct Vitest dependency, leading to "Type 'Mock' is not assignable" errors in tests.
- **The Solution**: We use the `overrides` field in the root `package.json` to force a unified version for all Vitest-related packages:
  ```json
  "overrides": {
    "vitest": "4.1.4",
    "@vitest/spy": "4.1.4",
    "@vitest/expect": "4.1.4",
    ...
  }
  ```
- **Future Upgrades**: When upgrading Storybook or Vitest, ensure all `@vitest/*` packages in the `overrides` section are updated to the same version. Run `rm -rf node_modules package-lock.json && npm install` to ensure the dependency tree is correctly rebuilt.

### 🤖 Starting with an AI Agent (Recommended)

To initiate a new feature, simply provide the following command to your AI collaborator:

> "Read AGENTS.md and start a plan for GitHub Issue #XX"

**The Agent will automatically:**

1. Create a new branch: `feat/XX-short-description`.
2. Initialize the spec file in `specs/pending/` from the template.
3. Commit the initial spec to the branch and wait for your approval.

### 🧑‍💻 Manual Workflow

If working without an agent, follow these steps to keep the project state synchronized:

1.  **Branching**: Create a feature branch from `main`: `git checkout -b feat/XX-description`.
2.  **Spec-First**: Create a Spec file in `specs/pending/` using the [specs/template.md](./specs/template.md).
3.  **Implement & Trace**: Write code, keeping the spec's **Task List** `[x]` updated. Update the **Technical Strategy** if the approach deviates from the plan.
4.  **Verify**:
    - Ensure all tasks in the spec are marked as complete.
    - Run the full verification suite: `npm run check`.
    - Document the successful verification in the spec's **Change Log**.
5.  **Archive**: Update the **Status** to `🟢 Completed`, move the spec to `specs/completed/`, and merge your branch.

## 🛠 Development Commands

| `npm run check` | Runs all checks (lint, format, type-check, e2e tests). |
| `npm run check:fast` | Runs fast checks only (lint, format, type-check). |
| `npm run fix` | Auto-fixes linting and formatting issues. |
| `npm run lint` | Checks for linting issues in both CLI and Web Studio code. |
| `npm run lint:fix` | Fixes linting issues in both CLI and Web Studio code. |
| `npm run storybook` | Launches the Storybook UI for component development. |
| `npm run format` | Checks for formatting issues. |
| `npm run format:fix` | Fixes formatting issues. |
| `npm run test` | Runs all tests (CLI, Web Studio E2E, Unit, Storybook, and Visual). |
| `npm run test:unit` | Runs component-level unit tests using Vitest. |
| `npm run test:storybook` | Runs Storybook interaction tests using Vitest. |
| `npm run test:visual` | Runs native visual regression tests (pixel matching). |
| `npm run test:visual:update` | Updates visual regression baseline screenshots. |
| `npm run build-storybook` | Builds the Storybook static site for deployment. |
| `npm run type-check` | Validates TypeScript types. |

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

## 🧪 Testing Strategy

Beyond end-to-end testing, we use a multi-tiered strategy for component, accessibility, and visual validation:

1.  **Unit Tests (`*.test.[ts|tsx]`)**: Validate logic, utilities, and basic component interaction using Vitest and JSDOM. These are fast and do not require a browser.
    - **Command**: `npm run test:unit`
2.  **Visual Regression Tests (`*.spec.[ts|tsx]`)**: Validate component-level rendering and pixel-perfect consistency in a real browser (Chromium) using Vitest and Playwright.
    - **Command**: `npm run test:visual`
3.  **End-to-End (E2E) Tests (`tests/**/\*.spec.[ts|tsx]`)\*\*: Validate full user workflows (e.g., "User opens app, uploads SVG, exports video") using Playwright directly.
    - **Command**: `npm run test`
4.  **Storybook Interaction & A11y Tests**: Validate visual/accessibility compliance (e.g., color contrast) and component interactions in isolation.
    - **Command**: `npm run test:storybook`

### 🗂 Test Organization

- **Unit Tests**: Co-located with components/utilities in `web/src/`.
- **Visual Regression Tests**: Co-located with components in `web/src/`.
- **E2E Tests**: Located in `web/tests/`.
- **Storybook Tests**: Located in `web/src/**/*.stories.tsx` (validated by `test-storybook`).

### Accessibility Audits

We use `addon-a11y` within Storybook. To ensure consistent results:

- **Manual Audit**: Use the "Accessibility" panel in the Storybook UI.
- **Automated Audit**: Run the Storybook interaction test suite via the official `@storybook/test-runner`.

```bash
# Run real-browser accessibility and interaction tests
npm run test:storybook
```

_Note: Avoid using `jest-axe` in JSDOM unit tests, as it cannot calculate computed styles and will miss contrast violations._

### 🐳 Docker & Hardening

The project includes a hardened Dockerfile for both development and production use.

### ⚙️ Continuous Integration (CI)

The project uses GitHub Actions for automated verification. Key pipeline steps include:

- **Build Verification**: Every PR is built in a production-like environment (`npm run build -w web`) to ensure asset resolution stability.
- **Fast Checks**: Linting, formatting, and type-checking via `npm run check:fast`.
- **E2E/Visual Tests**: Full CLI and Web Studio test suites (including Storybook interactions and pixel-matching visual regressions).

## 🌐 Web Studio Deployment

The Web Studio and Storybook Gallery are configured to deploy automatically to **GitHub Pages** via GitHub Actions.

- **Web Studio**: [https://gehdoc.github.io/svg-to-video/](https://gehdoc.github.io/svg-to-video/)
- **Storybook Gallery**: [https://gehdoc.github.io/svg-to-video/storybook/](https://gehdoc.github.io/svg-to-video/storybook/)
- **Asset Pathing**: The project uses an environment-aware `base` path (`/svg-to-video/`) in `web/vite.config.ts`. This ensures all assets load correctly when deployed as a GitHub Project Site.
- **CI Pipeline**: Deployment is triggered automatically on pushes to the `main` branch via `.github/workflows/deploy.yml`.

### 📊 Analytics (Umami)

### 📊 Analytics (Umami)

The Web Studio uses [Umami Analytics](https://umami.is/) for anonymous usage tracking. Detailed information about tracked events can be found in [docs/ANALYTICS.md](./docs/ANALYTICS.md).

> [!IMPORTANT]
> **Environment Safeguards**: To prevent polluting production data, the Umami script **will not load** if:
>
> 1. The hostname is `localhost`, `127.0.0.1`, or a local network IP.
> 2. `window.navigator.webdriver` is true (e.g., in Playwright, Puppeteer, or CI environments).
> 3. The hostname does not match the `data-domains` attribute.

- **Implementation**: The tracker is self-hosted at `web/public/assets/3rd-party/analytics.js` (to bypass ad-blockers and COEP issues) and injected via `web/index.html` with pre-flight checks.
- **Configuration**: The `data-website-id` and `data-domains` are hardcoded in `web/index.html`. For local forks, update these values to point to your own Umami instance.
- **Types**: We use `@types/umami` for full TypeScript support. Always use `typeof umami !== 'undefined'` to safely trigger events programmatically.

## 🐳 Docker & Hardening

- **Security**: The application runs as the non-root `node` user.

- **Exclusions**: Development-only files like `specs/`, `AGENTS.md`, and `DEVELOPER.md` are excluded from the image via `.dockerignore`.

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
    - Update Open Graph tags (`og:title`, `og:description`) for social sharing.
    - Enrich the **JSON-LD** script (`application/ld+json`) by updating the `description` and extending the `featureList`.
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
