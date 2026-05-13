# Spec: Extended Output Formats & Auto-Discovery

**GitHub Issue**: [N/A]
**Status**: 🟠 Pending

## 🎯 Objective

Extend the web studio to support additional video output formats (MKV, MOV, etc.) and automatically discover their transparency support using Mediabunny and browser APIs, providing a more flexible export experience.

## 🛠 Technical Strategy

- **Core Technologies**: Mediabunny, WebCodecs API, React.
- **Architecture**:
  - **Discovery Utility**: A new utility to query `Mediabunny` and `WebCodecs` to identify which `OutputFormat` classes have encodable codecs in the current browser and whether they support alpha channel encoding. It will also capture the `mimeType` and `fileExtension` provided by Mediabunny.
  - **Dynamic Configuration**: Refactor the UI and hooks to avoid hardcoded 'mp4'/'webm' strings. Use the discovered format objects which include `id`, `label`, `extension`, `mimeType`, and `supportsAlpha`.
- **Key Dependencies**: `mediabunny`

## ✅ Task List

- [ ] **Infrastructure**
  - [ ] Implement `discoverFormats.ts` utility to list available `Mediabunny` formats, their alpha support, extensions, and MIME types.
- [ ] **Core Logic**
  - [ ] Update `RenderSettings` interface in `useRenderer.ts` to support dynamic format IDs and MIME types.
  - [ ] Update `useRenderer.ts` to use a dynamic factory for `OutputFormat` based on the selected format ID.
  - [ ] Refactor `isTransparencySupported.ts` to use discovered capabilities.
- [ ] **UI / Integration**
  - [ ] Update `ConfigPanel.tsx` to fetch and display the list of available formats.
  - [ ] Update the format selection logic to adjust the filename (extension), MIME type, and transparency toggle state.
  - [ ] Ensure "Transparent Background" checkbox is disabled/enabled based on the selected format's discovered capability.

## 🧪 Verification Plan

- [ ] Manual Test: Open the web studio and verify that the "Output Format" dropdown contains more than just MP4 and WebM (depending on browser support).
- [ ] Manual Test: Select different formats and verify that the "Transparent Background" checkbox's availability matches the format's capability (e.g., usually enabled for WebM/MKV, disabled for MP4).
- [ ] Manual Test: Perform a render for a new format (e.g., MOV or MKV) and verify the output file is valid and has the correct extension.
- [ ] Automated Test: Add a unit test for `discoverFormats` utility.

## 📝 Change Log

- 2026-05-13: Initial spec created by Gemini CLI.
