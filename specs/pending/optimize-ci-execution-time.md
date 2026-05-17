# Spec: Optimize CI Execution Time

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Reduce the wall-clock time of the CI pipeline by parallelizing independent test suites and optimizing redundant steps.

## 🛠 Technical Strategy

- **Parallelization**: Decompose the monolithic `web-tests` and `tests` jobs into smaller, independent jobs that can run concurrently on GitHub Actions.
- **Matrix Strategy**: Use GitHub Actions matrix to run Storybook tests for different themes (light/dark) in parallel.
- **Dependency Optimization**: Leverage `actions/setup-node` caching effectively across all jobs.
- **Docker Optimization**: Keep the Docker-based CLI tests but ensure they don't block faster checks.

## ✅ Task List

- [ ] **Research & Analysis**
  - [x] Analyze current `ci.yml` and `package.json` scripts.
- [ ] **Infrastructure (CI Refactor)**
  - [ ] Split `tests` job into `lint-and-typecheck` and `cli-tests`.
  - [ ] Split `web-tests` job into `web-unit-tests`, `web-e2e-tests`, `storybook-tests`, and `visual-tests`.
  - [ ] Implement matrix strategy for `storybook-tests` (Light/Dark themes).
  - [ ] Ensure `build-web` runs in parallel with tests.
- [ ] **Optimization**
  - [ ] Optimize Playwright installation to only install required browsers (chromium).
  - [ ] Verify if `npm ci` can be further optimized or if caching is sufficient.
- [ ] **Verification**
  - [ ] Trigger CI on a PR and monitor execution times.
  - [ ] Ensure all tests still pass and provide coverage as before.

## 🧪 Verification Plan

- [ ] Manual Test: Push changes to a branch and observe the GitHub Actions workflow graph.
- [ ] Automated Test: Check that all jobs in the new pipeline complete successfully.
- [ ] Performance Metric: Compare the total execution time of the new pipeline vs the previous version (aiming for >30% reduction in wall-clock time).

## 📝 Change Log

- 2026-05-17: Initial spec created by Gemini CLI.
