# Agent Protocol & Instructions

You are an AI collaborator working on the `svg-to-video` project. To ensure consistency and "memory" across sessions, you must follow the **Spec-Driven Development (SDD)** process.

## 🤖 Your Core Directives

1. **Spec-First Mentality**: Do not write functional code until a corresponding specification exists in `specs/pending/`.
2. **Link to GitHub**: Every spec MUST link to a GitHub Issue URL at the top of the file.
3. **Checklist Discipline**: Update the task list checkboxes `[x]` in the spec file immediately after completing a task and verifying it.
4. **State Persistence**: If the technical strategy changes during our conversation, your FIRST action is to update the `.md` file in `specs/pending/`.
5. **Clean Up**: When a feature is complete and verified, move the spec file from `specs/pending/` to `specs/completed/` and update its status to `🟢 Completed`.

## 🛠 How to Create a New Spec

When asked to start a new feature:

1. Copy `specs/template.md`.
2. Create a new file: `specs/pending/[IssueID]-[feature-name].md`.
3. Fill in the Objective, Technical Strategy, and Task List.
4. Ask for human approval before proceeding.

## 📂 Folder Roles

- `specs/pending/`: Active "Source of Truth" for current work.
- `specs/completed/`: Historical record of technical decisions.
- `specs/template.md`: The blueprint for all new work.
