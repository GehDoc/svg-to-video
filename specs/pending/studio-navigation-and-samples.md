# Spec: Studio Navigation Improvements and Sample Re-Access

**GitHub Issue**: N/A (Unlinked)
**Status**: 🟠 Pending

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
- In `ConfigPanel` / `Dropzone`: Provide a clear "Reset / Clear SVG" action when a file is loaded so users can return to the initial landing view directly from the source panel, dispatching `trackEvent('click-home', { location: 'config' })`.

### 2. SVG Sample Gallery Re-Access (Action 2)

- Currently, once an SVG file or sample is loaded, `MonitorPanel` is replaced by `RenderingView`, hiding `LandingView` and its interactive sample cards. Users have no clean way to browse or try other samples.
- In `ConfigPanel` (Section 1: Source):
  - Below/alongside `Dropzone`, add an accessible "Browse Samples" / "Try a Sample" action button.
  - Clicking this opens an accessible Samples Modal / Drawer (or sample selector dialog) displaying the full interactive sample cards (`SampleCard`), allowing users to preview and click "Try This Sample" on another sample immediately.
  - Alternatively / additionally: in `RenderingView` or `MonitorPanel`, offer a quick "Samples" switch / button.
  - When the sample modal/drawer is opened, dispatch `trackEvent('open-samples', { location: 'config' })` (or appropriate location).
  - When a sample is selected from this view, it uses `handleSelectSample`, which automatically tracks `file-load` with `method: 'sample'`.

### 3. Analytics & Telemetry Schema Updates

- Update `shared/analytics-schema.ts`:
  - Add `'click-home'`: `{ location: 'header' | 'config' | 'monitor' }`
  - Add `'open-samples'`: `{ location: 'config' | 'monitor' }`
- Update `docs/ANALYTICS.md` event schema table with triggers, properties, and interface references.

### 4. Accessibility & UI Consistency

- Ensure Header title link behaves properly as a button (`role="button"`, `tabIndex={0}`, keyboard navigation on Enter/Space).
- Ensure sample modal/picker has proper ARIA attributes (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trapping and Escape key dismissal).
- Adhere to SCSS module rules (no inline styles, theme variables from `web/src/styles/`).

## ✅ Task List

- [ ] **Infrastructure & Telemetry Schema**
  - [ ] Add `'click-home'` and `'open-samples'` event types to `shared/analytics-schema.ts`
  - [ ] Update `docs/ANALYTICS.md` with new event definitions
- [ ] **Core Navigation Logic**
  - [ ] Add `handleHome` / `handleReset` in `web/src/components/Studio.tsx`
  - [ ] Refactor `web/src/components/Header.tsx` to accept `onHome` prop and eliminate `window.location.reload()`
  - [ ] Add keyboard navigation (Enter/Space) and ARIA attributes to Header home link
- [ ] **Sample Gallery Re-Access UI**
  - [ ] Create `SampleModal` (or sample picker component) reusable across views
  - [ ] Integrate "Browse Samples" button into `ConfigPanel` Source section
  - [ ] Add "Clear SVG / Back to Home" button in `ConfigPanel` Source section when SVG is active
- [ ] **Testing & Quality Assurance**
  - [ ] Unit tests for `Header` with `onHome` callback and keyboard events
  - [ ] Unit tests for `Studio` reset / home navigation flow
  - [ ] Unit tests for `SampleModal` / sample picker open & select flows
  - [ ] Verify Umami analytics tracking for `'click-home'` and `'open-samples'`
- [ ] **Documentation & SEO Pre-Flight**
  - [ ] Update `README.md` & `docs/ARCHITECTURE.md`
  - [ ] Audit `docs/ANALYTICS.md`
  - [ ] Verify SEO keywords & JSON-LD in `web/src/app/layout.tsx`
  - [ ] Verify static fallback description in `web/src/components/SeoFallback.tsx`

## 🧪 Verification Plan

- [ ] Unit Tests: `npm run test:unit -w web`
- [ ] Integration & Accessibility Tests: Verify dialog accessibility and focus management
- [ ] Type Checking & Linting: `npm run check:fast`

## 📝 Change Log

- 2026-11-19: Initial spec created for studio navigation and sample re-access.
