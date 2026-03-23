# Developer Guide

Welcome! This repository uses **Spec-Driven Development (SDD)** to maintain a clear roadmap and assist AI agents in understanding project state.

## 🧭 Project Navigation

- **User Instructions**: See [README.md](./README.md).
- **AI Agent Protocol**: See [AGENTS.md](./AGENTS.md).
- **Active Roadmap**: Check [specs/pending/](./specs/pending/).

## 🔄 Workflow & Automation

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
| `npm run format` | Checks for formatting issues. |
| `npm run format:fix` | Fixes formatting issues. |
| `npm run test` | Runs all tests (CLI and Web Studio E2E). |
| `npm run type-check` | Validates TypeScript types. |

## 🐳 Docker & Hardening

The project includes a hardened Dockerfile for both development and production use.

- **Security**: The application runs as the non-root `node` user.
- **Exclusions**: Development-only files like `specs/`, `AGENTS.md`, and `DEVELOPER.md` are excluded from the image via `.dockerignore`.
