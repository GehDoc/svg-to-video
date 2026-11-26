# Spec: CI Feedback Loop Optimization

**GitHub Issue**: N/A
**Status**: 🟡 To be reviewed

## 🎯 Objective

Accelerate the GitHub Actions CI feedback loop on Pull Requests by parallelizing web build validation, cancelling stale PR runs, and moving serialized deployment and demo-generation tasks strictly to `main`.

## 🛠 Technical Strategy

- **Concurrency Management**: Introduce top-level workflow concurrency (`group: ci-${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}`) with `cancel-in-progress: ${{ github.ref != 'refs/heads/main' }}` to terminate superseded PR runs without disrupting `main` branch deployments.
- **Independent Parallel Build Verification**: Introduce a lightweight, parallel `web-build` job running `npm run build -w web` (without heavy Playwright or FFmpeg installation) alongside fast checks and tests, surfacing Next.js build errors within ~30s instead of at the end of the pipeline.
- **Gate Deployment & Publishing Work**: Restrict `build-and-deploy` to `push` events on `refs/heads/main` (`if: github.event_name == 'push' && github.ref == 'refs/heads/main'`), eliminating redundant demo video generation, ffmpeg encoding, storybook builds, and artifact packaging from PR runs.
- **Workflow Cleanliness**: Ensure `build-and-deploy` depends on all validation jobs including `web-build`, fix step syntax errors, and avoid unnecessary tool installations.

## ✅ Task List

- [x] **Analysis & Assessment**
  - [x] Assess recommendations from proposal (concurrency, parallel build check, deploy gating).
  - [x] Identify critical flaws in sample implementation (unneeded Playwright/FFmpeg in `web-build`, malformed rollback step syntax in `build-and-deploy`, unconditional cancel-in-progress).
- [x] **Workflow Refactor**
  - [x] Add concurrency configuration with protection for `main`.
  - [x] Add lightweight parallel `web-build` job to `.github/workflows/ci.yml`.
  - [x] Gate `build-and-deploy` with job-level `if: github.event_name == 'push' && github.ref == 'refs/heads/main'`.
  - [x] Add `web-build` to `needs:` in `build-and-deploy`.
- [x] **Verification & Validation**
  - [x] Validate workflow YAML syntax and consistency.
  - [x] Validate local `web-build` (`npm run build -w web`) executes cleanly.
  - [x] Run fast checks (`npm run check:fast`).
- [x] **Review Handover**
  - [x] Update spec status to `🟡 To be reviewed`.
  - [x] Document before-and-after comparison and assessment findings.

## 🧪 Verification Plan

- [x] Automated Test: `npm run check:fast` passes cleanly.
- [x] Build & Lint: Local `npm run build -w web` succeeds.
- [x] Workflow Linting / Validation: Ensure `.github/workflows/ci.yml` is valid YAML and adheres to GitHub Actions schema.

## 📝 Change Log

- 2026-11-26: Initial spec, assessment, and implementation created by Antigravity assistant.
