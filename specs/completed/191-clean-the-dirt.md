# Spec: 191 - Clean the Dirt

**GitHub Issue**: [#191](https://github.com/GehDoc/svg-to-video/issues/191)
**Status**: 🟢 Completed

## 🎯 Objective

Remove Glama references, badges, and metadata file, replace `mcp-proxy` with `supergateway` for MCP SSE proxying, delete the non-functional `dependabot-enable-automerge.yml` GitHub workflow, and bump the package version to v0.28.1.

## 🛠 Technical Strategy

- **Glama Cleanup**: Remove `glama.json` and all mentions/links in web app frontend (`constants.ts`, `SeoFallback.tsx`, `layout.tsx`), `README.md`, and `docs/MCP.md`.
- **MCP SSE Proxy Migration**: Replace `mcp-proxy` with `supergateway` in `package.json`, `docker-entrypoint.sh`, and documentation files (`docs/MCP.md`, `docs/SECURITY.md`, `CONTRIBUTING.md`).
- **Workflow Cleanup**: Remove `.github/workflows/dependabot-enable-automerge.yml`.
- **Version Bump**: Bump version to `0.28.1` across `package.json`, `web/package.json`, and `mcp.json`.

## ✅ Task List

- [x] **Infrastructure & Tooling Cleanup**
  - [x] Delete `glama.json`
  - [x] Delete `.github/workflows/dependabot-enable-automerge.yml`
  - [x] Replace `mcp-proxy` with `supergateway` in `package.json` and update `mcp:sse` / `start:mcp:sse` scripts
  - [x] Update `docker-entrypoint.sh` to use `supergateway`
  - [x] Run `npm install` to update `package-lock.json`
- [x] **Documentation & SEO**
  - [x] Remove Glama badge and reference from `README.md`
  - [x] Update `docs/MCP.md`, `docs/SECURITY.md`, and `CONTRIBUTING.md`
  - [x] Update `web/src/utils/constants.ts`, `web/src/components/SeoFallback.tsx`, and `web/src/app/layout.tsx`
- [x] **Release Preparation**
  - [x] Bump version to 0.28.1 in `package.json`, `web/package.json`, and `mcp.json`

## 🧪 Verification Plan

- [ ] Run `grep -rn -i "glama" .` (excluding git history) to ensure zero Glama references remain
- [ ] Run `grep -rn "mcp-proxy" .` to verify no old proxy references remain
- [ ] Run `npm run check:fast` to verify linting, formatting, and type checks
- [ ] Run `npm run test:unit` and `npm run test:mcp` to verify test suite passing

## 📝 Change Log

- _2026-10-01: Initial spec created for issue #191._
