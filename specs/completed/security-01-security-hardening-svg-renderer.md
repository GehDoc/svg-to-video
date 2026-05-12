# Spec: SECURITY-01 - Security Hardening for SvgRenderer

**GitHub Issue**: [N/A - Security Audit]
**Status**: 🟢 Completed

## 🎯 Objective

Harden the `SvgRenderer` component to prevent XSS and unauthorized access to the parent application by sandboxing the SVG rendering iframe, while preserving full SVG feature support.

## 🛠 Technical Strategy

- **Iframe Sandboxing**: Apply `sandbox="allow-scripts allow-same-origin"` to the renderer iframe. The `allow-same-origin` flag is necessary for Blob URLs to load correctly and for `postMessage` to function in nested sandboxed environments. This sandbox creates a secure boundary that prevents the iframe from navigating the parent window or accessing its data.
- **Native SVG Security**: Rely on the native browser security model for SVG files rendered within a sandboxed iframe. Browser-level restrictions prevent execution of unauthorized inline scripts in this context. This approach ensures high-fidelity rendering for all SVG features (filters, masks, SMIL/CSS animations) without the maintenance overhead of a sanitization library.
- **Message Security**: Tighten `postMessage` communication by validating `event.source` in the parent. We verify that the message originates specifically from the expected renderer iframe instance.
- **Target Origin**: Use `parentOrigin` as the target origin for messages sent from the iframe to the parent, ensuring secure, bidirectional communication.

## ✅ Task List

- [x] **Infrastructure**
  - [x] ~~Add `dompurify` and `@types/dompurify` to `web` dependencies.~~ (Removed)
- [x] **Core Logic**
  - [x] Update `SvgRenderer/index.tsx` to include `sandbox="allow-scripts allow-same-origin"` on the `iframe`.
  - [x] ~~Implement SVG sanitization logic in `SvgRenderer` using `dompurify` with animation-safe configuration.~~ (Removed)
  - [x] Update `postMessage` handlers in `SvgRenderer` to verify that messages originate from the renderer iframe.
  - [x] Update `renderer.js` to use `parentOrigin` instead of `*`.
- [x] **UI / Storybook**
  - [x] Rename `LoopSynchronizedCapture` story to `SMILAnimation` in `SvgRenderer.stories.tsx`.
  - [x] Add/Verify a story for **CSS Animations** in `SvgRenderer.stories.tsx`.
  - [x] Add a story for **MaliciousXSS** to verify sandboxing and script containment.
  - [x] Refactor stories for natural component sizing.
- [x] **Verification**
  - [x] Verify that valid SVG animations (SMIL and CSS) still work in Storybook.
  - [x] Verify that a malicious SVG with `<script>` or `onload` attributes does not execute.
  - [x] Add frame comparison and snapshot tests for `SMILAnimation`.
  - [x] Add frame comparison and snapshot tests for `CSSAnimation`.

## 🧪 Verification Plan

- [x] **Manual Test (Security)**: Load an SVG containing `<script>window.xss_executed = true;</script>`. Verify `window.xss_executed` remains undefined.
- [x] **Manual Test (Animations)**: Open Storybook and verify animations play correctly.
- [x] **Automated Test**: Added regression tests in `web/src/components/SvgRenderer/SvgRenderer.test.tsx` for animation verification and snapshotting. Added `MaliciousXSS` play function to verify no script execution.

## 📝 Change Log

- 2026-05-11: Initial spec created.
- 2026-05-11: Finalized spec after removing DOMPurify, finalizing sandboxing strategy, and completing test implementation.
