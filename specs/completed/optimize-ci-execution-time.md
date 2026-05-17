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
- [x] **Infrastructure (CI Refactor)**
  - [x] Split `tests` job into `lint-and-typecheck` and `cli-tests`.
  - [x] Split `web-tests` job into `web-unit-tests`, `web-e2e-tests`, `storybook-tests`, and `visual-tests`.
  - [x] Implement matrix strategy for `storybook-tests` (Light/Dark themes).
  - [x] Ensure `build-web` runs in parallel with tests.
- [x] **Product Optimization (FPS & Duration)**
  - [x] Change default FPS from 60 to 24 in `web/src/components/Studio.tsx`.
  - [x] Update `tests/cli.spec.ts` to use 24 FPS and minimize durations.
  - [x] Update `web/tests/golden-path.spec.ts` to minimize durations (target <= 2s) and use 24 FPS.
- [x] **Optimization**
  - [x] Optimize Playwright installation to only install required browsers (chromium).
  - [x] Verify if `npm ci` can be further optimized or if caching is sufficient.
- [ ] **CI/CD Pipeline Integration**
  - [x] Retain `build-web` job as an independent production build smoke-test.
  - [x] Ensure all CI jobs are fully independent (no `needs` between test/build jobs) to maximize parallel execution speed.
  - [x] Update `ci.yml`: remove `needs: [build-web]` from all test jobs.
  - [x] Update `ci.yml`: remove redundant artifact upload logic.
  - [x] Update `ci.yml`: add `if: github.ref != 'refs/heads/main'` to `build-web` to prevent redundant builds on main.
  - [x] Revert `deploy.yml`: remove `needs` and artifact download logic.
  - [x] Revert `deploy.yml`: add build steps back into the deploy job.
  - [x] Update `deploy.yml`: gate deployment on all CI test jobs (lint, unit, e2e, etc.).
  - [ ] Implement central `setup` job to install dependencies once and share `node_modules` via artifacts.
  - [ ] Update documentation to reflect the new 'Setup-and-Share' architectural pattern.

## 🧪 Verification Plan

- [x] Manual Test: Push changes to a branch and observe the GitHub Actions workflow graph.
- [x] Automated Test: Check that all jobs in the new pipeline complete successfully.
- [x] Performance Metric: Compare the total execution time of the new pipeline vs the previous version (aiming for >30% reduction in wall-clock time).

## 📝 Change Log

- 2026-05-17: Initial spec created by Gemini CLI.
