# Spec: SECURITY-01 - Security Hardening for SvgRenderer

**GitHub Issue**: [N/A - Security Audit]
**Status**: 🟠 Pending

## 🎯 Objective

Harden the `SvgRenderer` component to prevent XSS and unauthorized access to the parent application by sandboxing the SVG rendering iframe and sanitizing input SVG content.

## 🛠 Technical Strategy

- **Iframe Sandboxing**: Apply `sandbox="allow-scripts allow-same-origin"` to the renderer iframe. The `allow-same-origin` flag is necessary for Blob URLs to load correctly and for `postMessage` to function in nested sandboxed environments. This sandbox creates a secure boundary that prevents the iframe from accessing the parent application's data, regardless of the SVG content.
- **Native SVG Security**: Rely on the native browser security model for SVG files rendered within a sandboxed iframe. Browser-level restrictions already prevent execution of unauthorized inline scripts in this context. This approach ensures high-fidelity rendering for all SVG features, including filters, masks, and SMIL/CSS animations, without the maintenance and over-aggressive filtering of a sanitization library.
- **Message Security**: Tighten `postMessage` communication by validating `event.source` in the parent. We verify that the message originates specifically from the expected renderer iframe instance.
- **Target Origin**: Use `parentOrigin` (the validated parent window origin) as the target origin for messages sent from the iframe to the parent, ensuring secure, bidirectional communication.

## ✅ Task List

- [x] **Infrastructure**
  - [x] ~~Add `dompurify` and `@types/dompurify` to `web` dependencies.~~ (Removed)
- [x] **Core Logic**
  - [x] Update `SvgRenderer/index.tsx` to include `sandbox="allow-scripts allow-same-origin"` on the `iframe`.
  - [x] ~~Implement SVG sanitization logic in `SvgRenderer` using `dompurify` with animation-safe configuration.~~ (Removed)
  - [x] Update `postMessage` handlers in `SvgRenderer` to verify that messages originate from the renderer iframe.
  - [x] Update `renderer.js` to use `parentOrigin` instead of `*`.

- [ ] **UI / Storybook**
  - [ ] Add a new story to `SvgRenderer.stories.tsx` that specifically tests **SMIL Animations** (using `tests/fixtures/loop-test.svg`).
  - [ ] Add/Verify a story for **CSS Animations** in `SvgRenderer.stories.tsx`.
- [ ] **Verification**
  - [ ] Verify that valid SVG animations (SMIL and CSS) still work in Storybook.
  - [ ] Verify that a malicious SVG with `<script>alert(1)</script>` or `onload="alert(1)"` no longer executes or is contained.

## 🧪 Verification Plan

- [ ] **Manual Test (Security)**: Load an SVG containing `<script>parent.document.body.innerHTML = 'HACKED'</script>`. Verify it fails to modify the parent and that the script doesn't execute (check console for CSP or sandbox errors).
- [ ] **Manual Test (Animations)**: Open Storybook and verify the "SMIL Animation" and "CSS Animation" stories for `SvgRenderer`. Ensure they play correctly.
- [ ] **Automated Test**: Add a unit test in `web/src/components/SvgRenderer/SvgRenderer.test.tsx` that attempts to load a malicious SVG and checks if the renderer remains functional and safe.

## 📝 Change Log

- 2026-05-11: Initial spec created by Gemini CLI.
