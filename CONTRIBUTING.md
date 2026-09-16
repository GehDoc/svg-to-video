# Contributing Guide

Welcome! This repository uses **Spec-Driven Development (SDD)** to maintain a clear roadmap and assist AI agents in understanding project state.

---

## 🧭 1. Project Navigation

- **User Instructions**: See [README.md](./README.md).
- **AI Agent Protocol**: See [AGENTS.md](./AGENTS.md).
- **Architecture**: See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).
- **Security & Sandboxing**: See [docs/SECURITY.md](./docs/SECURITY.md).
- **Active Roadmap**: Check [specs/pending/](./specs/pending/).

---

## 🔒 2. Coding & Security Standards

### 🎨 Style Guidelines

- **No Inline Styles**: To ensure maintainability and style consistency, inline styles (`style={{ ... }}`) are prohibited in production components. Use CSS modules or SASS files instead. Inline styles are only permissible in Storybook decorators for layout previewing.

### 🛡️ Security & Sandboxing Standards

To preserve architectural safety across pull requests, all contributions must adhere to the security rules documented in **[docs/SECURITY.md](./docs/SECURITY.md)**:

1. **Subprocess Calls**: Always use `execFileSync` or argument arrays. Never concatenate parameters into shell command strings.
2. **Subprocess Data Validation**: Always validate machine outputs (`--json`) with runtime type guards (e.g., `isLoggerJsonOutput`).
3. **Temp Cleanup**: Ephemeral directory creation must use `fs.mkdtempSync` and be purged in `finally` blocks.
4. **Browser Lifecycles**: Ensure Puppeteer pages and browser contexts are closed (`browser.close()`) on all completion or error execution paths.

---

## 🔄 3. Development Workflows

### 🚦 Type Safety & Commit Hooks

To prevent the introduction of breaking changes, the project uses **Husky** to enforce type safety:

- **Pre-commit**: The `.husky/pre-commit` hook automatically runs `npm run type-check` (which orchestrates root and web workspace checks) alongside linting and formatting. Commits will fail if `tsc` detects any errors.
- **Manual Check**: You can always run `npm run check:fast` to validate types, linting, and formatting locally.

### 🤖 Starting with an AI Agent (Recommended)

To initiate a new feature, simply provide the following command to your AI collaborator:

> "Read AGENTS.md and start a plan for GitHub Issue #XX"

**The Agent will automatically:**

1. Create a new branch: `feat/XX-short-description`.
2. Initialize the spec file in `specs/pending/` from the template.
3. Commit the initial spec to the branch and wait for your approval.

### 🧑‍💻 Manual SDD Workflow

If working without an agent, follow these steps to keep the project state synchronized:

