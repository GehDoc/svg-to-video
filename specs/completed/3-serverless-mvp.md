# Spec: 3 - Serverless MVP

**GitHub Issue**: [https://github.com/GehDoc/svg-to-video/issues/3](https://github.com/GehDoc/svg-to-video/issues/3)
**Status**: 🟢 Completed

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

**Status**: 🟢 Completed

...

## ✅ Task List

- [x] **Infrastructure**
  - [x] Initialize NPM Workspaces in the root `package.json` (CLI + `web/`).
  - [x] Create `shared/` directory and migrate core `seekAnimations` logic.
  - [x] Initialize Vite/React (TypeScript) project structure in the `web/` directory.
  - [x] Integrate `coi-serviceworker.js` and configure `vite.config.ts` for Cross-Origin Isolation.
  - [x] Implement `WebCodecs` compatibility check and "Unsupported Browser" error state.
- [x] **Core Logic (Rendering Engine)**
  - [x] Implement hidden `<iframe>` management and **Internal Canvas capture pipeline**.
  - [x] Implement resolution scaling and aspect-ratio fitting logic.
  - [x] Implement **Asset Readiness check** (Wait for `document.fonts.ready` + images).
  - [x] Implement frame-accurate scrubbing logic using the `shared/` core.
  - [x] Create `CanvasSource` and offload encoding to a **Web Worker**. (Mediabunny uses workers internally).
  - [x] Implement the "Frame Pumping" loop (Duration × FPS) with backpressure management.
- [x] **UI / Integration**
  - [x] Build minimalist UI: File selector (SVG), Resolution/Scale controls, Duration, FPS.
  - [x] Add "Render & Download" button with **"Cancel" functionality** and progress feedback.
  - [x] Implement **Auto-suggested filename** (matching the input SVG name).
  - [x] Implement CORS-aware asset check.
  - [x] Implement Finalize & Download logic (generating a local `Blob` URL for the MP4).

## 🧪 Verification Plan

_How will we prove this works?_

- [x] **Manual Test**: Upload `examples/example.svg`, set 5s @ 60fps, and verify the resulting MP4 plays correctly in a standard video player. (Verified via Playwright E2E suite and local preview).
- [x] **Automated Test**: Playwright smoke tests verify page load and UI components.

## 📝 Change Log

- _2026-03-15: Initial spec created by Gemini CLI based on GitHub Issue #3._
- _2026-03-15: Automated verification completed. All checks passed (Lint, Format, Type-check, CLI E2E, Web E2E)._
- _2026-03-22: Final manual verification confirmed. Moving spec to completed._
