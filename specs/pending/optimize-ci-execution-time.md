# Spec: Optimize CI Execution Time

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Reduce the wall-clock time of the CI pipeline by parallelizing independent test suites and optimizing redundant steps.

## 🛠 Technical Strategy

- **Parallelization**: Decompose the monolithic `web-tests` and `tests` jobs into smaller, independent jobs that can run concurrently on GitHub Actions.
- **Matrix Strategy**: Use GitHub Actions matrix to run Storybook tests for different themes (light/dark) in parallel.
- **Dependency Optimization**: Leverage `actions/setup-node` caching effectively across all jobs.
- **Test Parameter Optimization**: Reduce FPS to 24 across all E2E and CLI tests. Ensure video durations are minimized (e.g., 1s where possible) across all tests to reduce rendering time.
- **Enforce Default FPS**: Update the Web Studio default FPS from 60 to 24. For the CLI, update documentation and examples to promote 24 FPS as a standard.
- **Docker Optimization**: Keep the Docker-based CLI tests but ensure they don't block faster checks.

## ✅ Task List

- [ ] **Research & Analysis**
  - [x] Analyze current `ci.yml` and `package.json` scripts.
  - [x] Research current test parameters (FPS, duration) in `tests/cli.spec.ts` and `web/tests/`.
  - [x] Identify default FPS settings in Web Studio (`Studio.tsx`) and CLI (`index.ts`).
- [ ] **Infrastructure (CI Refactor)**
  - [ ] Split `tests` job into `lint-and-typecheck` and `cli-tests`.
  - [ ] Split `web-tests` job into `web-unit-tests`, `web-e2e-tests`, `storybook-tests`, and `visual-tests`.
  - [ ] Implement matrix strategy for `storybook-tests` (Light/Dark themes).
  - [ ] Ensure `build-web` runs in parallel with tests.
- [ ] **Product Optimization (FPS & Duration)**
  - [ ] Change default FPS from 60 to 24 in `web/src/components/Studio.tsx`.
  - [ ] Update `tests/cli.spec.ts` to use 24 FPS and minimize durations.
  - [ ] Update `web/tests/golden-path.spec.ts` to minimize durations (target <= 2s) and use 24 FPS.
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