1. **Branching**: Create a feature branch from `main`: `git checkout -b feat/XX-description` (or `feat/description` if not linked to an issue).
2. **Spec-First**: Create a Spec file in `specs/pending/` using [specs/template.md](./specs/template.md).
3. **Implement & Trace**: Write code, keeping the spec's **Task List** `[x]` updated. Update the **Technical Strategy** if the approach deviates from the plan.
4. **Verify & SEO Audit**:
   - Ensure all tasks in the spec are marked as complete.
   - Audit public-facing metadata according to the [Maintaining SEO & Metadata](#-9-maintaining-seo--metadata) checklist (`layout.tsx`, `SeoFallback.tsx`, `README.md`, `package.json`).
   - Run the full verification suite: `npm run check`.
   - Document the successful verification in the spec's **Change Log**.
5. **Archive**: Update the **Status** to `🟢 Completed`, move the spec to `specs/completed/`, and merge your branch.

### 📦 Dependency Management (Vitest & Storybook)

This project requires strict version alignment between **Storybook** and **Vitest** to avoid `Mock` type mismatches.

- **The Problem**: Storybook's `composeStories` often pulls in an internal version of `@vitest/spy` that can conflict with the project's direct Vitest dependency, leading to `"Type 'Mock' is not assignable"` errors in tests.
- **The Solution**: We use the `overrides` field in the root `package.json` to force a unified version for all Vitest-related packages:
  ```json
  "overrides": {
    "vitest": "$vitest",
    "@vitest/spy": "$vitest",
    "@vitest/expect": "$vitest"
  }
  ```
- **Future Upgrades**: When upgrading Storybook or Vitest, ensure all `@vitest/*` packages in the `overrides` section are updated to the same version. Run `rm -rf node_modules package-lock.json && npm install` to rebuild the dependency tree.

---

## 🛠 4. Commands & Testing Strategy

### 📜 CLI & Web Development Commands

#### Project-wide Orchestration (Run from Root)

| Command              | Description                                                              |
| :------------------- | :----------------------------------------------------------------------- |
| `npm run check`      | Runs all checks (lint, format, type-check, e2e tests).                   |
| `npm run check:fast` | Runs fast checks only (lint, format, type-check).                        |
| `npm run build`      | Compiles TypeScript CLI source to ES Modules in `dist/`.                 |
| `npm run fix`        | Auto-fixes linting and formatting issues.                                |
| `npm run lint`       | Checks for linting issues in both CLI and Web Studio code.               |
| `npm run lint:fix`   | Fixes linting issues in both CLI and Web Studio code.                    |
| `npm run format`     | Checks for formatting issues.                                            |
| `npm run format:fix` | Fixes formatting issues.                                                 |
| `npm run test`       | Runs all tests (CLI, MCP, Package Snapshot, Web Studio E2E, Unit, etc.). |
| `npm run test:cli`   | Runs CLI integration tests.                                              |
| `npm run test:mcp`   | Runs MCP Server integration tests.                                       |
| `npm run test:pack`  | Validates npm package file snapshot (`npm pack --dry-run`).              |
| `npm run test:unit`  | Runs unit tests using Vitest and Node test runner.                       |
| `npm run type-check` | Validates TypeScript types (includes web workspace).                     |

#### Web Studio Development (Run inside `web/` directory)

To work on the Web Studio, navigate to the `web/` directory: `cd web`.

| Command                      | Description                                           |
| :--------------------------- | :---------------------------------------------------- |
| `npm run dev`                | Launches the Web Studio development server.           |
| `npm run build`              | Builds the Web Studio for production.                 |
| `npm run start`              | Previews the production build of the Web Studio.      |
| `npm run test:demo`          | Records the automated demo video.                     |
| `npm run test:web`           | Runs Web Studio E2E tests.                            |
| `npm run test:storybook`     | Runs Storybook interaction tests using Vitest.        |
| `npm run test:visual`        | Runs native visual regression tests (pixel matching). |
| `npm run test:visual:update` | Updates visual regression baseline screenshots.       |
| `npm run build-storybook`    | Builds the Storybook static site for deployment.      |

### 🧪 Multi-Tiered Testing Strategy

Beyond end-to-end testing, we use a multi-tiered strategy for component, accessibility, and visual validation:

1. **Unit Tests (`*.test.[ts|tsx]`)**: Validate logic, utilities, and basic component interaction using Vitest and JSDOM.
   - **Command**: `npm run test:unit`
2. **Visual Regression Tests (`*.spec.[ts|tsx]`)**: Validate component-level rendering and pixel-perfect consistency in a real browser (Chromium) using Vitest and Playwright.
   - **Command**: `npm run test:visual`
3. **CLI Integration Tests (`tests/cli.spec.ts`)**: Validate full user workflows for the CLI tool.
   - **Command**: `npm run test:cli`
4. **MCP Server Integration Tests (`tests/mcp.spec.ts`)**: Validate tool schemas, JSON-RPC stdio transport, and MCP tool execution (`render_svg_to_video`, `inspect_svg_animation`).
   - **Command**: `npm run test:mcp`
5. **Web Studio E2E Tests (`web/tests/*.spec.ts`)**: Validate full user workflows for the Web Studio using Playwright.
   - **Command**: `npm run test:web -w web`
   - **Key Coverage**:
     - `rendering-transparency.spec.ts`: Verifies alpha channel support across all formats.
     - `metadata-integrity.spec.ts`: Verifies strictly that Title and Comment metadata are correctly embedded across supporting formats (MP4, WebM, aPNG, GIF).
6. **Storybook Interaction & A11y Tests**: Validate visual/accessibility compliance (e.g., color contrast) and component interactions in isolation.
   - **Command**: `npm run test:storybook -w web`

#### Accessibility Audits

We use `addon-a11y` within Storybook. To validate accessibility across both Light and Dark modes:

```bash
# 1. Start Storybook first
npm run storybook -w web

# 2. In another terminal, run tests for a specific theme
STORYBOOK_THEME=dark npm run test:storybook -w web
```

### 🎥 Automated Demo Generation

The project features an automated demo generation tool that records a video of the Web Studio in action.

- **How it works**: A dedicated Playwright script (`web/tests/demo.spec.ts`) uses **Driver.js** to guide a "spotlight" through the interface, performing a realistic user scenario (importing an SVG, configuring settings, and exporting).
- **CI/CD Integration**: The demo is automatically regenerated and redeployed to GitHub Pages whenever a push is made to the `main` branch by the `build-and-deploy` job in `.github/workflows/ci.yml`.
- **Local Testing**: `npm run test:demo -w web` records `video.webm` in `web/test-results/`.

### ⚙️ Continuous Integration (CI)

The project uses GitHub Actions for automated verification (`.github/workflows/ci.yml`). Key pipeline steps include:

- **Build Verification**: Every PR is built in a production-like environment (`npm run build -w web`) to ensure asset resolution stability.
- **Fast Checks**: Linting, formatting, and type-checking via `npm run check:fast`.
- **E2E/Visual Tests**: Full CLI and Web Studio test suites (including Storybook interactions and pixel-matching visual regressions).

---

## 🐳 5. Docker & Hardening

- **Security**: The application runs as the non-root `node` user inside Docker containers.
- **Renderer Isolation**: The `SvgRenderer` iframe runs in a unique, isolated origin (`null`) by using the `sandbox="allow-scripts"` attribute. This prevents script-based sandbox escapes. Communication is strictly enforced via `postMessage` with origin validation on both the parent and renderer sides.
- **Exclusions**: Development-only files like `specs/`, `AGENTS.md`, and `CONTRIBUTING.md` are excluded from the image via `.dockerignore`.

---

## 🌐 6. Web Studio Deployment & Telemetry

### 🚀 GitHub Pages Deployment

The Web Studio and Storybook Gallery are configured to deploy automatically to **GitHub Pages** via GitHub Actions on `main` branch merges:

- **Web Studio**: [https://gehdoc.github.io/svg-to-video/](https://gehdoc.github.io/svg-to-video/)
- **Storybook Gallery**: [https://gehdoc.github.io/svg-to-video/storybook/](https://gehdoc.github.io/svg-to-video/storybook/)
- **Asset Pathing**: The project uses an environment-aware `base` path (`/svg-to-video/`) in `web/next.config.js`.

### 📊 Analytics (Umami)

The Web Studio uses [Umami Analytics](https://umami.is/) for anonymous usage tracking. Detailed information about tracked events can be found in [docs/ANALYTICS.md](./docs/ANALYTICS.md).

> [!IMPORTANT]
> **Tracking Mandate**: When adding new primary Call-to-Action (CTA) buttons or important navigation links, you **must** implement Umami event tracking via `trackEvent`.

- **Programmatic Tracking**: Use `trackEvent` from `web/src/utils/analytics.ts`:
  ```typescript
  import { trackEvent } from '../utils/analytics';
  trackEvent('my-event-name', { property: 'value' });
  ```
- **Environment Safeguards**: The Umami script will not load on `localhost`, under automated webdrivers (CI/Playwright), or on unapproved domains.

---

## 🔀 7. Pull Request & Code Guidelines

### 🎯 Purpose-Driven Principle ("Why & What", not "How")

All Pull Request titles, git commit messages, and Release titles must follow the **Purpose-Driven Principle**:

- **Focus on Purpose**: Titles must express the high-level user value, feature capability, or core objective of the ticket. Avoid listing internal implementation details or refactor steps ("archeology").
- ✅ **Good (Purpose-Driven)**: `feat(analytics): standardize Umami event tracking & conversion telemetry across Web Studio`
- ❌ **Bad (Implementation Detail)**: `feat(analytics): centralize tracking helper, versioning payload, and domain helpers`

### 🔀 Pull Request Title Format

Follow Conventional Commits: `<type>(<scope>): <purpose-driven title>`

- **Examples**:
  - `feat(cli): add animated GIF and aPNG export support`
  - `fix(renderer): resolve WebCodecs frame drops during high-FPS captures`
  - `docs(analytics): document Umami telemetry schema and domain helpers`

---

## 🚀 8. Release Management & Publishing

### 🏷 Versioning Policy

To maintain synchronization across the project, every release or version bump must update the version number in the following locations:

1. **Root `package.json`**: The `version` field.
2. **Web `package.json`**: The `version` field.
3. **Root `package-lock.json`**: Synchronized by running `npm install`.

Use `npm version [patch|minor|major]` or update `package.json` files manually, then run `npm install` to synchronize `package-lock.json` before committing.

### 📝 Release Title & Note Guidelines

Releases follow the **Purpose-Driven Principle** and **Result-Oriented Focus**:

- **Release Title Format**: `X.Y.Z - [Purpose-Driven Title]` (e.g., `0.22.0 - Standalone CLI Package & Automated Release Pipeline`). Do **NOT** prefix titles with `"Release "`.
- **Result-Oriented Focus**: Focus strictly on end-user value, new capabilities, and final system results. Do **NOT** document internal development history or routine refactor steps.
- **Structure**:
  - **Punchline**: A 2-3 sentence summary explaining the most significant user-facing value.
  - **Structured Categories**:
    - **🚀 New Features**
    - **🛠 Improvements**
    - **🧪 Testing & Quality**
    - **📝 Documentation & SEO**

### ⚙️ Automated Release Pipeline

Releases are triggered by creating a tag `vX.Y.Z` on the `main` branch. This is managed via the GitHub Web UI or GitHub CLI:

- **GitHub Web UI Method**:
  Go to GitHub Repository → Releases → **Draft a new release**. Set tag to `vX.Y.Z`, title to `X.Y.Z - [Purpose-Driven Title]`, and paste formatted release notes.
- **GitHub CLI Method**:
  ```bash
  gh release create v0.22.0 --title "0.22.0 - Standalone CLI Package & Automated Release Pipeline" --notes "..."
  ```

**Automated Workflow Execution**:
Publishing the release tag `vX.Y.Z` automatically triggers `.github/workflows/release.yml`:

1. Verifies tag ancestry against `main` (`git merge-base --is-ancestor`).
2. Runs full validation and package snapshot assertions (`npm run check`).
3. Compiles JS ES Modules (`npm run build`).
4. Publishes package to official npm registry (`npm publish`).
5. Builds and pushes multi-arch Docker image to Docker Hub (`gehdoc/svg-to-video:latest` and `gehdoc/svg-to-video:X.Y.Z`).

---

## 🔍 9. Maintaining SEO & Metadata

When adding new features or core capabilities, ensure public-facing metadata is updated to maintain discoverability.

### SEO Checklist

1. **`web/src/app/layout.tsx`** & **`web/src/components/SeoFallback.tsx`**:
   - Update `layout.tsx` metadata object (title, description, Open Graph/Twitter tags).
   - Enrich JSON-LD `featureList` in `layout.tsx`.
   - Update `SeoFallback.tsx` for static SEO indexing.
2. **`package.json` (Root & Web)**:
   - Update `description` field.
   - Add relevant keywords to `keywords` array in root `package.json`.
3. **`README.md`**:
   - Update features list, installation options, and quick start examples.
4. **GitHub Repository**:
   - Update repository **Description** and **Topics** (tags) in GitHub project settings.
