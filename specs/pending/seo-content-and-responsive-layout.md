# Spec: Enhance SEO with Responsive Document Flow, Markdown-Driven Documentation, and Rich Studio Landing View

**GitHub Issue**: N/A (Unlinked feature)
**Status**: 🟠 Pending

## 🎯 Objective

Restore Google search indexation and maximize organic discoverability through a three-tier enhancement:

1. **Responsive Viewport & Natural Scroll**: Unlock document scrolling on mobile and desktop viewports, fixing Googlebot viewport screenshot truncation.
2. **Rich Interactive Studio Landing View**: Transform the empty preview state into a welcoming onboarding view with 1-click sample SVGs, format pills, privacy badges, and CLI/MCP snippets (matching mockup designs).
3. **Markdown-Driven SSR Documentation Section**: Auto-extract structured documentation sections from `README.md` at build/SSR time to render a rich, maintenance-free semantic guide and FAQ below the Studio.

## 🛠 Technical Strategy

### 1. Responsive Viewport & Scroll Architecture

- In `web/src/index.scss`, remove `overflow: hidden` and rigid `100vh` on `body`, `#root`, and `.app-container` for mobile, while ensuring desktop keeps a comfortable full-height workspace above the fold that smoothly scrolls down to documentation.
- Avoid CSS cloaking (`display: none` or hiding text on desktop) to maintain full Mobile-First parity.

### 2. Rich Landing View (`LandingView.tsx`)

- Enhance `LandingView` when `svgContent` is empty:
  - **Header & Onboarding**: "Welcome to SVG to Video Studio" with guidance.
  - **1-Click Sample SVGs**: Cards for "Rocket Launch", "Loading Spinner", and "Pulse / Gear" allowing instant 1-click demo conversion.
  - **Key Differentiators**: Badges for "100% Local Processing (Privacy First)" and "Alpha Channel Support (Full Transparency)".
  - **Format Badges**: Visual badges for MP4, WebM, GIF, and aPNG.
  - **CLI & MCP Ecosystem Callout**: Interactive code tabs/snippets for CLI and MCP agent integration.

### 3. Build-Time Markdown Extraction (`SeoContent.tsx`)

- Implement a lightweight build-time utility / script that parses `README.md` sections:
  - _Why SVG to Video?_ (Core value, Alpha channel, WebCodecs, Privacy)
  - _How it Works & Quick Start_ (Step-by-step conversion workflow)
  - _Supported Export Formats & Use Cases_ (MP4, WebM, aPNG, GIF)
  - _AI Agent & MCP Integration_ (Claude, Cursor, Antigravity)
  - _FAQ & Technical Architecture_ (Scrubbing engine, browser requirements)
- Render these sections into SSR-friendly semantic HTML (`<section>`, `<h2>`, `<article>`, `<code>`, `<p>`, `<ul>`) below the Studio inside `web/src/app/page.tsx`.

## ✅ Task List

- [ ] **Infrastructure & Styling**
  - [ ] Refactor `web/src/index.scss` and container classes for responsive natural scrolling.
  - [ ] Ensure dark/light mode token compatibility across all new components.
- [ ] **Studio Landing View Enhancement**
  - [ ] Add sample SVG presets in `web/src/assets/samples/`.
  - [ ] Wire `onSelectSample` callback from `LandingView` to `Studio` to instantly load sample SVGs and settings.
  - [ ] Implement sample cards, trust badges, format pills, and CLI/MCP callouts in `LandingView.tsx` and `LandingView.scss`.
- [ ] **Markdown Extraction & SSR Documentation**
  - [ ] Create build script / extractor to extract structured sections from root `README.md`.
  - [ ] Create `web/src/components/SeoContent.tsx` & `SeoContent.scss` to render extracted markdown as semantic HTML below the Studio.
  - [ ] Mount `SeoContent` in `web/src/app/page.tsx`.
- [ ] **Verification & Testing**
  - [ ] Verify 1-click sample loading and conversions in Web Studio.
  - [ ] Verify responsive layout across mobile (<768px) and desktop (>1024px).
  - [ ] Run `npm run check:fast` and `npm run test`.
- [ ] **Documentation & SEO Pre-Flight**
  - [ ] Audit `web/src/app/layout.tsx` metadata and JSON-LD schema.
  - [ ] Audit `README.md` & `docs/ARCHITECTURE.md`.
  - [ ] Audit `package.json` descriptions and keywords.

## 🧪 Verification Plan

- [ ] Manual Test:
  - Test loading each sample SVG from the landing view and verify rendering.
  - Inspect mobile viewport in browser dev tools: verify natural scroll and content visibility.
  - Verify generated static HTML (`npm run build`) contains full text and headings for crawlers.
- [ ] Automated Test:
  - `npm run check:fast` (type-check, lint, format)
  - `npm run test` (all tests)
  - `npm run test:web` (web end-to-end tests)

## 📝 Change Log

- 2026-10-08: Initial spec created.
- 2026-10-08: Updated spec to incorporate Markdown-driven documentation extraction and rich interactive landing view with 1-click samples.
