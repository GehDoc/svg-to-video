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

Beyond end-to-end and visual regression testing, we use unit testing to validate the behavior of individual UI components.

### Unit Testing Components

We use **Vitest** combined with **Storybook**'s `composeStories` utility. This approach allows us to:

1. Re-use Storybook setup for component testing.
2. Isolate components and mock their context/state via decorators and `MockStudioProvider`.

#### Implementation Pattern

Create a `ComponentName.test.tsx` file for the component:

```tsx
// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { test, expect, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import * as stories from './ComponentName.stories';

afterEach(cleanup);

const { Default } = composeStories(stories);

test('Component renders correctly', () => {
  render(<Default />);
  expect(screen.getByText(/Some text/i)).toBeInTheDocument();
});
```

#### Key Rules:

- **Always** use `// @vitest-environment jsdom` at the top.
- **Always** import `import '@testing-library/jest-dom/vitest';` for DOM matchers like `toBeInTheDocument()`.
- **Prefer** `composeStories` over manually mocking context to stay in sync with Storybook definitions.

## 🐳 Docker & Hardening

The project includes a hardened Dockerfile for both development and production use.

## 🌐 Web Studio Deployment

The Web Studio and Storybook Gallery are configured to deploy automatically to **GitHub Pages** via GitHub Actions.

- **Web Studio**: [https://gehdoc.github.io/svg-to-video/](https://gehdoc.github.io/svg-to-video/)
- **Storybook Gallery**: [https://gehdoc.github.io/svg-to-video/storybook/](https://gehdoc.github.io/svg-to-video/storybook/)
- **Asset Pathing**: The project uses an environment-aware `base` path (`/svg-to-video/`) in `web/vite.config.ts`. This ensures all assets load correctly when deployed as a GitHub Project Site.
- **CI Pipeline**: Deployment is triggered automatically on pushes to the `main` branch via `.github/workflows/deploy.yml`.

* **Security**: The application runs as the non-root `node` user.
* **Exclusions**: Development-only files like `specs/`, `AGENTS.md`, and `DEVELOPER.md` are excluded from the image via `.dockerignore`.
