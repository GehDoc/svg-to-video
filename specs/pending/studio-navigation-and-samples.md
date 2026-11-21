# Spec: Studio Navigation Improvements and Sample Re-Access

**GitHub Issue**: N/A (Unlinked)
**Status**: 🟡 To be reviewed

## 🎯 Objective

Improve navigation within the Web Studio by enabling seamless return to the initial welcome page (without page reloads or triggering the splash screen) and providing instant access to browse and load SVG samples at any time, backed by comprehensive Umami telemetry.

## 🛠 Technical Strategy

### 1. Seamless "Home" Navigation & Studio Reset (Action 1)

- Currently, clicking the header logo/title in `Header.tsx` runs `window.location.reload()`, which executes a hard browser refresh and restarts the entire app lifecycle, re-triggering the splash screen (`isSplashVisible`).
- Refactor `Header.tsx` to receive an `onHome?: () => void` prop.
- In `Studio.tsx`, implement `handleHome` that:
  - If a render is in progress, cancels it via `cancel()`.
  - Clears `svgContent` (set to `null`), `renderedUrl` (set to `null`), and resets settings (`duration`, `fps`, `format`, `dimensions`, etc.) back to default initial values.
  - Clears errors via `clearError()`.
  - Dispatches `trackEvent('click-home', { location: 'header' })`.
  - Instantly reveals `LandingView` inside `MonitorPanel` without any page reload or splash screen flicker.
- In `ConfigPanel` / `Dropzone`:
  - Always render both "Browse Samples" and "Clear SVG" buttons in the Source section. When no SVG is loaded (`!svgContent`) or during render, "Clear SVG" is rendered in a disabled state (`disabled={!svgContent || isRenderingOrSuccess}`), ensuring stable layout without layout shift.
  - Redesign Source action buttons and custom file upload button to eliminate ambiguous greyish borders. Ensure active buttons have prominent, crisp styling that reads distinctly as clickable buttons, with an unambiguous disabled state.
  - Replace the native browser `<input type="file">` button with a custom-styled button/trigger aligned with the studio button design tokens.
  - Keep button styles aligned with `SuccessView` actions and global `Button.scss`.

### 2. SVG Sample Gallery Re-Access (Action 2)

- Currently, once an SVG file or sample is loaded, `MonitorPanel` is replaced by `RenderingView`, hiding `LandingView` and its interactive sample cards. Users have no clean way to browse or try other samples.
- In `ConfigPanel` (Section 1: Source):
  - Below `Dropzone`, provide accessible side-by-side action buttons: "Browse Samples" and "Clear SVG".
  - The progress pane / overlay stays focused strictly on rendering status, percentage, and cancel action (no sample button in the progress overlay).
  - Clicking "Browse Samples" opens an accessible Samples Modal dialog displaying the full interactive sample cards (`SampleCard`), allowing users to preview and click "Try This Sample" on another sample immediately.
  - When the sample modal is opened, dispatch `trackEvent('open-samples', { location: 'config' })`.
  - When a sample is selected from this view, it uses `handleSelectSample`, which automatically tracks `file-load` with `method: 'sample'`.

### 3. Analytics & Telemetry Schema Updates

- Update `shared/analytics-schema.ts`:
  - `'click-home'`: `{ location: 'header' | 'config-source' }`
  - `'open-samples'`: `{ location: 'config-source' }`
  - Completely remove `'monitor'` from both schemas as sample modal is strictly invoked from `config-source`.
- Update `docs/ANALYTICS.md` with a dedicated **Telemetry Locations Reference Table** documenting all location tokens (`header`, `header-menu`, `config-source`, `success-view`), their corresponding UI components, and descriptions.

### 4. Accessibility & UI Consistency

- Ensure Header title link behaves properly as a button (`role="button"`, `tabIndex={0}`, keyboard navigation on Enter/Space).
- Ensure sample modal/picker has proper ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trapping and Escape key dismissal).
- Adhere to SCSS module rules (no inline styles, theme variables from `web/src/styles/`).

### 5. Single-Source-of-Truth State Architecture & CSS Streamlining

- **State Consolidation**: Replace 15+ decoupled `useState` hooks in `Studio.tsx` with a typed reducer hook `useStudioState` and an immutable `DEFAULT_STUDIO_CONFIG` contract.
  - The form reset in `handleHome` becomes an atomic 1-line call: `resetStudio()`.
  - Guarantees zero configuration drift between initial studio load and reset.
  - Automatically resets newly added configuration parameters without manual maintenance in reset handlers.
- **CSS Cleanliness & Maintainability**:
  - Add `@mixin sr-only` in `web/src/styles/_mixins.scss` to eliminate 11 lines of clip/rect boilerplate in `Dropzone.scss`.
  - Streamline `Button.scss` by using `pointer-events: none` on `:disabled`, eliminating all 9 `!important` declarations and 4 redundant `:disabled:hover` override blocks.
  - Leverage CSS custom properties (`var(--card)`, `var(--border)`, `var(--text)`, `var(--text-muted)`) directly, removing redundant dark mode media query duplicates.

### 6. Progress Overlay Cancel Button Stability

- Eliminate the `.invisible` wrapper and DOM swapping in `ProgressOverlay.tsx`.
- Always render the Cancel button: `<Button variant="error" disabled={!onCancel} onClick={onCancel || (() => {})}>Cancel</Button>`.
- Remove `.invisible` class from `ProgressOverlay.scss`. When idle ("Ready to Export"), the button is visible but cleanly disabled; when rendering starts, it activates, preserving layout stability without CLS.

