# Spec: SECURITY-01 - Security Hardening for SvgRenderer

**GitHub Issue**: [N/A - Security Audit]
**Status**: 🟠 Pending

## 🎯 Objective

Harden the `SvgRenderer` component to prevent XSS and unauthorized access to the parent application by sandboxing the SVG rendering iframe and sanitizing input SVG content.

## 🛠 Technical Strategy

- **Iframe Sandboxing**: Apply `sandbox="allow-scripts"` to the renderer iframe. This ensures the iframe has a unique origin, preventing it from accessing the parent window's DOM or storage, even though it's loaded via a Blob URL.
- **SVG Sanitization**: Integrate `dompurify` to strip potentially malicious scripts and event handlers from the user-provided SVG content before it is passed to the iframe. We must ensure SMIL animations and required SVG attributes are preserved.
- **Message Security**: Tighten `postMessage` communication by validating `event.origin` in the parent and specifying a target origin (where possible) when sending messages.
- **Origin Passing**: Since sandboxed iframes have a `null` origin, we will pass the parent origin to the iframe during initialization so it can use it for `postMessage` target origin checks if necessary, or at least the parent can verify the message came from the expected source.

## ✅ Task List

- [ ] **Infrastructure**
  - [ ] Add `dompurify` and `@types/dompurify` to `web` dependencies.
- [ ] **Core Logic**
  - [ ] Update `SvgRenderer/index.tsx` to include `sandbox="allow-scripts"` on the `iframe`.
  - [ ] Implement SVG sanitization logic in `SvgRenderer` before calling `internalLoad`.
  - [ ] Update `postMessage` handlers in `SvgRenderer` to verify `event.origin`. Note: Sandboxed iframes without `allow-same-origin` have origin `"null"`.
  - [ ] Update `renderer.js` to use a more secure `postMessage` pattern if possible.
- [ ] **Verification**
  - [ ] Verify that valid SVG animations (SMIL and CSS) still work.
  - [ ] Verify that a malicious SVG with `<script>alert(1)</script>` or `onload="alert(1)"` no longer executes or is contained.

## 🧪 Verification Plan

- [ ] **Manual Test**: Load an SVG containing `<script>parent.document.body.innerHTML = 'HACKED'</script>`. Verify it fails to modify the parent.
- [ ] **Manual Test**: Load an SVG with SMIL animation. Verify it still animates correctly in the monitor.
- [ ] **Automated Test**: Add a unit test in `web/src/components/SvgRenderer/SvgRenderer.test.tsx` (or similar) that attempts to load a malicious SVG and checks if the renderer remains functional and safe.

## 📝 Change Log

- 2026-05-11: Initial spec created by Gemini CLI.
