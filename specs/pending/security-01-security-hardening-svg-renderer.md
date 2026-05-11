# Spec: SECURITY-01 - Security Hardening for SvgRenderer

**GitHub Issue**: [N/A - Security Audit]
**Status**: 🟠 Pending

## 🎯 Objective

Harden the `SvgRenderer` component to prevent XSS and unauthorized access to the parent application by sandboxing the SVG rendering iframe and sanitizing input SVG content.

## 🛠 Technical Strategy

- **Iframe Sandboxing**: Apply `sandbox="allow-scripts"` to the renderer iframe. This ensures the iframe has a unique origin, preventing it from accessing the parent window's DOM or storage, even though it's loaded via a Blob URL.
- **SVG Sanitization**: Integrate `dompurify` to strip potentially malicious scripts and event handlers from the user-provided SVG content before it is passed to the iframe.
  - **Configuration**: Use `USE_PROFILES: { svg: true }` and explicitly allow SVG animation elements: `animate`, `animateTransform`, `animateMotion`, `set`, `mpath`.
  - **Attributes**: Ensure attributes like `attributeName`, `from`, `to`, `dur`, `begin`, `repeatCount`, `values`, `keyTimes`, `keySplines`, `calcMode` are preserved.
- **Message Security**: Tighten `postMessage` communication by validating `event.origin` in the parent. Since sandboxed iframes without `allow-same-origin` have origin `"null"`, we will verify that the message is received by the expected iframe instance.
- **Origin Passing**: Since sandboxed iframes have a `null` origin, we will pass the parent origin to the iframe during initialization so it can use it for `postMessage` target origin checks if necessary.

## ✅ Task List

- [ ] **Infrastructure**
  - [ ] Add `dompurify` and `@types/dompurify` to `web` dependencies.
- [ ] **Core Logic**
  - [ ] Update `SvgRenderer/index.tsx` to include `sandbox="allow-scripts"` on the `iframe`.
  - [ ] Implement SVG sanitization logic in `SvgRenderer` using `dompurify` with animation-safe configuration.
  - [ ] Update `postMessage` handlers in `SvgRenderer` to verify that messages originate from the renderer iframe (handling the `"null"` origin case).
  - [ ] Update `renderer.js` to use `window.parent.postMessage(message, parentOrigin)` instead of `*`.
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
