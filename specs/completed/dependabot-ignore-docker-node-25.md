# Spec: Dependabot Ignore Docker Node 25+ Base Images

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Configure Dependabot to ignore Docker base image updates for Node.js versions >= 25 in `.github/dependabot.yml` to prevent Dependabot from re-opening PRs for Node versions 25 and higher.

## 🛠 Technical Strategy

- **Configuration File**: `.github/dependabot.yml`
- **Docker Ecosystem Ignore Rule**: Update `package-ecosystem: docker` ignore entry for `node` dependency from explicit discrete version strings `['26.x', '25.x']` to standard Bundler requirement range syntax `['>= 25']`.

## ✅ Task List

- [x] **Configuration Updates**
  - [x] Update `.github/dependabot.yml` ignore rule for `node` docker base image to `versions: ['>= 25']`
- [x] **Validation & Verification**
  - [x] Run `npm run check:fast` to confirm formatting and workspace integrity
- [x] **Documentation & SDD Lifecycle**
  - [x] Move spec file to `specs/completed/dependabot-ignore-docker-node-25.md` upon completion

## 🧪 Verification Plan

- Verify YAML structure in `.github/dependabot.yml`
- Run `npm run check:fast`

## 📝 Change Log

- 2025-05-18: Initial spec created for ignoring Docker Node base image updates >= 25.
- 2025-05-18: Updated dependabot.yml ignore range to >= 25 and verified.
