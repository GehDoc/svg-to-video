# Contributing Guide

Welcome! This repository uses **Spec-Driven Development (SDD)** to maintain a clear roadmap and assist AI agents in understanding project state.

## 🧭 Project Navigation

- **User Instructions**: See [README.md](./README.md).
- **AI Agent Protocol**: See [AGENTS.md](./AGENTS.md).
- **Architecture**: See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).
- **Active Roadmap**: Check [specs/pending/](./specs/pending/).

## 💻 Coding Standards

- **No Inline Styles**: To ensure maintainability and style consistency, inline styles (`style={{ ... }}`) are prohibited in production components. Use CSS modules or SASS files instead. Inline styles are only permissible in Storybook decorators for layout previewing.

## 🔄 Workflow & Automation

### 🚦 Type Safety & Commit Hooks

To prevent the introduction of breaking changes, the project uses **Husky** to enforce type safety:

- **Pre-commit**: The `.husky/pre-commit` hook automatically runs `npm run type-check` (which orchestrates root and web workspace checks) alongside linting and formatting. Commits will fail if `tsc` detects any errors.
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

1.  **Branching**: Create a feature branch from `main`: `git checkout -b feat/XX-description` (or `feat/description` if not linked to an issue).
2.  **Spec-First**: Create a Spec file in `specs/pending/` using the [specs/template.md](./specs/template.md).
3.  **Implement & Trace**: Write code, keeping the spec's **Task List** `[x]` updated. Update the **Technical Strategy** if the approach deviates from the plan.
4.  **Verify**:
    - Ensure all tasks in the spec are marked as complete.
    - Run the full verification suite: `npm run check`.
    - Document the successful verification in the spec's **Change Log**.
5.  **Archive**: Update the **Status** to `🟢 Completed`, move the spec to `specs/completed/`, and merge your branch.

## 🛠 Development Commands

### Project-wide Orchestration (Run from Root)

| Command              | Description                                                        |
| :------------------- | :----------------------------------------------------------------- |
| `npm run check`      | Runs all checks (lint, format, type-check, e2e tests).             |
| `npm run check:fast` | Runs fast checks only (lint, format, type-check).                  |
| `npm run fix`        | Auto-fixes linting and formatting issues.                          |
| `npm run lint`       | Checks for linting issues in both CLI and Web Studio code.         |
| `npm run lint:fix`   | Fixes linting issues in both CLI and Web Studio code.              |
| `npm run format`     | Checks for formatting issues.                                      |
| `npm run format:fix` | Fixes formatting issues.                                           |
| `npm run test`       | Runs all tests (CLI, Web Studio E2E, Unit, Storybook, and Visual). |
| `npm run type-check` | Validates TypeScript types (includes web workspace).               |

### Web Studio Development (Run inside `web/` directory)

To work on the Web Studio, navigate to the `web/` directory: `cd web`.

| Command                      | Description                                           |
| :--------------------------- | :---------------------------------------------------- |
| `npm run dev`                | Launches the Web Studio development server.           |
| `npm run build`              | Builds the Web Studio for production.                 |
| `npm run start`              | Previews the production build of the Web Studio.      |
| `npm run test:web`           | Runs Web Studio E2E tests.                            |
| `npm run test:storybook`     | Runs Storybook interaction tests using Vitest.        |
| `npm run test:visual`        | Runs native visual regression tests (pixel matching). |
| `npm run test:visual:update` | Updates visual regression baseline screenshots.       |
| `npm run build-storybook`    | Builds the Storybook static site.                     |
| `npm run test:cli`           | Runs CLI E2E tests.                                   |
| `npm run test:web`           | Runs Web Studio E2E tests.                            |
| `npm run test:unit`          | Runs component-level unit tests using Vitest.         |
| `npm run test:storybook`     | Runs Storybook interaction tests using Vitest.        |
| `npm run test:visual`        | Runs native visual regression tests (pixel matching). |
| `npm run test:visual:update` | Updates visual regression baseline screenshots.       |
| `npm run build-storybook`    | Builds the Storybook static site for deployment.      |
| `npm run type-check`         | Validates TypeScript types.                           |

