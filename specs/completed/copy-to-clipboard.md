# Spec: Copy to Clipboard Support

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Allow users to copy the exported video to their clipboard from the `SuccessView` as a **Base64 Data URL**. This improves the workflow for developers and power users who want to quickly embed the video or use it in code without manual downloads.

_(Note: "Copy as Video File" was explored but removed due to universal browser security restrictions preventing binary video writes to the system clipboard.)_

## 🛠 Technical Strategy

- **Core Technologies**: Async Clipboard API (`navigator.clipboard.writeText`), Data URLs, `FileReader`.
- **Architecture**:
  - Generic `Dropdown` component created for the design system (re-used by `HeaderDropdown`).
  - Logic isolated in `web/src/utils/clipboard.ts`.
- **UI/UX Refinements**:
  - **Visual Weight**: The "Copy Data URL" button uses a primary `outline` variant to group it with the "Download" button.
  - **Micro-interactions**: Feedback uses morphing icons (FaCheck for success, FaTimes for error) and color transitions while keeping the button text constant.
  - **Design System**: Standardized dropdown padding (0.75rem) and hover contrast across the project.

## 📊 Analytics Strategy

- **Goal**: Track user engagement with the clipboard feature.
- **Events**:
  - `copy-data-url`: Triggered when the copy button is clicked.
- **Properties**:
  - `success`: boolean (true if the operation succeeded).

## ✅ Task List

- [x] **Core Logic**
  - [x] Implement `blobToDataUrl` and `copyDataUrl` utilities.
  - [x] Create generic `Dropdown` component with 1:1 design parity with burger menu.
- [x] **UI / Integration**
  - [x] Add "Copy Data URL" button with `outline` variant.
  - [x] Implement morphing icon feedback loop (Success/Error).
  - [x] Refactor `HeaderDropdown` to use the new generic `Dropdown`.
  - [x] Apply "comfortable" padding and improved hover contrast to all dropdowns.
- [x] **Documentation & Policy**
  - [x] Update `README.md` and `web/index.html` (SEO) to advertise Data URL copying.
  - [x] Update `docs/ANALYTICS.md` with the new event.
  - [x] Update `CONTRIBUTING.md` to mandate Umami tracking for important CTAs.
- [x] **Testing & Documentation**
  - [x] Add unit tests for clipboard utility and `SuccessView`.
  - [x] Create comprehensive Storybook for `Dropdown` and `SuccessView` (with interactive states).

## 🧪 Verification Plan

- [x] **Manual Test**: Export a small SVG, click "Copy Data URL", verify icon morphs to green tick, paste into editor to confirm valid Data URL.
- [x] **Automated Test**: `npm run test:unit` passed. Verify `umami.track` and `copyDataUrl` calls.

## 📝 Change Log

- 2026-05-19: Initial spec created.
- 2026-05-20: Updated to include generic dropdown plan.
- 2026-05-21: Finalized spec to reflect "Data URL only" implementation and visual feedback refinements.
