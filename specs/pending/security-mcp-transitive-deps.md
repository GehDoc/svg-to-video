# Spec: Security - Patch MCP SDK Transitive Dependency Vulnerabilities

**Dependabot Alerts**: [#115](https://github.com/GehDoc/svg-to-video/security/dependabot/115) · [#116](https://github.com/GehDoc/svg-to-video/security/dependabot/116)
**Advisory**: [GHSA-6qxp-vccf-f47h](https://github.com/advisories/GHSA-6qxp-vccf-f47h) (CVE-2026-104850)
**Status**: 🟠 Pending

## 🎯 Objective

Eliminate high-severity OAuth credential-leak vulnerability in `@modelcontextprotocol/client` and `@modelcontextprotocol/sdk` introduced transitively via `supergateway`, without breaking the `supergateway@4.x` API.

## 🛠 Technical Strategy

- **Vulnerability**: `GHSA-6qxp-vccf-f47h` — MCP TypeScript SDK OAuth client could send credentials to an authorization server chosen by the MCP server.
- **Affected transitive packages** (pulled in by `supergateway@4.1.0`):
  - `@modelcontextprotocol/sdk@1.30.0` (vulnerable range: `1.12.0 – 1.30.1`)
  - `@modelcontextprotocol/client@2.0.0` (vulnerable range: `2.0.0 – 2.1.0`)
- **Direct dependency already patched**: `@modelcontextprotocol/sdk` bumped to `^1.31.1` in root `package.json`.
- **Remaining issue**: `supergateway@4.1.0` hardcodes its own copies of the SDK (`1.30.0`) and client (`2.0.0`), so they land in `node_modules/supergateway/node_modules/` despite the root fix.
- **Fix strategy**: Add npm `overrides` in `package.json` to force the patched versions for all nested copies:
  - `@modelcontextprotocol/sdk` → `>=1.31.1`
  - `@modelcontextprotocol/client` → `>=2.2.0`
- **Chosen versions**:
  - `@modelcontextprotocol/sdk@1.32.1` (latest patched)
  - `@modelcontextprotocol/client@2.3.1` (latest patched)
- **Risk**: `npm audit fix --force` would downgrade `supergateway` to `3.4.3` (breaking). Overrides avoid this.

## ✅ Task List

- [x] **Infrastructure**
  - [x] Create security branch `fix/modelcontextprotocol-security-fix`
  - [x] Update direct dependency `@modelcontextprotocol/sdk` to `^1.31.1`
  - [x] Open PR #206
- [x] **Core Fix**
  - [x] Add `overrides` for `@modelcontextprotocol/sdk` and `@modelcontextprotocol/client` in root `package.json`
  - [x] Run `npm install` to regenerate `package-lock.json`
  - [x] Verify `npm audit` reports 0 high-severity vulnerabilities
- [ ] **Verification**
  - [ ] Run `npm run test:unit` to confirm no regressions
  - [ ] Confirm `supergateway` still functions (MCP SSE bridge)

## 🧪 Verification Plan

- [ ] `npm audit` → 0 high-severity vulnerabilities
- [ ] `npm run check:fast` → no lint/format/type errors
- [ ] `npm run test:unit` → passes

## 📝 Change Log

- 2026-10-07: Security branch and direct-dep fix by user; transitive-dep spec created by agent.
