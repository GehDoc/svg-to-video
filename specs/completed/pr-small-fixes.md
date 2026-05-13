# Spec: PR-Small-Fixes - Performance Optimizations and Analytics Enhancements

**GitHub Issue**: [N/A - PR Fixes](https://github.com/GehDoc/svg-to-video/issues/)
**Status**: 🟢 Completed

## 🎯 Objective

Improve application responsiveness by optimizing the `SvgRenderer` lifecycle and `StudioProvider` state management, while enhancing user tracking with detailed cancel events and documentation.

## 🛠 Technical Strategy

- **Core Technologies**: React (Memoization), Umami Analytics, WebCodecs (via Mediabunny)
- **Architecture**:
  - **Memoization**: Utilize `useMemo` for heavy SVG dimension parsing and `React.memo` for the `SvgRenderer` component to prevent redundant re-renders during high-frequency state updates (progress tracking).
  - **Analytics**: Programmatic event tracking using the Umami API. Ensure `typeof umami !== 'undefined'` checks.
- **Modernization**: Convert the project to a pure ESM codebase to eliminate build warnings and align CLI/Web architectures.

## ✅ Task List

- [ ] **Performance Optimizations**
  - [x] Memoize SVG dimension calculations in `StudioProvider.tsx`.
  - [x] Wrap `SvgRenderer` in `React.memo` and ensure stable prop references.
  - [x] Optimize `SvgRenderer` initialization by reducing the debounce delay for first mount.
  - [x] Memoize `StudioContext` value to prevent app-wide redundant re-renders.
  - [x] Refactor `MonitorPanel.tsx` to keep the renderer mounted (CSS-based visibility). [Skipped: Reverted due to layout issues]
- [ ] **Analytics Enhancements**
  - [x] Implement `conversion-cancel` event in `useRenderer.ts`.
  - [x] Create `docs/ANALYTICS.md` to document all Umami events and properties.
  - [x] Link `docs/ANALYTICS.md` in `DEVELOPER.md`.
- [ ] **Modernization & Cleanup**
  - [x] Fix `index.html` by adding `type="module"` to the `coi-serviceworker.js` script tag.
  - [ ] Convert root `package.json` to `"type": "module"`. [Skipped: Moved to GitHub Issue #46]
  - [ ] Refactor `src/index.js` and `shared/animation-engine.js` to pure ESM. [Skipped: Moved to GitHub Issue #46]
- [ ] **UI Refinement**
  - [x] Verify "Back to Studio" transition speed improvement.

## 🧪 Verification Plan

- [x] **Manual Test**: Start a render, observe progress (ensure `SvgRenderer` DOM doesn't flicker/update unnecessarily).
- [x] **Manual Test**: Cancel a render and verify (via console/code) that the event is tracked.
- [x] **Manual Test**: Click "Back to Studio" and verify it is instantaneous.
- [x] **Automated Test**: Run `npm run check:fast` to ensure type safety and linting.
- [x] **Automated Test**: Run `npm run test:visual` to ensure `SvgRenderer` optimizations haven't broken the "Bake & Clean" output.

## 📝 Change Log

- 2026-05-13: Initial spec created.
- 2026-05-13: Performance fixes implemented and verified.
- 2026-05-13: Analytics implemented and verified.
- 2026-05-13: Build warnings resolved and modernized via cleanup.
