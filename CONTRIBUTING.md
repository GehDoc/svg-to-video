# Contributing Guide

Welcome! This repository uses **Spec-Driven Development (SDD)** to maintain a clear roadmap and assist human developers and AI agents in understanding project state.

---

## 🧭 Project Navigation

<a id="project-navigation"></a>

Key project documentation and resources:

- **[README.md](./README.md)**: User instructions, installation options, CLI quick start, and Web Studio overview.
- **[AGENTS.md](./AGENTS.md)**: AI Agent protocols, Spec-Driven Development instructions, branching mandates, and checklist discipline.
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: Technical architecture deep-dive, WebCodecs engine details, and the "Bake & Clean" frame rendering algorithm.
- **[docs/SECURITY.md](./docs/SECURITY.md)**: Security and sandboxing standards, subprocess rules, temp file handling, and type guard validation.
- **[docs/CLI.md](./docs/CLI.md)**: Detailed CLI options, arguments, input formats, and batch automation examples.
- **[docs/MCP.md](./docs/MCP.md)**: Model Context Protocol setup, LLM configuration, and JSON-RPC tool schemas.
- **[docs/ANALYTICS.md](./docs/ANALYTICS.md)**: Umami Telemetry event tracking schema and domain helpers.
- **[specs/pending/](./specs/pending/)**: Active feature specifications and roadmap task lists.
- **[specs/completed/](./specs/completed/)**: Historical record of completed features and architectural decisions.

---

## 🔒 Coding & Security Standards

<a id="coding--security-standards"></a>
<a id="security--sandboxing-standards"></a>

### 🎨 Style Guidelines

- **No Inline Styles**: Inline styles (`style={{ ... }}`) are prohibited in production components to maintain design consistency and maintainability. Always use CSS modules (`*.module.scss` or `*.scss`). Inline styles are only permitted in Storybook decorators for layout previewing.
- **SASS Breakpoints & Theme Variables**: Use pre-defined design tokens in `web/src/styles/` for colors, typography, and responsive media queries.

### 🛡️ Security & Sandboxing Standards

To preserve architectural safety across pull requests, all contributions must adhere strictly to the security rules in **[docs/SECURITY.md](./docs/SECURITY.md)**:

1. **Subprocess Invocations**: Always use `execFileSync` with argument arrays. Never concatenate user input or file parameters into shell command strings.
   ```typescript
   // ✅ Good: Safe array invocation
   execFileSync('ffmpeg', ['-i', inputPath, outputPath]);

   // ❌ Bad: Shell string concatenation (command injection risk)
   execSync(`ffmpeg -i ${inputPath} ${outputPath}`);
   ```
2. **Subprocess Data Validation**: Always validate machine outputs (e.g. `--json` CLI flags) using explicit runtime type guards before dereferencing properties.
   ```typescript
   if (!isLoggerJsonOutput(parsedData)) {
     throw new Error('Invalid subprocess JSON schema output');
   }
   ```
3. **Temp Directory Cleanup**: Ephemeral temp directories must be created using `fs.mkdtempSync` and purged inside a `finally` block to prevent leftover artifacts.
   ```typescript
   const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'svg-to-video-'));
   try {
     // Operations...
   } finally {
     fs.rmSync(tmpDir, { recursive: true, force: true });
   }
   ```
4. **Browser & Context Lifecycles**: Ensure Puppeteer browser instances and page contexts are explicitly closed (`browser.close()`) across all success, error, and early-exit execution paths.

---

## 🔄 Development Workflows

<a id="development-workflows"></a>

### 🚦 Type Safety & Commit Hooks

To prevent breaking changes, the project uses **Husky** and **lint-staged** to enforce type safety and formatting:

- **Pre-commit Hook**: The `.husky/pre-commit` hook automatically executes `npm run type-check` (checking root TypeScript and web workspace) alongside linting and formatting. Commits will fail if `tsc` detects any errors.
- **Manual Verification**: Run `npm run check:fast` to validate types, linting, and formatting locally before staging files.

### 🤖 Starting with an AI Agent (Recommended)

To initiate a new feature or fix using an AI agent (such as Antigravity, Claude, or Cursor):

> _"Read AGENTS.md and start a plan for GitHub Issue #XX"_

**Automated Workflow:**

1. Branch creation: `feat/XX-description` (or `feat/description` if unlinked).
2. Spec initialization in `specs/pending/XX-description.md` from template.
3. Commit initial spec and create PR immediately for human review.

