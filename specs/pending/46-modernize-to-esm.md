# Spec: 46 - Modernize Project to ESM

**GitHub Issue**: [#46](https://github.com/GehDoc/svg-to-video/issues/46)
**Status**: 🟠 Pending

## 🎯 Objective

Transition the project to pure ESM to resolve build warnings, improve compatibility with modern tooling, and align with best practices.

## 🛠 Technical Strategy

- **Core Technologies**: Node.js, Vite, CommonJS/ESM
- **Key Changes**:
  - Update `package.json` with `"type": "module"`.
  - Refactor `src/index.js` and `shared/animation-engine.js`.
  - Replace `__dirname` and `__filename` with `import.meta.url` equivalents.
  - Review and update build/linting configurations where necessary.

## ✅ Task List

- [x] **Infrastructure**
  - [x] Add `"type": "module"` to `package.json`.
- [x] **Core Logic**
  - [x] Refactor `src/index.js` to use pure ESM syntax.
  - [x] Refactor `shared/animation-engine.js` to use pure ESM syntax.
  - [x] Replace `__dirname`/\_\_filename usage in all relevant files.
- [ ] **Verification**
  - [ ] Ensure build passes (`npm run build`).
  - [ ] Ensure linting/type-checking passes.

## 🧪 Verification Plan

- [ ] Manual Test: Run the CLI application to ensure it starts correctly.
- [ ] Automated Test: Verify `npm run build` succeeds and linting is clean.

## 📝 Change Log

- 2026-05-14: Initial spec created by Gemini Agent.
