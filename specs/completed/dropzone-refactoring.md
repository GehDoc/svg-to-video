# Spec: dropzone-refactoring

**GitHub Issue**: N/A
**Status**: 🟢 Completed

## 🎯 Objective

Refactor and enhance the pre-existing `Dropzone` component to ensure it is clean and decoupled: support clicking anywhere on the dropzone area to open the file selector, enforce strict SVG file validation, and display error messages for non-SVG files via an inline error alert/toast system.

## 🛠 Technical Strategy

- **Core Technologies**: React, Web APIs (FileReader, Drag and Drop API)
- **Architecture**: Web Studio UI Component enhancement (`Dropzone`)
- **Key Components**: `Dropzone`, `ConfigPanel`

## ✅ Task List

- [x] **Core Logic & UI Integration**
  - [x] Revert `LandingView`, `MonitorPanel`, and `Studio` file ingestion interconnections
  - [x] Make `Dropzone` container clickable anywhere (`fileInputRef.current?.click()`)
  - [x] Add strict SVG file type validation (`file.type === 'image/svg+xml'` or `.svg` extension check)
  - [x] Implement error handling and inline/toast error message for invalid non-SVG file selections or drops
- [x] **Tests**
  - [x] Update `Dropzone.test.tsx` to test click anywhere, SVG file acceptance, and error state for non-SVG files
  - [x] Update `LandingView.test.tsx` and `Studio.spec.tsx`
- [x] **Documentation & SEO**
  - [x] Audit `README.md` if necessary

## 🧪 Verification Plan

- [x] Manual Test: Click anywhere on the dropzone to trigger file selector; drop non-SVG file to verify error toast/alert is displayed.
- [x] Automated Test: `npm run test:unit -w web` and `npm run test:visual -w web`

## 📝 Change Log

- _2026-09-13: Initial spec created by Jules agent for Dropzone refactoring._
- _2026-09-14: Completed Dropzone component refactoring and verified all unit and visual tests pass._