### 🧑‍💻 Manual SDD Workflow

If developing manually, follow these steps:

1. **Branching**: Create a feature branch from `main`:
   - Linked to issue `#XX`: `git checkout -b feat/XX-short-description`
   - Unlinked: `git checkout -b feat/short-description`
2. **Spec-First**: Create a specification file in `specs/pending/` copied from `specs/template.md`.
3. **Implement & Trace**: Implement feature while checking off tasks `[x]` in the spec. Update the **Technical Strategy** if implementation details evolve.
4. **Pre-flight Audit & Verification**:
   - Verify all spec tasks are checked off.
   - Audit documentation and SEO metadata per [Maintaining SEO & Metadata](#-maintaining-seo--metadata).
   - Run full project verification: `npm run check`.
   - Record verification results in the spec's **Change Log**.
5. **Archive & Merge**: Update spec status to `🟢 Completed`, move file to `specs/completed/`, and merge branch via PR.

### 📦 Dependency Management (Vitest & Storybook)

This project requires strict version alignment between **Storybook** and **Vitest** to avoid `Mock` type mismatches.

- **The Problem**: Storybook's `composeStories` often pulls in an internal version of `@vitest/spy` that can conflict with the project's direct Vitest dependency, causing `"Type 'Mock' is not assignable"` compiler errors.
- **The Solution**: We enforce unified package versions using root `package.json` `overrides`:
  ```json
  "overrides": {
    "vitest": "$vitest",
    "@vitest/spy": "$vitest",
    "@vitest/expect": "$vitest"
  }
  ```
- **Upgrades**: When updating Storybook or Vitest, ensure all `@vitest/*` override entries match. Run `rm -rf node_modules package-lock.json && npm install` to reset lockfile resolution.

---

## 🛠 Commands & Testing Strategy

<a id="commands--testing-strategy"></a>

### 📜 CLI & Web Development Commands

#### Project-wide Orchestration (Run from Root)

| Command              | Description                                                                |
| :------------------- | :------------------------------------------------------------------------- |
| `npm run check`      | Runs full verification suite (lint, format, type-check, unit & e2e tests). |
| `npm run check:fast` | Runs fast validation checks only (lint, format, type-check).               |
| `npm run build`      | Compiles CLI TypeScript source into ES Modules in `dist/`.                 |
| `npm run fix`        | Auto-fixes linting and formatting issues across all packages.              |
| `npm run lint`       | Lints CLI and Web Studio code.                                             |
| `npm run lint:fix`   | Fixes linting errors across CLI and Web Studio.                            |
| `npm run format`     | Checks formatting compliance using Prettier.                               |
| `npm run format:fix` | Formats files with Prettier.                                               |
| `npm run test`       | Runs all unit, integration, visual regression, and package snapshot tests. |
| `npm run test:cli`   | Runs CLI integration test suite (`tests/cli.spec.ts`).                     |
| `npm run test:mcp`   | Runs MCP Server integration test suite (`tests/mcp.spec.ts`).              |
| `npm run test:pack`  | Validates npm tarball file snapshot (`npm pack --dry-run`).                |
| `npm run test:unit`  | Runs unit tests with Vitest and Node test runner.                          |
| `npm run type-check` | Performs TypeScript type checking across root CLI and Web workspace.       |

#### CLI Local Verification Commands

After running `npm run build`, you can test local CLI and MCP execution directly:

```bash
# Test local CLI executable help output
node dist/src/index.js --help

# Convert test SVG to GIF via local CLI build
node dist/src/index.js tests/fixtures/demo-fixture.svg 60 ./out --format gif

# Test MCP server stdio interface
node dist/src/mcp.js
```

#### Web Studio Development (Run inside `web/` directory)

Navigate to `web/` (`cd web`) to run studio commands:

| Command                      | Description                                                  |
| :--------------------------- | :----------------------------------------------------------- |
| `npm run dev`                | Starts Web Studio Next.js development server.                |
| `npm run build`              | Builds Web Studio for static production export (`web/out/`). |
| `npm run start`              | Serves production web build locally.                         |
| `npm run storybook`          | Starts interactive Storybook component workbench.            |
| `npm run build-storybook`    | Builds static Storybook site for GitHub Pages deployment.    |
| `npm run test:demo`          | Records automated demo video using Playwright & Driver.js.   |
| `npm run test:web`           | Runs Web Studio E2E Playwright test suite.                   |
| `npm run test:storybook`     | Runs Storybook component interaction tests via Vitest.       |
| `npm run test:visual`        | Runs visual regression tests (pixel snapshot matching).      |
| `npm run test:visual:update` | Updates baseline visual regression screenshot snapshots.     |

### 🧪 Multi-Tiered Testing Strategy

We employ a comprehensive multi-tiered testing strategy:

1. **Unit Tests (`*.test.[ts|tsx]`)**: Test standalone utility functions, encoders, and isolated component state logic using Vitest & JSDOM.
   - **Command**: `npm run test:unit`
2. **Visual Regression Tests (`*.spec.[ts|tsx]`)**: Validate component-level rendering and pixel-perfect output against baseline images (`web/src/components/**/__screenshots__/`) in real headless Chromium.
   - **Command**: `npm run test:visual`
   - **Baseline Updates**: Run `npm run test:visual:update -w web` to refresh baseline snapshots after approved UI changes.
3. **CLI Integration Tests (`tests/cli.spec.ts`)**: Test CLI options (`--format`, `--transparent`, `--duration`, `--fps`), file output creation, and FFmpeg pipeline processing.
   - **Command**: `npm run test:cli`
4. **MCP Server Integration Tests (`tests/mcp.spec.ts`)**: Validate Model Context Protocol JSON-RPC stdio transport, tool definitions (`render_svg_to_video`, `inspect_svg_animation`), and LLM invocation schemas.
   - **Command**: `npm run test:mcp`
5. **Web Studio E2E Tests (`web/tests/*.spec.ts`)**: End-to-end verification of browser workflows:
   - `rendering-transparency.spec.ts`: Validates alpha channel transparency across WebM, aPNG, and GIF exports.
   - `metadata-integrity.spec.ts`: Validates Title and Comment metadata injection into exported media.
   - **Command**: `npm run test:web -w web`
6. **Storybook Interaction & Accessibility Tests**: Test UI components in isolation across Light and Dark themes:
   ```bash
   # Terminal 1: Start Storybook
   npm run storybook -w web

   # Terminal 2: Run accessibility and interaction suite
   STORYBOOK_THEME=dark npm run test:storybook -w web
   ```

### 🎥 Automated Demo Generation

The project features an automated demo recorder that captures the Web Studio UI in action:

- **Script**: `web/tests/demo.spec.ts` uses **Driver.js** to highlight UI elements and perform realistic SVG uploads, parameter tweaks, and video exports.
- **CI/CD Integration**: Automatically runs during GitHub Actions deployment (`.github/workflows/ci.yml`) to keep the top README demo GIF up to date.
- **Local Run**: `npm run test:demo -w web` generates `video.webm` in `web/test-results/`.

### ⚙️ Continuous Integration (CI)

GitHub Actions automatically executes verification pipelines (`.github/workflows/ci.yml`) on every Pull Request and merge to `main`:

- **Build Verification**: Builds Next.js static export (`npm run build -w web`) to verify asset resolution and base path stability (`/svg-to-video/`).
- **Fast Checks**: Validates linting, Prettier formatting, and TypeScript compilation via `npm run check:fast`.
- **E2E & Snapshot Tests**: Executes full CLI integration, MCP tests, visual regression checks, and package snapshot validation (`npm run test:pack`).

---

## 🐳 Docker & Hardening

<a id="docker--hardening"></a>

The application provides an official Docker image (`gehdoc/svg-to-video`) for zero-dependency local execution and headless CI environments.

### Local Docker Commands

```bash
# Build Docker image locally
docker build -t gehdoc/svg-to-video .

# Convert SVG to WebM video using Docker
docker run --rm -v $(pwd):/data gehdoc/svg-to-video input.svg 60 /data/output --format webm

# Convert SVG to transparent GIF using Docker
docker run --rm -v $(pwd):/data gehdoc/svg-to-video input.svg 60 /data/output --format gif --transparent
```

### Security & Hardening Architecture

- **Non-Root Execution**: Container runs under the unprivileged `node` user (UID 1000).
- **Renderer Sandboxing**: The Web Studio rendering engine isolates untrusted SVGs in an iframe using `sandbox="allow-scripts"` with a unique origin (`null`). Communication between parent and renderer uses strict `postMessage` origin checking.
- **Minimal Image Footprint**: Development tools (`specs/`, `AGENTS.md`, `CONTRIBUTING.md`) are excluded via `.dockerignore`.

---

## 🌐 Web Studio Deployment & Telemetry

<a id="web-studio-deployment--telemetry"></a>

### 🚀 GitHub Pages Deployment

The Web Studio and Storybook Gallery deploy automatically to **GitHub Pages** on merges to `main`:

- **Web Studio**: [https://gehdoc.github.io/svg-to-video/](https://gehdoc.github.io/svg-to-video/)
- **Storybook Gallery**: [https://gehdoc.github.io/svg-to-video/storybook/](https://gehdoc.github.io/svg-to-video/storybook/)
- **Asset Pathing**: Next.js uses an environment-aware `basePath: '/svg-to-video'` in `web/next.config.js`.

### 📊 Analytics (Umami Telemetry)

The Web Studio uses cookie-less [Umami Analytics](https://umami.is/) for privacy-friendly telemetry. See **[docs/ANALYTICS.md](./docs/ANALYTICS.md)** for full event definitions.

> [!IMPORTANT]
> **Tracking Mandate**: Any new primary call-to-action button, export trigger, or major navigation flow **must** include telemetry events using domain helpers.

- **Programmatic Tracking**:
  ```typescript
  // Generic tracking helper (web/src/utils/analytics.ts)
  import { trackEvent } from '../utils/analytics';
  trackEvent('my-custom-event', { property: 'value' });

  // Domain tracking helpers (web/src/utils/tracking/)
  import { trackFileLoaded } from '../utils/tracking/fileTracking';
  import {
    trackConversionSuccess,
    trackExportStarted,
  } from '../utils/tracking/rendererTracking';

  trackFileLoaded({ fileSizeBytes: 1024, isDrop: true });
  trackExportStarted({ format: 'webm', fps: 60, durationSeconds: 5 });
  trackConversionSuccess({ format: 'webm', renderTimeMs: 1200 });
  ```
- **Telemetry Safeguards**: The tracker script is disabled on `localhost`, under automated webdrivers (`window.navigator.webdriver`), or on unapproved hostnames.

---

## 🔀 Pull Request & Code Guidelines

<a id="pull-request--code-guidelines"></a>
<a id="title--naming-standards-prs--releases"></a>

### 🎯 Purpose-Driven Principle ("Why & What", not "How")

All Pull Request titles, git commit messages, and GitHub Release titles must follow the **Purpose-Driven Principle**:

- **Focus on Purpose**: Titles must express the high-level user value, feature capability, or core objective. Avoid internal implementation details or refactor steps ("archeology").
- ✅ **Good (Purpose-Driven)**: `feat(analytics): standardize Umami event tracking & conversion telemetry across Web Studio`
- ❌ **Bad (Implementation Detail)**: `feat(analytics): centralize tracking helper, versioning payload, and domain helpers`

### 🔀 Pull Request Title Format

Follow Conventional Commits: `<type>(<scope>): <purpose-driven title>`

| Type       | Description                                                         | Example                                                                 |
| :--------- | :------------------------------------------------------------------ | :---------------------------------------------------------------------- |
| `feat`     | New user-facing capability or format support.                       | `feat(cli): add animated GIF and aPNG export support`                   |
| `fix`      | Bug fix or correction of unexpected behavior.                       | `fix(renderer): resolve WebCodecs frame drops during high-FPS captures` |
| `docs`     | Documentation, SEO, or specification updates.                       | `docs(analytics): document Umami telemetry schema and domain helpers`   |
| `refactor` | Code structural changes without altering user-facing functionality. | `refactor(encoders): streamline WebM muxer initialization`              |
| `test`     | Adding or updating test suites and baseline visual snapshots.       | `test(e2e): add alpha channel transparency assertions`                  |
| `chore`    | Maintenance tasks, dependency updates, or build pipeline tweaks.    | `chore(deps): update Vitest and Storybook override dependencies`        |

### 💻 GitHub CLI PR Creation Workflow

Create Pull Requests directly from the command line:

```bash
gh pr create \
  --title "feat(cli): add animated GIF and aPNG export support" \
  --body "## Summary
Introduces high-fidelity aPNG and optimized GIF export capabilities to the CLI tool."
```

---

## 🚀 Release Management & Publishing

<a id="release-management--publishing"></a>
<a id="versioning-policy"></a>
<a id="release-note-best-practices"></a>

### 🏷 Versioning Policy

To maintain project synchronization, every release or version bump must update the version number in all 3 required files:

1. **Root `package.json`**: The `version` field.
2. **Web `package.json`**: The `version` field (`web/package.json`).
3. **Root `package-lock.json`**: Synchronized by running `npm install`.

Use `npm version [patch|minor|major]` or update `package.json` files manually, then run `npm install` to update `package-lock.json` before committing.

### 📝 Release Title & Note Guidelines

Releases strictly adhere to the **Purpose-Driven Principle** and **Result-Oriented Focus**:

- **Release Title Format**: `X.Y.Z - [Purpose-Driven Title]` (e.g., `0.22.0 - Standalone CLI Package & Automated Release Pipeline`). Do **NOT** prefix titles with `"Release "`.
- **Result-Oriented Focus**: Focus strictly on end-user value, new capabilities, and final system results. Do **NOT** list internal development commits or refactor steps.
- **Release Note Structure**:
  - **Punchline**: A 2-3 sentence summary explaining the primary user value.
  - **Structured Categories**:
    - **🚀 New Features**
    - **🛠 Improvements**
    - **🧪 Testing & Quality**
    - **📝 Documentation & SEO**

> **Example Release Note:**
>
> **0.22.0 - Standalone CLI Package & Automated Release Pipeline**
>
> This release decouples the CLI tool into a lightweight standalone package and establishes an automated release pipeline for npm and Docker Hub.
>
> ### 🚀 New Features
>
> - Added dedicated `svg-to-video` CLI executable distribution on npm.
>
> ### 🛠 Improvements
>
> - Streamlined Puppeteer browser launch configuration for headless environments.

### ⚙️ Automated Release Pipeline

Releases are triggered by pushing a version tag `vX.Y.Z` on the `main` branch. Release notes should **never** be committed as `.md` files in git.

#### Publishing Methods

- **GitHub CLI Method**:
  ```bash
  gh release create v0.22.0 \
    --title "0.22.0 - Standalone CLI Package & Automated Release Pipeline" \
    --notes "..."
  ```
- **GitHub Web UI Method**:
  Navigate to GitHub Repository → Releases → **Draft a new release**. Set tag to `vX.Y.Z`, set title to `X.Y.Z - [Purpose-Driven Title]`, paste notes, and publish.

#### Automated Pipeline Execution

Publishing the release tag `vX.Y.Z` automatically triggers `.github/workflows/release.yml`:

1. Verifies tag ancestry against `main` (`git merge-base --is-ancestor`).
2. Runs full validation and package snapshot assertions (`npm run check`).
3. Compiles JS ES Modules (`npm run build`).
4. Publishes package to official npm registry (`npm publish`).
5. Builds and pushes multi-arch Docker image to Docker Hub (`gehdoc/svg-to-video:latest` and `gehdoc/svg-to-video:X.Y.Z`).

---

## 🔍 Maintaining SEO & Metadata

<a id="maintaining-seo--metadata"></a>

When adding new features or core capabilities, systematically update public-facing metadata for maximum discoverability:

### 📋 SEO & Metadata Audit Checklist

1. **`web/src/app/layout.tsx`** & **`web/src/components/SeoFallback.tsx`**:
   - Update `layout.tsx` metadata object (title, description, Open Graph / Twitter cards).
   - Update structured **JSON-LD** data in `layout.tsx` (enrich `featureList` array).
   - Update **`SeoFallback.tsx`** static fallback text for search engine indexing.
   - Verify `sitemap.ts` and `robots.ts` reflect dynamic site routes.
2. **`package.json` (Root & Web)**:
   - Update `description` fields to highlight new capabilities.
   - Add new relevant search tags to the `keywords` array in root `package.json`.
3. **`README.md`**:
   - Update feature summaries, installation options, and CLI/web quick start usage blocks.
4. **GitHub Repository Metadata**:
   - Update repository **Description** in GitHub repository settings.
   - Update repository **Topics** (tags) via GitHub Web UI or GitHub CLI:
     ```bash
     gh repo edit \
       --description "High-fidelity CSS/SVG animation converter to MP4, WebM, GIF & aPNG with transparent background support" \
       --add-topic "svg" --add-topic "video" --add-topic "converter" --add-topic "apng" --add-topic "gif" --add-topic "webm" --add-topic "mp4" --add-topic "mcp"
     ```