## ✅ Task List

- [x] **Infrastructure & Telemetry Schema**
  - [x] Add `'click-home'` and `'open-samples'` event types to `shared/analytics-schema.ts`
  - [x] Update `docs/ANALYTICS.md` with new event definitions
- [x] **Core Navigation Logic**
  - [x] Add `handleHome` / `handleReset` in `web/src/components/Studio.tsx`
  - [x] Refactor `web/src/components/Header.tsx` to accept `onHome` prop and eliminate `window.location.reload()`
  - [x] Add keyboard navigation (Enter/Space) and ARIA attributes to Header home link
- [x] **Sample Gallery Re-Access UI**
  - [x] Create `SampleModal` (or sample picker component) reusable across views
  - [x] Integrate "Browse Samples" button into `ConfigPanel` Source section
  - [x] Add "Clear SVG / Back to Home" button in `ConfigPanel` Source section
- [x] **Source Section & Button Styling Alignment**
  - [x] Make "Clear SVG" always present and disabled when inactive (`!svgContent`)
  - [x] Replace native `<input type="file">` file picker button in Dropzone with unified custom button
  - [x] Refine button styles in `Button.scss`, `ConfigPanel.scss`, and `SuccessView.scss` for high contrast and consistent active/disabled cues (strictly without bouncing/bumping animations)
  - [x] Update tests to verify always-present Clear SVG button and custom file upload trigger
- [x] **Architectural Refactoring: Single Source of Truth & CSS Streamlining**
  - [x] Define `DEFAULT_STUDIO_CONFIG` and `DEFAULT_SOURCE_STATE` in `web/src/types/studio.ts`
  - [x] Implement `useStudioState` hook in `web/src/hooks/useStudioState.ts`
  - [x] Refactor `Studio.tsx` to use `useStudioState`, turning `handleHome` into an atomic 1-line reset
  - [x] Streamline `Button.scss`: eliminate `!important` tags, leverage `pointer-events: none` on `:disabled`, and use CSS custom properties cleanly
  - [x] Add `@mixin sr-only` to `web/src/styles/_mixins.scss` and adopt in `Dropzone.scss`
- [x] **PR Review Iteration: Precise Locations & Cancel Button Stability**
  - [x] Rename location `'config'` to `'config-source'` and remove `'monitor'` from `shared/analytics-schema.ts`
  - [x] Add Telemetry Locations Reference Table in `docs/ANALYTICS.md`
  - [x] Keep Cancel button persistently rendered in `ProgressOverlay.tsx` (`disabled={!onCancel}`) and remove `.invisible` CSS
  - [x] Update call sites in `Studio.tsx` and test assertions in `Studio.spec.tsx`
- [x] **Testing & Quality Assurance**
  - [x] Unit tests for `Header` with `onHome` callback and keyboard events
  - [x] Unit tests for `Studio` reset / home navigation flow
  - [x] Unit tests for `SampleModal` / sample picker open & select flows
  - [x] Verify Umami analytics tracking for `'click-home'` and `'open-samples'`
- [x] **Documentation & SEO Pre-Flight**
  - [x] Update `README.md` & `docs/ARCHITECTURE.md`
  - [x] Audit `docs/ANALYTICS.md`
  - [x] Verify SEO keywords & JSON-LD in `web/src/app/layout.tsx`
  - [x] Verify static fallback description in `web/src/components/SeoFallback.tsx`

## 🧪 Verification Plan

- [x] Unit Tests: `npm run test:unit -w web` (23 test files, 90 passed)
- [x] Storybook Tests: `npm run test:storybook -w web` (18 test files, 50 passed)
- [x] Visual Regression Tests: `npm run test:visual -w web` (3 test files, 14 passed)
- [x] E2E Smoke Tests: `npm run test:web -w web -- tests/smoke.spec.ts` (10 passed)
- [x] Type Checking & Linting: `npm run check:fast` (0 errors, 0 warnings)

## 📝 Change Log

- 2026-11-19: Initial spec created for studio navigation and sample re-access.
- 2026-11-19: Implementation and tests completed. Status changed to 🟡 To be reviewed.
- 2026-11-19: Refined button styling with high contrast borders and solid backgrounds; made Clear SVG permanently present (disabled when empty); replaced native file input with custom button in Dropzone; removed sample button from ProgressOverlay; removed all bouncing/bumping transform hover effects across all buttons and inputs.
- 2026-11-19: Architecture refactoring: consolidated studio state with `useStudioState` reducer and immutable `DEFAULT_STUDIO_CONFIG` contract for atomic form reset; streamlined CSS by eliminating all `!important` rules in `Button.scss`, adding `@mixin sr-only` in `_mixins.scss`, and unifying tokens via `--border-btn`. Status changed to 🟡 To be reviewed.
- 2026-11-21: PR review iteration: addressed comments on PR #267 by clarifying telemetry locations (`'config-source'` instead of `'config'`, dropped unused `'monitor'`), added Telemetry Locations Reference table in `docs/ANALYTICS.md`, stabilized Cancel button in `ProgressOverlay` with persistent rendering (`disabled={!onCancel}`) adhering to layout stability guidelines, and added `Idle` Storybook story. Status changed to 🟡 To be reviewed.
- 2026-11-21: Disabled pointer refinement: removed `pointer-events: none` from `.btn:disabled` and guarded variant `:hover` with `&:not(:disabled):hover` in `Button.scss`, enabling dedicated `cursor: not-allowed` across all disabled buttons.
