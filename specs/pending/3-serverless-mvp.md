# Spec: 3 - Serverless MVP

**GitHub Issue**: [https://github.com/GehDoc/svg-to-video/issues/3](https://github.com/GehDoc/svg-to-video/issues/3)
**Status**: 🟠 Pending

## 🎯 Objective

Transition the `svg-to-video` tool from a Docker-based CLI to a purely client-side Serverless Web Tool using `Mediabunny` and WebCodecs to eliminate server costs, improve privacy by keeping files local, and leverage modern browser-based rendering.

## 🛠 Technical Strategy

- **Core Technologies**: `Mediabunny` (`CanvasSource`, `Mp4OutputFormat`, `BufferTarget`), WebCodecs API (for hardware-accelerated encoding in-browser).
- **Architecture**: Single Page Application (SPA) that mirrors the original CLI arguments but runs entirely in the client's browser.
- **Key Dependencies**: `mediabunny`, `vite` (for fast local development and bundling).

## ✅ Task List

- [ ] **Infrastructure**
  - [ ] Initialize Vite/React (or Vanilla TS) project structure in a new `web/` directory.
  - [ ] Verify `mediabunny` compatibility and WebCodecs availability in target browsers.
- [ ] **Core Logic (Rendering Engine)**
  - [ ] Implement frame-accurate scrubbing logic in the browser (Port `seekAnimations` logic).
  - [ ] Create `CanvasSource` to capture SVG frames from a hidden `<canvas>` element.
  - [ ] Implement the "Frame Pumping" loop (Duration × FPS).
  - [ ] Manage backpressure by `awaiting` frame draws to ensure the encoder stays synchronized.
- [ ] **UI / Integration**
  - [ ] Build minimalist UI: File selector (SVG), Duration (number), FPS (number).
  - [ ] Add "Render & Download" button with progress feedback (Progress bar + status text).
  - [ ] Implement Finalize & Download logic (generating a local `Blob` URL for the MP4).

## 🧪 Verification Plan

_How will we prove this works?_

- [ ] **Manual Test**: Upload `examples/example.svg`, set 5s @ 60fps, and verify the resulting MP4 plays correctly in a standard video player.
- [ ] **Automated Test**: Add a playwright-based E2E test that simulates the file upload and verifies a download is triggered.

## 📝 Change Log

- _2026-03-15: Initial spec created by Gemini CLI based on GitHub Issue #3._
