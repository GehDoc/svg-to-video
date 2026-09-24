# Spec: Fix CLI Build Execution, Add Dist/Npx/Docker Smoke Tests, Consolidate ESLint 9 & Realign Local/Remote Docs

**GitHub Issue**: None (Unlinked)
**Status**: 🟠 Pending

## 🎯 Objective

Fix CLI & MCP runtime module resolution errors (`ERR_MODULE_NOT_FOUND` for `@shared/*` imports in compiled `dist/`), consolidate ESLint to a single ESLint >= 9 setup across root and `web` workspaces (eliminating version mismatch and legacy `.eslintrc.json`), add dist, npx, and Docker container smoke test assertions to prevent CI/runtime disconnects, and realign documentation (`README.md`, `CONTRIBUTING.md`, `docs/CLI.md`, `docs/MCP.md`) so remote hosted workflows (npmjs/Docker Hub) and local contributor build & run workflows are clear and coherent.

## 🛠 Technical Strategy & Investigation

- **Root Cause & CI Disconnect Discovery**:
  - **Module resolution error**: Node.js ESM subpath imports (`package.json` `imports` field) require `#` prefixes (e.g. `#shared/*`). Node rejects `@shared/*` in `package.json` `imports` as an invalid specifier key and looks in `node_modules/@shared/`, throwing `ERR_MODULE_NOT_FOUND`.
  - **Why CI passed despite broken Docker image**: The CI workflow (`.github/workflows/ci.yml`) executed `docker compose run --entrypoint "npm" svg-to-video run test:cli`. This overrode the container's default `ENTRYPOINT ["node", "dist/src/index.js"]` and ran `npx tsx src/index.ts`. Because `tsx` dynamically resolves TS path aliases from `tsconfig.json` at runtime, source execution succeeded while compiled `dist/` execution in Node/Docker failed.
  - **ESLint Version Out-of-Sync**: Root `package.json` was declaring ESLint v8 (`^8.0.0`) with legacy `.eslintrc.json`, while `web/package.json` declared ESLint v9 (`^9.39.4`) with flat config `web/eslint.config.js`. ESLint should be unified to ESLint v9 at the root level and removed as a duplicate declaration from `web/package.json`.
- **Module Resolution Fix**:
  - Replace remaining `@shared/*` imports in `src/index.ts` and `src/mcp.ts` with `#shared/*`.
  - Remove invalid `"@shared/*": "./dist/shared/*"` entry from root `package.json` `imports`.
- **ESLint Unification (ESLint >= 9 Flat Config)**:
  - Consolidate ESLint version to single ESLint >= 9 in root `package.json`.
  - Migrate root `.eslintrc.json` to flat config `eslint.config.js`.
  - Remove duplicate `eslint` declaration from `web/package.json`.
- **Smoke Testing Strategy**:
  - Extend `tests/pack.spec.ts` or add dedicated smoke tests verifying runtime execution of `node dist/src/index.js` (CLI) and `node dist/src/mcp.js` (MCP server) against compiled `dist/` JS outputs.
  - Assert local execution (`node dist/src/index.js ...`) and local tarball execution (`npx --package ./...`) run cleanly.
  - Update CI / test scripts so Docker container default `ENTRYPOINT` (`node dist/src/index.js`) is directly invoked during testing (or add a Docker entrypoint smoke test).
- **Documentation Coherency Strategy**:
  - **`README.md`**: Maintain clear end-user remote instructions (`npx @gehdoc/svg-to-video`, Docker Hub `gehdoc/svg-to-video`) and add clear cross-references to `CONTRIBUTING.md` for local building and running.
  - **`CONTRIBUTING.md`**: Deepen contributor guides with explicit sections on consuming remote packages/images vs. local source build/execution (`npm run build`, `node dist/src/index.js`, `node dist/src/mcp.js`, local tarball testing with `npm pack`, local `docker build` & default entrypoint execution).
  - **`docs/CLI.md`**: Show remote usage, local compiled execution, and link to `CONTRIBUTING.md`.
  - **`docs/MCP.md`**: Show remote usage (`npx -y @gehdoc/svg-to-video mcp`), local compiled usage (`node dist/src/mcp.js`), and link to `CONTRIBUTING.md`.

## ✅ Task List

- [ ] **Core Fix & Module Resolution**
  - [ ] Replace `@shared/*` with `#shared/*` in `src/index.ts` and `src/mcp.ts`
  - [ ] Clean up `package.json` `imports` field (remove invalid `"@shared/*"`)
  - [ ] Verify `npm run build` generates valid ES module references in `dist/`
- [ ] **ESLint 9 Unification**
  - [ ] Update root `package.json` to ESLint >= 9 (`^9.39.4`)
  - [ ] Migrate root `.eslintrc.json` to flat config `eslint.config.js`
  - [ ] Remove duplicate `eslint` entry from `web/package.json`
- [ ] **Smoke Tests & Verification**
  - [ ] Add CLI dist execution smoke test (`node dist/src/index.js`) to test suite
  - [ ] Add MCP dist execution smoke test (`node dist/src/mcp.js`) to test suite
  - [ ] Verify `npx` local tarball execution succeeds
  - [ ] Add default Docker entrypoint execution test / CI check
- [ ] **Documentation Harmonization**
  - [ ] Update `CONTRIBUTING.md` with explicit remote vs. local build & run guides for CLI, MCP, and Docker
  - [ ] Update `docs/CLI.md` with remote vs local execution examples & link to `CONTRIBUTING.md`
  - [ ] Update `docs/MCP.md` with remote vs local execution examples & link to `CONTRIBUTING.md`
  - [ ] Audit `README.md` for coherency and contributor pointers to `CONTRIBUTING.md`
- [ ] **Pre-Flight Audits**
  - [ ] Update `package.json` and SEO metadata if necessary
  - [ ] Run full project check: `npm run check`

## 🧪 Verification Plan

- [ ] Execute broken CLI command manually: `node dist/src/index.js tests/fixtures/demo-fixture.svg 60 ./out-dir/ -d 1 --format webm --force`
- [ ] Execute broken MCP command manually: `node dist/src/mcp.js --help`
- [ ] Build & run Docker image with default entrypoint: `docker run --rm gehdoc/svg-to-video --help`
- [ ] Run unified ESLint 9 check across root and web
- [ ] Run automated test suite: `npm run check`

## 📝 Change Log

- 2026-09-24: Initial spec created for CLI module resolution fix, ESLint 9 unification, smoke tests, CI Docker entrypoint analysis, and documentation alignment.
