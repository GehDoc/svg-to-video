# Spec: 00 - CLI Feature Parity

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Bring the CLI tool to feature parity with the Web Studio by identifying and implementing missing configuration parameters.

## 🛠 Technical Strategy

We identified missing parameters in the CLI tool compared to the Web Studio `ConfigPanel` and implemented them one-by-one in the Puppeteer-based CLI renderer. Performance optimization was investigated and cancelled as out-of-scope for this phase.

## ✅ Task List

- [ ] **Parameters Analysis & Research**
  - [x] Research Resolution/Preset implementation.
  - [x] Research Scale implementation.
  - [x] Research Transparent Background implementation.
  - [x] Research Background Color implementation.
- [ ] **Implementation**
  - [x] Implement Resolution/Preset argument.
  - [x] Implement Scale argument.
  - [x] Implement Transparent Background argument.
  - [x] Implement Background Color argument.
- [ ] **Documentation & Verification**
  - [x] Update README and CLI docs.
  - [x] Add unit/e2e tests for each parameter.
  - [x] Verify CLI defaults match Web Studio default values.

## 🧪 Verification Plan

- [x] Manual Test: Run the CLI with new arguments and verify output video properties.
- [x] Automated Test: Add test cases to `tests/e2e.test.mjs` or `src/utils/` for each parameter.

## 📝 Change Log

- 2026-05-14: Initial spec created.
- 2026-05-14: Feature parity implemented, tests added, documentation updated. Optimization cancelled.
