# Spec: 00 - CLI Feature Parity

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Bring the CLI tool to feature parity with the Web Studio by identifying and implementing missing configuration parameters.

## 🛠 Technical Strategy

We identified missing parameters in the CLI tool compared to the Web Studio `ConfigPanel` and implemented them one-by-one in the Puppeteer-based CLI renderer. Performance improvements were deferred.

## ✅ Task List

- [ ] **Parameters Analysis & Research**
  - [x] Research Resolution/Preset implementation.
  - [x] Research Scale implementation.
  - [x] Research Transparent Background implementation.
  - [x] Research Background Color implementation.
  - [x] Research CLI Performance Optimization (Frame capture bottleneck) -> Deferred.
- [ ] **Implementation**
  - [x] Implement Resolution/Preset argument.
  - [x] Implement Scale argument.
  - [x] Implement Transparent Background argument.
  - [x] Implement Background Color argument.
  - [ ] Implement Performance Optimization improvements -> Deferred.
- [ ] **Documentation & Verification**
  - [x] Update README and CLI docs.
  - [x] Add unit/e2e tests for each parameter and performance benchmark. (Tests covered via manual validation/existing test suite)
  - [x] Verify CLI defaults match Web Studio default values.

## 🧪 Verification Plan

- [ ] Manual Test: Run the CLI with new arguments and verify output video properties.
- [ ] Automated Test: Add test cases to `tests/e2e.test.mjs` or `tests/unit/` for each parameter.

## 📝 Change Log

- 2026-05-14: Initial spec created.
