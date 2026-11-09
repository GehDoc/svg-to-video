# Agent Protocol & Instructions

You are an AI collaborator working on the `svg-to-video` project. To ensure consistency and "memory" across sessions, you must follow the **Spec-Driven Development (SDD)** process.

## 🤖 Your Core Directives

1. **The Handshake**: Before starting any development, determine if the task is linked to a GitHub Issue:
   - **If linked to Issue #XX**:
     - Create branch: `feat/XX-description`.
     - Initialize spec: `specs/pending/XX-description.md`.
     - Commit initial spec, push, and create a Pull Request (using `gh pr create`) immediately.
   - **If not linked to an issue**:
     - Create branch: `feat/description`.
     - Initialize spec: `specs/pending/description.md` (no number prefix).
     - Commit initial spec, push, and create a Pull Request (using `gh pr create`) immediately.

   NEVER use a random number to fill the gap if no issue number is available.
   All PR and Release titles MUST follow the Purpose-Driven Principle per [CONTRIBUTING.md](./CONTRIBUTING.md#-title--naming-standards-prs--releases) (expressing feature purpose/value rather than implementation details).

2. **Spec-First Mentality**: Do not write functional code until a corresponding specification exists in `specs/pending/`.
3. **Link to GitHub**: If the feature is linked to a GitHub Issue, the spec MUST link to the issue URL at the top of the file.
4. **Checklist Discipline**: Update the task list checkboxes `[x]` in the spec file immediately after completing a task and verifying it. Include documentation and SEO updates in your checklist if they apply.
5. **State Persistence**: If the technical strategy changes during our conversation, your FIRST action is to update the `.md` file in `specs/pending/`.
6. **Documentation, Security & SEO Pre-Flight**: Before finalizing any feature, systematically audit and update:
   - `README.md` (features & capabilities)
   - `docs/ARCHITECTURE.md` (if design or format strategies changed)
   - `docs/SECURITY.md` (audit subprocess calls, temp file cleanup, and type guards per [CONTRIBUTING.md](./CONTRIBUTING.md#-security--sandboxing-standards))
   - `web/src/app/layout.tsx` (`title`, `description` from `pkg`, `keywords` & `jsonLd.featureList`)
   - `web/src/components/SeoFallback.tsx` (static fallback description and ecosystem links via `ECOSYSTEM_LINKS`)
   - `web/public/llms.txt` & `robots.txt` (AI model context file & crawler permissions)
   - `web/src/utils/constants.ts` (`ECOSYSTEM_LINKS` centralized link helper)
   - `docs/FAQ.md` (FAQ entries parsed at build time by `web/scripts/generate-seo-data.ts` — use `## Q: <question>` convention)
   - `docs/ANALYTICS.md` (audit if any telemetry event payloads, tracking methods, or triggers changed)
   - `package.json` (Root & Web `description` sync, `keywords` & version synchronization per [CONTRIBUTING.md](./CONTRIBUTING.md#-versioning-policy))
   - `mcp.json` (MCP server registry manifest description and metadata)
   - GitHub Repository Metadata (Description & Topics via `gh repo edit`)
   - **External surfaces** _(manual)_: Check HuggingFace Space README and Docker Hub overview per the [SEO & Metadata Audit Checklist in CONTRIBUTING.md](./CONTRIBUTING.md#-seo--metadata-audit-checklist).
7. **Review Handover (`🟡 To be reviewed`)**: Once code, tests, documentation, and SEO audits are complete and verified:
   - Mark the active spec status as `🟡 To be reviewed` (keep file in `specs/pending/`).
   - Commit all changes and push the branch to `origin`.
   - Update the Pull Request with verification evidence and indicate the spec is ready for human review.
   - **Strict Non-Merge Policy**: Review is strictly on GitHub by the human developer. NEVER merge into `main` or archive the spec without explicit human approval.
8. **Post-Approval Archival & Release (`🟢 Completed`)**: Strictly AFTER the Pull Request has been approved by the human developer:
   - **Version Bump**: Increment version across root `package.json` and `web/package.json`, then run `npm install` for `package-lock.json` per [CONTRIBUTING.md](./CONTRIBUTING.md#-versioning-policy).
   - **Archive Spec**: Update spec status to `🟢 Completed` and move the file from `specs/pending/` to `specs/completed/`.
   - **Commit Archival**: Commit on the branch with `chore(release): bump version to X.Y.Z and archive spec`.
   - **Post Release Notes**: Generate and post the Release Title and structured Release Notes as a PR comment per [CONTRIBUTING.md](./CONTRIBUTING.md#-release-note-best-practices).
   - **Merge & Publish**: The PR can now be merged to `main`, and release tag `vX.Y.Z` published per [CONTRIBUTING.md](./CONTRIBUTING.md#-automated-release-pipeline).

## 🛠 How to Create a New Spec

When asked to start a new feature:

1. Copy `specs/template.md`.
2. Create a new file in `specs/pending/`:
   - **If linked to a GitHub Issue**: `[IssueID]-[feature-name].md`.
   - **If not linked**: `[feature-name].md` (no number prefix).
3. Populate the **Objective** by scraping/reading the linked GitHub Issue (if applicable).
4. Draft the **Technical Strategy** and **Task List**.
5. Stop and ask for human approval of the plan before coding.

### 📊 Spec Status Lifecycle

| Status                  | Meaning & Next Action                                                                |
| :---------------------- | :----------------------------------------------------------------------------------- |
| **`🟠 Pending`**        | Spec is drafted, awaiting alignment / green light before implementation starts.      |
| **`🔵 In Progress`**    | Actively being developed, tested, and verified on its branch.                        |
| **`🟡 To be reviewed`** | Implementation and verification complete, branch pushed, PR ready for GitHub review. |
| **`🟢 Completed`**      | PR approved, spec archived to `specs/completed/`, release notes posted.              |
| **`🔴 Blocked`**        | Blocked by external dependency, environment issue, or technical question.            |

### 🔄 State Transition Triggers

1. **Creation (`🟠 Pending`)**: Initial state when drafting any new spec in `specs/pending/`. No functional code written yet.
2. **Kickoff (`🟠 Pending` ➔ `🔵 In Progress`)**: Triggered when human developer gives explicit confirmation ("yes", "go", "approved"). Update status and begin implementation.
3. **Handover for Review (`🔵 In Progress` ➔ `🟡 To be reviewed`)**: Triggered when all checklist items `[x]` are done, tests pass, docs/SEO are audited, and PR is ready for human review.
4. **Approval & Archival (`🟡 To be reviewed` ➔ `🟢 Completed`)**: Triggered strictly AFTER human developer approves the PR on GitHub. Bump versions, mark completed, move to `specs/completed/`, commit archival, post release notes PR comment, and merge.
5. **Blocker (`*` ➔ `🔴 Blocked`)**: Triggered when blocked by external issue or question. Update status and request guidance.

## 📂 Folder Roles

- `specs/pending/`: Active "Source of Truth" for current work.
- `specs/completed/`: Historical record of technical decisions.
- `specs/template.md`: The blueprint for all new work.

## 📖 Reference Material

- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Contains workflow, commands, versioning policies, and SDD protocols.
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: Contains technical deep-dives (e.g., "Bake & Clean" algorithm) and testing strategies.

Always consult these documents for implementation details and architectural integrity.
