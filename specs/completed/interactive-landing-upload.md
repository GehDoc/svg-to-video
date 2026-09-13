# Spec: interactive-landing-upload

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Transform the main panel upload placeholder in `LandingView` into an interactive dropzone and file selector, wired to the same file loading handlers and Umami analytics events as the left panel configuration dropzone.

## 🛠 Technical Strategy

- **Core Technologies**: React, Web APIs (FileReader, Drag and Drop API), Umami Analytics tracking
- **Architecture**: Web Studio UI Component enhancement
- **Key Components**: `LandingView`, `MonitorPanel`, `Studio`, `Dropzone`

## ✅ Task List

- [x] **Core Logic & UI Integration**
  - [x] Add drag-and-drop events and file input click triggers to `LandingView` component
  - [x] Pass file processing callbacks (`onFileChange`, `onDrop`, `isDragging`, `setIsDragging`) to `LandingView` via `MonitorPanel` & `Studio`
  - [x] Style `LandingView` upload placeholder as an interactive dropzone with hover, drag, and focus accessibility feedback in `LandingView.scss`
  - [x] Ensure Umami tracking events (`file-load`) trigger identically to left panel input (`method: 'file-picker' | 'drag-and-drop'`)
- [x] **Tests**
  - [x] Add unit tests for interactive `LandingView` in `LandingView.test.tsx`
  - [x] Add/update integration tests in `Studio.spec.tsx`
- [x] **Documentation & SEO**
  - [x] Audit `README.md` if necessary

## 🧪 Verification Plan

- [x] Manual Test: Drag & drop SVG into main panel preview area; click main panel preview area to open file picker.
- [x] Automated Test: `npm run test:unit -w web`

## 📝 Change Log

- _2026-09-13: Initial spec created by Jules agent._
- _2026-09-13: Implemented interactive LandingView dropzone & file selector and verified with unit tests._
