# Spec: umami-analytics-integration - Umami Analytics Implementation

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Integrate Umami Analytics into the Vite/React SPA to track page visits and user conversions (SVG to Video) without using cookies or tracking in non-production environments.

## 🛠 Technical Strategy

- **Core Technologies**: Umami Analytics, Vite, React
- **Architecture**:
  - Script injection in `web/index.html` with production-only logic.
  - Declarative event tracking for "Open Converter".
  - Programmatic event tracking for conversion lifecycle and user actions.
  - Umami automatically tracks page views (visit counter).
- **Key Dependencies**: None (Umami is loaded via script tag)

## ✅ Task List

- [ ] **Infrastructure**
  - [ ] Add Umami script to `web/index.html` with conditional loading (production only).
  - [ ] Configure `data-website-id`, `src`, and `data-domains` attributes.
- [ ] **Functional Tracking**
  - [ ] Add `data-umami-event="Open Converter"` to the file input label or a relevant button in `Dropzone.tsx`.
  - [ ] **Conversion Flow**:
    - [ ] Trigger `conversion-start` in `useRenderer.ts`.
    - [ ] Trigger `conversion-success` in `useRenderer.ts` with metadata `{ format: 'mp4' }`.
    - [ ] Trigger `conversion-failed` in `useRenderer.ts` with metadata `{ error: error.message }`.
  - [ ] **Result Actions (SuccessView.tsx)**:
    - [ ] Trigger `download-mp4` when the download button is clicked.
    - [ ] Trigger `back-to-studio` when the back button is clicked (to track users who didn't download).
- [ ] **Safety & Validation**
  - [ ] Ensure `window.umami` check before programmatic calls.
  - [ ] Verify script is excluded from Storybook (`web/.storybook/preview-head.html`).
  - [ ] Verify script does not load in development mode.

## 🧪 Verification Plan

- [ ] Manual Test: Run `npm run dev` and verify script is NOT loaded.
- [ ] Manual Test: Run `npm run build` and `npm run preview`, then verify script IS loaded (may need to mock production environment/domain).
- [ ] Manual Test: Check console/network tab for Umami script and event hits.

## 📝 Change Log

- 2026-05-09: Initial spec created by Gemini CLI.
