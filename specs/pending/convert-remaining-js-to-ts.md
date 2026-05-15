# Spec: Convert Remaining JS to TS

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Convert all remaining JavaScript files in the project to TypeScript to achieve full type safety across the CLI tool, shared logic, and web studio components.

## 🛠 Technical Strategy

- **Core Technologies**: TypeScript
- **Architecture**:
  - Convert `src/` (CLI) to TypeScript.
  - Convert `shared/` (Animation Engine) to TypeScript.
  - Convert `web/src/components/SvgRenderer/renderer.js` to TypeScript.
  - Update `tsconfig.json` to handle new TS files and maintain `noEmit` for type-checking.
  - Use `tsx` or similar to run the CLI in development if needed, or simply update scripts to point to compiled output if we decide to emit.
  - _Decision_: For now, we will maintain the existing `noEmit` strategy for the root and use `tsx` for running/testing if necessary, or keep it simple if `node` can handle it (Node 23+ has some TS support, but we are on >=18). Actually, we should probably add a build step for the CLI if we want to distribute it as JS, or use a loader.
  - Given `package.json` has `"main": "src/index.js"`, we might need to emit or use a shim.

## ✅ Task List

- [ ] **Infrastructure**
  - [ ] Update root `tsconfig.json` to include `.ts` files.
  - [ ] Add `tsx` to devDependencies for running TS files directly during development/test.
- [ ] **Shared Logic**
  - [ ] Convert `shared/animation-engine.js` to `shared/animation-engine.ts`.
  - [ ] Remove `shared/animation-engine.d.ts` (now redundant).
- [ ] **CLI Tool**
  - [ ] Convert `src/utils/validateOptions.js` to `src/utils/validateOptions.ts`.
  - [ ] Convert `src/index.js` to `src/index.ts`.
  - [ ] Update `package.json` scripts to run TS version (e.g., using `tsx`).
- [ ] **Web Studio**
  - [ ] Convert `web/src/components/SvgRenderer/renderer.js` to `web/src/components/SvgRenderer/renderer.ts`.
  - [ ] Remove `web/src/components/SvgRenderer/renderer.d.ts` (now redundant).
  - [ ] Convert `web/src/coi-serviceworker.js` to `web/src/coi-serviceworker.ts` (verify if it's authored or external).
- [ ] **Tests**
  - [ ] Convert `src/utils/validateOptions.test.mjs` to `src/utils/validateOptions.test.ts`.
  - [ ] Ensure all tests pass with the new TS files.

## 🧪 Verification Plan

- [ ] Manual Test: Run the CLI tool with an example SVG.
- [ ] Manual Test: Run the Web Studio and perform a conversion.
- [ ] Automated Test: `npm run check` (runs lint, format, type-check, and tests).

## 📝 Change Log

- 2026-05-15: Initial spec created by Gemini CLI.