## 🧪 Testing Strategy

Beyond end-to-end testing, we use a multi-tiered strategy for component, accessibility, and visual validation:

1. **Unit Tests (`*.test.[ts|tsx]`)**: Validate logic, utilities, and basic component interaction using Vitest and JSDOM. These are fast and do not require a browser.
   - **Command**: `npm run test:unit`
2. **Visual Regression Tests (`*.spec.[ts|tsx]`)**: Validate component-level rendering and pixel-perfect consistency in a real browser (Chromium) using Vitest and Playwright.
   - **Command**: `npm run test:visual`
3. **CLI Integration Tests (`tests/cli.spec.ts`)**: Validate full user workflows for the CLI tool.
   - **Command**: `npm run test:cli`
4. **Web Studio E2E Tests (`web/tests/*.spec.ts`)**: Validate full user workflows for the Web Studio using Playwright.
   - **Command**: Run `npm run test:web -w web` from the root, or `npm run test:web` from within the `web/` directory.
5. **Storybook Interaction & A11y Tests**: Validate visual/accessibility compliance (e.g., color contrast) and component interactions in isolation.
   - **Command**: Run `npm run test:storybook -w web` from the root, or `npm run test:storybook` from within the `web/` directory.
6. **Storybook Build**:
   - **Command**: Run `npm run build-storybook -w web` from the root, or `npm run build-storybook` from within the `web/` directory.

### 🗂 Test Organization

- **Unit Tests**: Co-located with components/utilities in `web/src/`.
- **Visual Regression Tests**: Co-located with components in `web/src/`.
- **CLI Integration Tests**: Located in `tests/cli.spec.ts`.
- **Web Studio E2E Tests**: Located in `web/tests/*.spec.ts`.
- **Storybook Tests**: Located in `web/src/**/*.stories.tsx` (validated by `test-storybook`).

### Accessibility Audits

We use `addon-a11y` within Storybook. To ensure consistent results:

- **Manual Audit**: Use the "Accessibility" panel in the Storybook UI.
- **Automated Audit**: Run the Storybook interaction test suite via the official `@storybook/test-runner`.

```bash
# Run real-browser accessibility and interaction tests
npm run test:storybook -w web
```

**Testing specific themes locally**:
To validate accessibility across both Light and Dark modes (like the CI does), set the `STORYBOOK_THEME` environment variable:

```bash
# 1. Start Storybook first
npm run storybook -w web

# 2. In another terminal, run tests for a specific theme
STORYBOOK_THEME=dark npm run test:storybook -w web
```

_Note: Avoid using `jest-axe` in JSDOM unit tests, as it cannot calculate computed styles and will miss contrast violations._

### ⚙️ Continuous Integration (CI)

The project uses GitHub Actions for automated verification. Key pipeline steps include:

- **Build Verification**: Every PR is built in a production-like environment (`npm run build -w web`) to ensure asset resolution stability.
- **Fast Checks**: Linting, formatting, and type-checking via `npm run check:fast`.
- **E2E/Visual Tests**: Full CLI and Web Studio test suites (including Storybook interactions and pixel-matching visual regressions).

## 🐳 Docker & Hardening

- **Security**: The application runs as the non-root `node` user.
- **Renderer Isolation**: The `SvgRenderer` iframe runs in a unique, isolated origin (`null`) by using the `sandbox="allow-scripts"` attribute. This prevents script-based sandbox escapes. Communication is strictly enforced via `postMessage` with origin validation on both the parent and renderer sides.
- **Exclusions**: Development-only files like `specs/`, `AGENTS.md`, and `CONTRIBUTING.md` are excluded from the image via `.dockerignore`.

## 🌐 Web Studio Deployment

The Web Studio and Storybook Gallery are configured to deploy automatically to **GitHub Pages** via GitHub Actions.

