# Spec: Delay MCP Publisher Retries in Release Workflow

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Add an initial pause and a retry loop with delay to `mcp-publisher publish` step in `.github/workflows/release.yml` to prevent failures caused by npm package and Docker image propagation delays on external registries.

## 🛠 Technical Strategy

- **Core Technologies**: GitHub Actions Workflow (YAML), Bash script retry logic with sleep delays.
- **Architecture**: CI/CD Release pipeline modification.
- **Key Dependencies**: `mcp-publisher` CLI, GitHub Actions runner.

## ✅ Task List

- [x] **Workflow Updates**
  - [x] Add initial propagation delay and retry loop (up to 5 attempts with 30s delay) to `mcp-publisher publish` step in `.github/workflows/release.yml`.
- [x] **Verification**
  - [x] Verify workflow YAML syntax and check fast tests with `npm run check:fast`.

## 🧪 Verification Plan

- [x] Automated Test: `npm run check:fast` to ensure project linting, formatting, and type-checking pass.
- [x] Visual Inspection: Code review of `.github/workflows/release.yml` retry loop logic.

## 📝 Change Log

- 2025-03-09: Initial spec created by Jules.
- 2025-03-09: Updated `release.yml` with retry loop and delay, marked spec completed.
