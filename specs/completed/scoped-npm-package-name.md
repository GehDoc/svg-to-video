# Spec: Scoped npm Package Migration (`@gehdoc/svg-to-video`)

**GitHub Issue**: None
**Status**: 🟢 Completed

## 🎯 Objective

Migrate the npm package name from `svg-to-video` to `@gehdoc/svg-to-video` to prevent public npm registry name collision and establish clear ownership under the `@gehdoc` scope, matching the GitHub repository and Docker Hub image conventions.

## 🛠 Technical Strategy

1. **`package.json`**: Update `"name": "@gehdoc/svg-to-video"`.
2. **Documentation & Guides**: Update all CLI and MCP invocation examples in `README.md`, `docs/CLI.md`, `docs/MCP.md`, `skills/svg-to-video/SKILL.md`, and `CONTRIBUTING.md` from `npx svg-to-video` / `npm install -g svg-to-video` to `npx @gehdoc/svg-to-video` / `npm install -g @gehdoc/svg-to-video`.
3. **Snapshot Tests (`tests/pack.spec.ts`)**: Update assertions if necessary.
4. **Verification**: Run `npm run check:fast`, `npm run build`, and `npm run test:pack`.

## ✅ Task List

- [x] **Package Configuration**
  - [x] Update root `package.json` `"name"` to `@gehdoc/svg-to-video`.
- [x] **Documentation Updates**
  - [x] Update `README.md`.
  - [x] Update `docs/CLI.md`.
  - [x] Update `docs/MCP.md`.
  - [x] Update `skills/svg-to-video/SKILL.md`.
- [x] **Verification**
  - [x] Validate compilation with `npm run build`.
  - [x] Validate tests with `npm run test:pack` and `npm run check:fast`.

## 🧪 Verification Plan

- [x] Run `npm run check:fast` and `npm run test:pack` to confirm clean validation.

## 📝 Change Log

- 2026-09-18: Initial spec created for `@gehdoc/svg-to-video` migration.
- 2026-09-18: Migrated root `package.json` `"name"` to `@gehdoc/svg-to-video`. Updated all CLI and MCP invocation references across `README.md`, `docs/CLI.md`, `docs/MCP.md`, and `SKILL.md`. Verified with `npm run test:pack` and `npm run check:fast`.
