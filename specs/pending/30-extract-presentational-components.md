# Spec: 30 - Extract Presentational Components

**GitHub Issue**: [#30](https://github.com/GehDoc/svg-to-video/issues/30)
**Status**: 🟠 Pending

## 🎯 Objective

Refactor UI components to eliminate tight coupling with `StudioContext`, with the ultimate goal of minimizing the context's footprint or removing it entirely in favor of cleaner state management (e.g., prop drilling from top-level containers or more focused hooks).

## 🛠 Technical Strategy

- **Core Technologies**: React, TypeScript.
- **Architecture**: Move away from a monolithic `StudioContext`.
  - **Phase 1**: Extract presentational components (pure components receiving props).
  - **Phase 2**: Audit `StudioContext` state and determine if it can be moved to a top-level `App` state or split into smaller, domain-specific hooks/contexts.
  - **Phase 3**: Decouple business logic from the context provider.
- **Key Dependencies**: React state/props.

## ✅ Task List

The refactoring will be performed component by component. For each component:

1. Update the component to receive data and callbacks via props.
2. Update the parent/container (e.g., `MonitorPanel` or `ConfigPanel`) to provide the necessary props.
3. Update corresponding unit and storybook tests.
4. Verify local stability (`npm run check:fast`).
5. Commit and push the changes.

- [ ] **Infrastructure & Audit**
  - [x] Identify all components using `useContext(StudioContext)` in `web/src/components`.
  - [ ] Initialize PR for the feature branch.

- [ ] **Refactoring: SuccessView**
  - [ ] Refactor `SuccessView` to use props.
  - [ ] Update `MonitorPanel` integration.
  - [ ] Update `SuccessView.test.tsx` and stories.
  - [ ] Verify tests and commit/push.

- [ ] **Refactoring: RenderingView**
  - [ ] Refactor `RenderingView` to use props.
  - [ ] Update `MonitorPanel` integration.
  - [ ] Update `RenderingView.test.tsx` and stories.
  - [ ] Verify tests and commit/push.

- [ ] **Refactoring: ConfigPanel**
  - [ ] Refactor `ConfigPanel` (this is a large component, may need sub-splitting).
  - [ ] Update `App.tsx` integration.
  - [ ] Update `ConfigPanel.test.tsx` and stories.
  - [ ] Verify tests and commit/push.

- [ ] **Refactoring: Header** (if applicable)
  - [ ] Audit `Header.tsx` for context usage.
  - [ ] Refactor if necessary.

- [ ] **Phase 2: StudioContext Minimization**
  - [ ] Audit remaining usage in `StudioProvider`.
  - [ ] Move state to `App.tsx` or split context if beneficial.
  - [ ] Aim for total removal if possible.

- [ ] **Verification**
  - [ ] Run full E2E suite (`npm run test`).
  - [ ] Final manual verification in Web Studio.

## 🧪 Verification Plan

- [ ] Manual Test: Verify each component renders correctly in Storybook and handles interactions as expected.
- [ ] Automated Test: `npm run check`

## 📝 Change Log

- 2026-05-13: Initial spec created by Gemini CLI.
- 2026-05-13: Updated plan to follow "one-by-one" refactoring and commit workflow.
