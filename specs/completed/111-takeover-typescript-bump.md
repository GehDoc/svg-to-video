# Spec: Takeover Dependabot PR #111 (TypeScript Upgrade)

- **Issue / PR**: https://github.com/GehDoc/svg-to-video/pull/111
- **Status**: 🟢 Completed
- **Author**: Jules

## 🎯 Objective

Take over Dependabot PR #111 (`build(deps-dev): bump typescript from 5.9.3 to 7.0.2`).
Retarget the upgrade to TypeScript 6.0.3 (the latest TypeScript 6.x release compatible with `@typescript-eslint` v8) across root and web workspaces without relying on deprecation suppressions.

## 📐 Technical Strategy & Analysis

1. **Dependabot PR Analysis**:
   - Dependabot created PR #111 attempting to upgrade `typescript` from `5.9.3` to `7.0.2`.
   - Upgrading to `7.0.2` fails because `@typescript-eslint` v8 has a peer dependency requirement of `typescript <6.1.0`.
2. **Retargeting Upgrade**:
   - Upgraded `typescript` to `^6.0.3` in root `package.json` and `~6.0.3` in `web/package.json`.
   - Removed deprecated `baseUrl` setting from `tsconfig.json` so no deprecation suppression flags are needed.
   - Ran `npm install` to update `package-lock.json`.
3. **Verification**:
   - Ran `npm run check:fast` to ensure `eslint`, `prettier`, and `tsc` pass cleanly across root and web workspaces.
   - Ran `npm run test:unit -w web` to ensure unit tests pass.

## 📋 Task List

- [x] Take over ownership of PR #111 from Dependabot.
- [x] Bump TypeScript to 6.0.3 in `package.json`, `web/package.json`, and lockfile.
- [x] Remove deprecated `baseUrl` in `tsconfig.json`.
- [x] Verify linting, type-checking, and tests pass.
- [x] Document technical evaluation in SDD specification.