- **Web Studio**: [https://gehdoc.github.io/svg-to-video/](https://gehdoc.github.io/svg-to-video/)
- **Storybook Gallery**: [https://gehdoc.github.io/svg-to-video/storybook/](https://gehdoc.github.io/svg-to-video/storybook/)
- **Asset Pathing**: The project uses an environment-aware `base` path (`/svg-to-video/`) in `web/next.config.js`. This ensures all assets load correctly when deployed as a GitHub Project Site.
- **CI Pipeline**: Deployment is triggered automatically on pushes to the `main` branch via `.github/workflows/ci.yml`.

### 📊 Analytics (Umami)

The Web Studio uses [Umami Analytics](https://umami.is/) for anonymous usage tracking. Detailed information about tracked events can be found in [docs/ANALYTICS.md](./docs/ANALYTICS.md).

> [!IMPORTANT]
> **Tracking Mandate**: When adding new primary Call-to-Action (CTA) buttons or important navigation links, you **must** implement Umami event tracking. This helps us understand which features are most used and where users might be struggling.

- **Implementation**: The tracker is self-hosted at `web/public/assets/3rd-party/analytics.js` and injected via `next/script` in `web/src/app/layout.tsx`.
- **Programmatic Tracking**: Use the global `window.umami.track` function to trigger events.

  ```typescript
  window.umami.track('my-event-name', { property: 'value' });
  ```

- **Environment Safeguards**: To prevent polluting production data, the Umami script **will not load** if:
  1. The hostname is `localhost`, `127.0.0.1`, or a local network IP.
  2. `window.navigator.webdriver` is true (e.g., in Playwright, Puppeteer, or CI environments).
  3. The hostname does not match the `data-domains` attribute.

- **Configuration**: The `data-website-id` and `data-domains` are hardcoded in `web/src/app/layout.tsx`. For local forks, update these values to point to your own Umami instance.
- **Types**: We use `@types/umami` for full TypeScript support.

## 🏷 Versioning Policy

To maintain synchronization across the project, every release must increment the version number in the following locations:

1. **Root `package.json`**: The `version` field.
2. **Web `package.json`**: The `version` field.

Use the `npm version [patch|minor|major]` command or update manually in these files, ensuring the version string is identical in both locations before committing. The repository README version badge updates automatically.

## 📝 Release Note Best Practices

To maintain consistent, high-quality release notes, all agents and contributors should follow this structure:

### 1. Title Structure

- **Format**: `Release [Version] - [Short Descriptive Title]`
- **Version**: Use the raw version number (e.g., `0.9.2`) without a `v` prefix.
- **Prerequisite**: Ensure the version has been bumped in all project files according to our [Versioning Policy](#-versioning-policy) before finalizing release notes.

### 2. Content Structure

- **Punchline**: A 2-3 sentence summary explaining the most significant user-facing value or impact of the release.
- **Structured Details**: Use the following headings for clarity:
  - **🚀 New Features**: Significant additions or changes that impact user workflows.
  - **🛠 Improvements**: Refactors, performance optimizations, or UI/UX tweaks.
  - **🧪 Testing & Quality**: Summary of test coverage additions or improvements.
  - **📝 Documentation**: Any changes to docs, metadata, or SEO.

### Example

> **Release 0.9.1 - Extended Format Support & Web Studio Enhancements**
>
> This release introduces dynamic video format discovery and significant improvements to the Web Studio's export capabilities, documentation, and overall user experience.
>
> ### 🚀 New Features
>
> - ...

## 🔍 Maintaining SEO & Metadata

When adding new features or core capabilities, ensure all public-facing metadata is updated to maintain discoverability and clarity.

### SEO Checklist

1.  **`web/src/app/layout.tsx`** and **`web/src/app/page.tsx`**:
    - Update `layout.tsx` metadata object (title, description, Open Graph/Twitter tags).
    - Enrich the **JSON-LD** data in `layout.tsx`.
    - Update the fallback content in `page.tsx` (the "Loading" state) to reflect core features and keywords for SEO.
    - Ensure `sitemap.ts` and `robots.ts` are updated to reflect the site structure.
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
