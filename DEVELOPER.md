# Developer Guide

Welcome! This repository uses **Spec-Driven Development (SDD)** to maintain a clear roadmap and assist AI agents in understanding project state.

## 🧭 Project Navigation

- **User Instructions**: See [README.md](./README.md).
- **AI Agent Protocol**: See [AGENTS.md](./AGENTS.md).
- **Active Roadmap**: Check [specs/pending/](./specs/pending/).

## 🔄 Workflow

1.  **Initialize**: Create a GitHub Issue for the feature.
2.  **Spec-First**: Create a Spec file in `specs/pending/` using the [specs/template.md](./specs/template.md).
3.  **Implement & Trace**: Write code, keeping the spec's **Task List** `[x]` updated. Update the **Technical Strategy** if the approach deviates from the plan.
4.  **Verify**:
    - Ensure all tasks in the spec are marked as complete.
    - Run the full verification suite: `npm run check`.
    - Document the successful verification in the spec's **Change Log**.
5.  **Archive**: Update the **Status** to `🟢 Completed` and move the spec to `specs/completed/`.

## 🛠 Development Commands

| Script               | Description                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| `npm run check`      | Runs all checks (lint, format, type-check, e2e tests).                  |
| `npm run check:fast` | Runs fast checks only (lint, format, type-check).                       |
| `npm run fix`        | Auto-fixes linting and formatting issues.                               |
| `npm run lint`       | Checks for linting issues.                                              |
| `npm run lint:fix`   | Fixes linting issues.                                                   |
| `npm run format`     | Checks for formatting issues.                                           |
| `npm run format:fix` | Fixes formatting issues.                                                |
| `npm run type-check` | Validates TypeScript types.                                             |
| `npm run test:e2e`   | Runs the end-to-end tests. (Executed as part of `npm run check` in CI). |

## 🐳 Docker & Hardening

The project includes a hardened Dockerfile for both development and production use.

- **Security**: The application runs as the non-root `node` user.
- **Exclusions**: Development-only files like `specs/` and `DEVELOPER.md` are excluded from the image via `.dockerignore`.
