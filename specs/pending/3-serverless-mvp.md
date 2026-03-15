# Spec: 3 - Serverless MVP

**GitHub Issue**: [https://github.com/GehDoc/svg-to-video/issues/3](https://github.com/GehDoc/svg-to-video/issues/3)
**Status**: 🟠 Pending

## 🎯 Objective

Transition the `svg-to-video` tool from a Docker-based CLI to a purely client-side Serverless Web Tool using `Mediabunny` and WebCodecs to eliminate server costs, improve privacy by keeping files local, and leverage modern browser-based rendering.

## 🛠 Technical Strategy

- **Core Technologies**: `Mediabunny` (`CanvasSource`, `Mp4OutputFormat`, `BufferTarget`), WebCodecs API, **React** (UI Framework), **Vite** (Build Tool).
- **Architecture**: **Monorepo** using NPM Workspaces (Root CLI + `web/` workspace). Shared logic residing in a `shared/` directory for parity.
- **Capture Pipeline**: Use **Internal Canvas (Path B)**. Render the SVG onto a `<canvas>` _within_ the isolated iframe to guarantee correct font and asset rendering, then transfer pixel data to the main encoder.
- **UI Responsiveness**: Offload encoding to a **Web Worker** to prevent UI freezing during long renders.
- **Resolution & Scaling**: Support "Original" size (with 1x-4x scaling) and standard presets (720p, 1080p). Default to **1080p** if no SVG dimensions are found. Ensure even-numbered dimensions.
- **SVG Isolation**: Use a hidden `<iframe>` to render the SVG, providing total style and ID isolation.
- **Asset Readiness**: Implement a robust "Pre-flight" check using `document.fonts.ready` and image `onload` events within the iframe.
- **Browser Compatibility**: Target modern browsers with native WebCodecs support. Show a clear "Unsupported Browser" error if WebCodecs is missing.
- **Audio Support**: **Explicitly excluded** for MVP.
- **Cross-Origin Isolation**: Use `coi-serviceworker.js` to enable `SharedArrayBuffer` for `Mediabunny` on GitHub Pages.
- **Local Development**: Configure `vite.config.ts` with COOP/COEP headers.

## ✅ Task List

- [ ] **Infrastructure**
  - [ ] Initialize NPM Workspaces in the root `package.json`.
  - [ ] Create `shared/` directory and migrate core `seekAnimations` logic.
  - [ ] Initialize Vite/React (TypeScript) project structure in the `web/` directory.
  - [ ] Integrate `coi-serviceworker.js` and configure `vite.config.ts` for Cross-Origin Isolation.
  - [ ] Implement `WebCodecs` compatibility check and "Unsupported Browser" error state.
- [ ] **Core Logic (Rendering Engine)**
  - [ ] Implement hidden `<iframe>` management with an **Internal Canvas capture pipeline**.
  - [ ] Implement resolution scaling and aspect-ratio fitting logic.
  - [ ] Implement **Asset Readiness check** (Wait for `document.fonts.ready` + images).
  - [ ] Implement frame-accurate scrubbing logic using the `shared/` core.
  - [ ] Create `CanvasSource` and offload encoding to a **Web Worker**.
  - [ ] Implement the "Frame Pumping" loop (Duration × FPS) with backpressure management.
- [ ] **UI / Integration**
  - [ ] Build minimalist UI: File selector (SVG), Resolution/Scale controls, Duration, FPS.
  - [ ] Add "Render & Download" button with **"Cancel" functionality** and progress feedback.
  - [ ] Implement **Auto-suggested filename** (matching the input SVG name).
  - [ ] Implement CORS-aware asset check.
  - [ ] Implement Finalize & Download logic (generating a local `Blob` URL for the MP4).

## 🧪 Verification Plan

_How will we prove this works?_

- [ ] **Manual Test**: Upload `examples/example.svg`, set 5s @ 60fps, and verify the resulting MP4 plays correctly in a standard video player.
- [ ] **Automated Test**: Add a playwright-based E2E test that simulates the file upload and verifies a download is triggered.

## 📝 Change Log

- _2026-03-15: Initial spec created by Gemini CLI based on GitHub Issue #3._
