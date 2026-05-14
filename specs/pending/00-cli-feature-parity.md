# Spec: 00 - CLI Feature Parity

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Bring the CLI tool to feature parity with the Web Studio by identifying and implementing missing configuration parameters.

## 🛠 Technical Strategy

We will identify missing parameters in the CLI tool compared to the Web Studio `ConfigPanel` and implement them one-by-one in the Puppeteer-based CLI renderer. Additionally, we will investigate and implement performance improvements to the frame-by-frame capture process to match Web Studio speeds.

## ✅ Task List

- [ ] **Parameters Analysis & Research**
  - [ ] Research Resolution/Preset implementation.
  - [ ] Research Scale implementation.
  - [ ] Research Transparent Background implementation.
  - [ ] Research Background Color implementation.
  - [ ] Research CLI Performance Optimization (Frame capture bottleneck).
- [ ] **Implementation**
  - [ ] Implement Resolution/Preset argument.
  - [ ] Implement Scale argument.
  - [ ] Implement Transparent Background argument.
  - [ ] Implement Background Color argument.
  - [ ] Implement Performance Optimization improvements.
- [ ] **Documentation & Verification**
  - [ ] Update README and CLI docs.
  - [ ] Add unit/e2e tests for each parameter and performance benchmark.

## 🧪 Verification Plan

- [ ] Manual Test: Run the CLI with new arguments and verify output video properties.
- [ ] Automated Test: Add test cases to `tests/e2e.test.mjs` or `tests/unit/` for each parameter.

## 📝 Change Log

- 2026-05-14: Initial spec created.
