# Spec: Copy to Clipboard Support

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Allow users to copy the exported video to their clipboard from the `SuccessView`. We will provide two distinct options:

1. **Copy as Data URL**: Specifically for developers/power users who need the raw Base64 string for embedding.
2. **Copy as Video File**: For general users who want to paste the video directly into other apps (e.g., chat, documents).

## 🛠 Technical Strategy

- **Core Technologies**: Async Clipboard API (`navigator.clipboard`), Data URLs.
- **Architecture**: Client-side logic in `SuccessView`.
- **UI Implementation**: Replace the current "Copy" button with a **split-button** or a small **dropdown menu** (e.g., "Copy..." -> ["Copy as Data URL", "Copy as Video File"]).
- **Reusable Component**: Create a reusable `CopyDropdown` component if this UI pattern is useful elsewhere, or expand `SuccessView` actions.
- **Clipboard Logic**:
  - `handleCopyDataUrl`: Convert to Base64, write to clipboard as text.
  - `handleCopyFile`: Attempt binary copy (`ClipboardItem`). If not supported, show an error toast.

### Implementation Details:

1. **Copy as Data URL**:
   - Fetch the `renderedUrl` (blob).
   - Convert to Base64 using `FileReader`.
   - Write to clipboard as text using `navigator.clipboard.writeText()`.
2. **Copy as Video File**:
   - Attempt `navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])`.
   - If not supported, show an error toast.

## 📊 Analytics Strategy

- **Goal**: Track specific user intent for copy actions to inform future UI improvements.
- **Events**:
  - `copy-data-url`: Triggered when "Copy as Data URL" is clicked.
  - `copy-file`: Triggered when "Copy as Video File" is clicked.
- **Properties**:
  - `success`: boolean (true if the clipboard write operation succeeded, false otherwise).
- **Implementation Guidelines**: Always wrap in `typeof umami !== 'undefined'` checks.

## ✅ Task List

- [ ] **Core Logic**
  - [ ] Refactor `clipboard.ts` to export individual methods: `copyDataUrl` and `copyBinaryFile`.
- [ ] **UI/Integration**
  - [ ] Implement a dropdown/split-button in `SuccessView`.
  - [ ] Implement Umami tracking for each specific method.
  - [ ] Add "Copied!" feedback state.
  - [ ] Ensure accessible labeling for screen readers.
- [ ] **Documentation & Policy**
  - [ ] Update `docs/ANALYTICS.md` with the new events.
  - [ ] Update `CONTRIBUTING.md` to mandate Umami tracking for important CTA buttons/links.
- [ ] **Logic & Testing**
  - [ ] Update unit tests in `SuccessView.test.tsx` to cover both copy options.
  - [ ] Update clipboard utility tests.

## 🧪 Verification Plan

- [ ] Manual Test: Verify both "Copy as Data URL" and "Copy as Video File" actions work as expected in a supported browser.
- [ ] Automated Test: Verify both click handlers call the correct clipboard method and tracking event.

## 📝 Change Log

- 2026-05-19: Initial spec created.
- 2026-05-20: Updated spec to include distinct copy options (Data URL vs File) and dedicated Analytics section.
