# Spec: 72 - In-Place Migration to Next.js App Router

**GitHub Issue**: [#72](https://github.com/GehDoc/svg-to-video/issues/72)
**Status**: 🟠 Pending

## 🎯 Objective

Transform the current React Single-Page Application (SPA) into a Next.js (App Router) application to enable SEO optimization through pre-rendering while strictly preserving the existing ecosystem (tests, Storybook, CI).

## 🛠 Technical Strategy

- **Core Technologies**: Next.js (App Router), React 19, TypeScript.
- **Architecture**:
  - In-place migration of the `web/` directory from Vite to Next.js.
  - Transition from Client-Side Rendering (CSR) to a Hybrid model (SSR for landing/SEO, CSR for the Studio).
  - Use of `"use client"` directive for the rendering engine and heavy UI components.
- **Key Dependencies**: `next`, `react`, `react-dom`.
- **Security**: Must maintain `COOP` and `COEP` headers for `SharedArrayBuffer` support.

## ✅ Task List

- [ ] **Phase 0: Baseline Verification**
  - [ ] Run current test suite (`npm run check`) to ensure a clean starting point.
  - [ ] Document current bundle size and SEO status (empty root div) for comparison.
- [ ] **Phase 1: Architecture Discovery & Audit**
  - [ ] Analyze `web/vite.config.ts` (Sitemap plugin, SVGR, environment variables).
  - [ ] Identify all browser-only API calls (WebCodecs, `window`, `SharedArrayBuffer`).
  - [ ] Audit SCSS modules and global styles for Next.js compatibility.
- [ ] **Phase 2: Infrastructure Setup**
  - [ ] Install `next` in the `web` workspace.
  - [ ] Create `web/next.config.js` with COOP/COEP headers and SVGR support.
  - [ ] Configure `web/tsconfig.json` for Next.js (Path aliases, `next` plugin).
  - [ ] Set up `web/src/app/layout.tsx` (Global styles, Font optimization).
- [ ] **Phase 3: Core Migration**
  - [ ] Create `web/src/app/page.tsx` as the entry point.
  - [ ] Migrate `web/src/App.tsx` logic into a client-wrapped Studio component.
  - [ ] Implement `generateMetadata` for dynamic SEO (replaces Vite version injection).
  - [ ] Safeguard all `SharedArrayBuffer` and `WebCodecs` initializations for SSR.
- [ ] **Phase 4: Ecosystem & Parity**
  - [ ] Port `vite-plugin-sitemap` functionality to `web/src/app/sitemap.ts`.
  - [ ] Update `web/package.json` scripts (`dev`, `build`, `start`).
  - [ ] Reconfigure Vitest to work with Next.js environment.
  - [ ] Update Playwright config for the new dev server URL/port.
  - [ ] Verify Storybook `@storybook/nextjs` integration.
- [ ] **Phase 5: Documentation & QA**
  - [ ] Update `docs/ARCHITECTURE.md` with Next.js architecture details.
  - [ ] Add "Browser-Only APIs" guide for future contributors.
  - [ ] Update `README.md` with new developer workflow.
  - [ ] Perform "Hydration Audit" to ensure zero console errors.

## 🧪 Verification Plan

### Manual Verification

- [ ] **SEO Content**: View raw page source (`Ctrl+U`) and verify titles/descriptions are in the HTML.
- [ ] **Security Headers**: Check Network tab for `Cross-Origin-Opener-Policy: same-origin`.
- [ ] **Studio Functionality**: Perform a full SVG-to-Video export in the dev environment.

### Automated Verification

- [ ] **Build Test**: `npm run build` in `web` must succeed without errors.
- [ ] **Test Suite**: `npm run test` (Unit, E2E, Storybook) must pass 100%.
- [ ] **Hydration Test**: Playwright test to check for hydration mismatch warnings in console logs.
- [ ] **SSR Smoke Test**: New test script to `fetch` the landing page and assert meta tags presence.

## 📝 Change Log

- 2026-05-21: Initial spec created by Gemini CLI.
- 2026-05-21: Expanded with detailed validation, security, and documentation tasks.
