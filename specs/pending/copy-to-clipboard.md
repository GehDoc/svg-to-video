# Spec: Copy to Clipboard Support

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Allow users to copy the exported video to their clipboard from the `SuccessView` as a Data URL or (if supported) as a video file. This improves the workflow for users who want to quickly share or embed the video without a manual download.

## 🛠 Technical Strategy

- **Core Technologies**: Async Clipboard API (`navigator.clipboard`), Data URLs.
- **Architecture**: Client-side logic in `SuccessView` component.
- **Key Dependencies**: `react-icons` (for the copy icon).
- **Analytics**: Umami tracking for all clipboard interactions.

### Implementation Details:

1. **Copy as Data URL**:
   - Fetch the `renderedUrl` (blob).
   - Convert to Base64 using `FileReader`.
   - Write to clipboard as text using `navigator.clipboard.writeText()`.
2. **Copy as Video File** (Best Effort):
   - Attempt `navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])`.
   - Since native video support is low, we will primarily offer "Copy Data URL" and label it clearly.
3. **Analytics Integration**:
   - Track `copy-to-clipboard` event with properties `type` (data-url, binary) and `success` (true, false).

## ✅ Task List

- [x] **Core Logic**
  - [x] Implement `blobToDataUrl` utility.
  - [x] Implement clipboard fallback logic (try binary, then text).
- [x] **UI / Integration**
  - [x] Add "Copy" button (or dropdown) to `SuccessView`.
  - [x] Add "Copied!" feedback state.
  - [x] Ensure accessible labeling for screen readers.
  - [x] Implement Umami tracking for clicks.
- [x] **Documentation & Policy**
  - [x] Update `docs/ANALYTICS.md` with the new event.
  - [x] Update `CONTRIBUTING.md` to mandate Umami tracking for important CTA buttons/links.

## 🧪 Verification Plan

- [x] **Manual Test**: Export a small SVG, click "Copy Data URL", paste into a text editor, verify it's a valid Data URL.
- [x] **Automated Test**: Update `SuccessView.test.tsx` to mock `navigator.clipboard` and verify it's called with the expected content. Verify that `umami.track` is called with the correct event name and properties.

## 📝 Change Log

- 2026-05-19: Initial spec created by Gemini CLI.
- 2026-05-19: Implementation complete and verified.
