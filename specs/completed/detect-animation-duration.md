# Spec: SVG Animation Duration Detection

**GitHub Issue**: [N/A]
**Status**: 🟢 Completed

## 🎯 Objective

Automatically detect the original duration of SVG animations (SMIL and CSS) when loading a file in the Web Studio, and update the configuration duration accordingly.

## 🛠 Technical Strategy

- **Core Technologies**: SVG DOM, SMIL, CSS Web Animations.
- **Architecture**: Utility-based analysis injected into the Studio's file loading event.
- **Key Dependencies**: `DOMParser` (browser native).

## ✅ Task List

- [x] **Core Logic**
  - [x] Implement `parseClockValue` for SVG time formats.
  - [x] Implement SMIL duration detection with repeat and `begin` delay support.
  - [x] Implement CSS animation and `transition` heuristic detection.
  - [x] Implement LCM logic for synchronization of looping animations.
  - [x] Support standalone CSS properties (`animation-duration`, `animation-delay`).
- [x] **UI / Integration**
  - [x] Create `analyzeSvgAnimation` utility.
  - [x] Hook `analyzeSvgAnimation` into `Studio`'s `onSvgContentChange`.
  - [x] Update `web/package.json` to improve test isolation and reporting.

## 🧪 Verification Plan

- [x] **Unit Tests**: `npm run test:unit -w web -- src/utils/analyzeSvgAnimation.test.ts`
  - [x] 18 test cases covering SMIL, CSS, Loops, Delays, and Transitions.
- [x] **Visual Integration Test**: `npm run test:visual -w web -- src/components/Studio.spec.tsx`

## 📝 Change Log

- 2026-05-15: Initial implementation and verification completed by Gemini CLI.
- 2026-05-15: Expanded coverage for SMIL `begin`, `repeatDur`, CSS `transition`, and complex multi-animation edge cases.
