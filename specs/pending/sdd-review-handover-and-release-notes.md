# Spec: Formalize SDD Review Handover Lifecycle and Release Note Generation

**GitHub Issue**: N/A
**Status**: 🟡 To be reviewed

## 🎯 Objective

Clarify and standardize the Spec-Driven Development (SDD) finalization workflow by establishing an explicit review handover step (`🟡 To be reviewed`), formalizing the release note generation and PR comment posting process, and harmonizing spec status definitions across `specs/template.md`, `AGENTS.md`, and `CONTRIBUTING.md`.

## 🛠 Technical Strategy

- Replicate the proven 5-stage SDD lifecycle from `SmartInfoPanel`:
  - `specs/template.md`: Add `🔵 In Progress` and `🟡 To be reviewed` states.
  - `AGENTS.md`: Update Directive 7 for Review Handover (`🟡 To be reviewed`) with strict non-merge policy, and add Directive 8 for Post-Approval Archival & Release (`🟢 Completed`). Add Spec Status Lifecycle matrix and transition triggers.
  - `CONTRIBUTING.md`: Add `## 📋 Spec-Driven Development (SDD) Protocol` and `### ⏱️ When to Bump (SDD Lifecycle)` under Versioning Policy, and specify the structured release note generation and PR comment workflow.

## ✅ Task List

- [x] **Spec Template Alignment**
  - [x] Update `specs/template.md` with `🔵 In Progress` and `🟡 To be reviewed` status options
- [x] **Agent Protocol Alignment**
  - [x] Update `AGENTS.md` Directive 7 to Review Handover (`🟡 To be reviewed`)
  - [x] Add `AGENTS.md` Directive 8 for Post-Approval Archival & Release (`🟢 Completed`)
  - [x] Add Spec Status Lifecycle table to `AGENTS.md` (streamlined, no redundant triggers)
- [x] **Documentation & Workflow Alignment**
  - [x] Add `## 📋 Spec-Driven Development (SDD) Protocol` to `CONTRIBUTING.md`
  - [x] Deprecate conflicting legacy manual SDD workflow in `CONTRIBUTING.md` in favor of single protocol
  - [x] Add `### ⏱️ When to Bump (SDD Lifecycle)` to `CONTRIBUTING.md`
  - [x] Document release notes generation and PR posting workflow in `CONTRIBUTING.md`
  - [x] Audit and normalize markdown anchors (`#` and `#-` variants) across all sections
  - [x] Validate documentation links and formatting

## 🧪 Verification Plan

- [x] Manual inspection: Verify that `specs/template.md`, `AGENTS.md`, and `CONTRIBUTING.md` statuses, directives, and lifecycles are consistent.
- [x] Git diff audit: Ensure no duplicated release note structures or conflicting guidelines.
- [x] Subagent review: Performed DRY audit and resolved all identified redundancies and misplaced anchors.

## 📝 Change Log

- 2026-11-10: Initial spec created and implemented by Antigravity agent, aligned with SmartInfoPanel SDD workflow.
- 2026-11-10: Subagent DRY documentation review completed; removed obsolete manual workflow, normalized section anchors, and eliminated redundant trigger list.
