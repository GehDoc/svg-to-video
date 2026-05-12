# Spec: PR-Small-Fixes - Performance Optimizations and Analytics Enhancements

**GitHub Issue**: [N/A - PR Fixes](https://github.com/GehDoc/svg-to-video/issues/)
**Status**: 🟠 Pending

## 🎯 Objective

Improve application responsiveness by optimizing the `SvgRenderer` lifecycle and `StudioProvider` state management, while enhancing user tracking with detailed cancel events and documentation.

## 🛠 Technical Strategy

- **Core Technologies**: React (Memoization), Umami Analytics, WebCodecs (via Mediabunny)
- **Architecture**:
  - **Memoization**: Utilize `useMemo` for heavy SVG dimension parsing and `React.memo` for the `SvgRenderer` component to prevent redundant re-renders during high-frequency state updates (progress tracking).
  - **Persistence**: Refactor `MonitorPanel` to keep the `SvgRenderer` iframe mounted but hidden during the results view, ensuring instant transitions "Back to Studio".
  - **Analytics**: Programmatic event tracking using the Umami API. Ensure `typeof umami !== 'undefined'` checks.

## ✅ Task List

- [ ] **Performance Optimizations**
  - [ ] Memoize SVG dimension calculations in `StudioProvider.tsx`.
  - [ ] Wrap `SvgRenderer` in `React.memo` and ensure stable prop references.
  - [ ] Refactor `MonitorPanel.tsx` to keep the renderer mounted (CSS-based visibility).
- [ ] **Analytics Enhancements**
  - [ ] Implement `conversion-cancel` event in `useRenderer.ts`.
  - [ ] Create `docs/ANALYTICS.md` to document all Umami events and properties.
  - [ ] Link `docs/ANALYTICS.md` in `DEVELOPER.md`.
- [ ] **UI Refinement**
  - [ ] Verify "Back to Studio" transition speed improvement.

## 🧪 Verification Plan

- [ ] **Manual Test**: Start a render, observe progress (ensure `SvgRenderer` DOM doesn't flicker/update unnecessarily).
- [ ] **Manual Test**: Cancel a render and verify (via console/code) that the event is tracked.
- [ ] **Manual Test**: Click "Back to Studio" and verify it is instantaneous.
- [ ] **Automated Test**: Run `npm run check:fast` to ensure type safety and linting.
- [ ] **Automated Test**: Run `npm run test:visual` to ensure `SvgRenderer` optimizations haven't broken the "Bake & Clean" output.

## 📝 Change Log

- 2026-05-13: Initial spec created.
