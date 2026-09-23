# Spec: Replace Storybook Test Runner with Addon Vitest

**Status**: 🟢 Completed

## 🎯 Objective

Migrate Storybook component testing from `@storybook/test-runner` to `@storybook/addon-vitest` in order to leverage the existing Vite setup and eliminate security vulnerabilities caused by outdated dependencies (`uuid@8.3.2`).

## 🛠 Technical Strategy

- **Core Technologies**: `@storybook/addon-vitest`, `vitest`, `@vitest/browser-playwright`.
- **Key Changes**:
  - Replace `@storybook/test-runner` with `@storybook/addon-vitest` test execution via `vitest run -c vitest.storybook.ts`.
  - Remove `@storybook/test-runner` from `web/package.json` to eliminate legacy `uuid` package.
  - Delete `web/.storybook/test-runner.ts`.
  - Update `.github/workflows/ci.yml` so Storybook tests run directly via Vitest without spinning up a separate Storybook web server.
  - Opt-out of Storybook telemetry (`core.disableTelemetry: true`).
  - Fix pattern warnings by removing nonexistent `.mdx` story glob pattern.
  - Eliminate video asset preload timeout warnings in `SuccessView.stories.tsx` / `SuccessView.tsx`.

## ✅ Task List

- [x] **Infrastructure & Dependencies**
  - [x] Remove `@storybook/test-runner` from `web/package.json`.
  - [x] Update `"test:storybook"` script in `web/package.json` to `"vitest run -c vitest.storybook.ts"`.
  - [x] Delete `web/.storybook/test-runner.ts`.
  - [x] Configure `web/vitest.storybook.ts` for theme emulation context options.
  - [x] Update `.github/workflows/ci.yml` `storybook-tests` step.
  - [x] Add telemetry opt-out in `.storybook/main.ts`.
  - [x] Fix non-matching `.mdx` story file pattern warning.
  - [x] Fix asset preload timeout errors in `SuccessView` component/stories.
- [x] **Verification & Security**
  - [x] Run `npm install` to update `package-lock.json` and remove `uuid@8.3.2`.
  - [x] Verify `npm ls uuid` shows no remaining `uuid` dependency.
  - [x] Verify `npm run test:storybook -w web` passes cleanly without warnings or errors.
  - [x] Verify `npm run check:fast` passes.

## 🧪 Verification Plan

- Automated Test: `npm run test:storybook -w web`
- Dependency Check: `npm ls uuid`
- Full Fast Check: `npm run check:fast`

## 📝 Change Log

- 2025-02-26: Initial spec created for replacing storybook test-runner with addon-vitest. Completed implementation, PR feedback items, and verification.
