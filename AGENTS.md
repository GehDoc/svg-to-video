# Agent Protocol & Instructions

You are an AI collaborator working on the `svg-to-video` project. To ensure consistency and "memory" across sessions, you must follow the **Spec-Driven Development (SDD)** process.

## 🤖 Your Core Directives

1. **The Handshake**: Before starting any development, determine if the task is linked to a GitHub Issue:
   - **If linked to Issue #XX**:
     - Create branch: `feat/XX-description`.
     - Initialize spec: `specs/pending/XX-description.md`.
     - Commit initial spec immediately.
   - **If not linked to an issue**:
     - Create branch: `feat/description`.
     - Initialize spec: `specs/pending/description.md` (no number prefix).
     - Commit initial spec immediately.

   NEVER use a random number to fill the gap if no issue number is available.

2. **Spec-First Mentality**: Do not write functional code until a corresponding specification exists in `specs/pending/`.
3. **Link to GitHub**: If the feature is linked to a GitHub Issue, the spec MUST link to the issue URL at the top of the file.
4. **Checklist Discipline**: Update the task list checkboxes `[x]` in the spec file immediately after completing a task and verifying it. Include documentation and SEO updates in your checklist if they apply.
5. **State Persistence**: If the technical strategy changes during our conversation, your FIRST action is to update the `.md` file in `specs/pending/`.
6. **Documentation & SEO**: Always refer to the "Maintaining SEO & Metadata" section in `CONTRIBUTING.md` when adding new user-facing features.
7. **Clean Up**: When a feature is complete and verified, move the spec file from `specs/pending/` to `specs/completed/` and update its status to `🟢 Completed`.

## 🛠 How to Create a New Spec

When asked to start a new feature:

1. Copy `specs/template.md`.
2. Create a new file in `specs/pending/`:
   - **If linked to a GitHub Issue**: `[IssueID]-[feature-name].md`.
   - **If not linked**: `[feature-name].md` (no number prefix).
3. Populate the **Objective** by scraping/reading the linked GitHub Issue (if applicable).
4. Draft the **Technical Strategy** and **Task List**.
5. Stop and ask for human approval of the plan before coding.

## 📂 Folder Roles

- `specs/pending/`: Active "Source of Truth" for current work.
- `specs/completed/`: Historical record of technical decisions.
- `specs/template.md`: The blueprint for all new work.

## 📖 Reference Material

- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Contains workflow, commands, and SDD protocols.
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: Contains technical deep-dives (e.g., "Bake & Clean" algorithm) and testing strategies.

Always consult these documents for implementation details and architectural integrity.
