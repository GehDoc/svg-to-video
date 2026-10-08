# Spec: Enhance SEO with Responsive Document Flow and Semantic Content Section

**GitHub Issue**: N/A (Unlinked feature)
**Status**: 🟠 Pending

## 🎯 Objective

Restore Google search indexation and improve organic discoverability by unlocking natural document scrolling on mobile devices (resolving Googlebot viewport screenshot truncation) and adding a comprehensive, server-rendered semantic content section (how-it-works guide, format comparison, technical capabilities, FAQ) below the Web Studio.

## 🛠 Technical Strategy

- **Responsive Viewport & Scroll Architecture**:
  - Update global styles in `web/src/index.scss` to allow `html`, `body`, `#root`, and `.app-container` to scroll naturally (`overflow: auto`, `height: auto`, `min-height: 100vh`).
  - Maintain the full-height desktop layout above the fold while allowing natural downward scroll to the informative editorial section on all viewports without cloaking (`display: none`).
- **Semantic SSR Content Component (`SeoContent.tsx`)**:
  - Create a static, accessible, semantic section in `web/src/components/SeoContent.tsx` styled via `SeoContent.scss`.
  - Content structure:
    - `<h2>` What is SVG to Video? (100% Client-Side, Privacy-First, WebCodecs Engine)
    - `<h2>` Step-by-Step Conversion Guide (How to convert animated SVGs to video/images)
    - `<h2>` Supported Formats & Capabilities (MP4, WebM with Alpha, aPNG, GIF89a)
    - `<h2>` Technical Highlights (Web Animations API frame scrubbing, Metadata injection, Data URL export)
    - `<h2>` Frequently Asked Questions (FAQ)
- **Integration**:
  - Mount `SeoContent` into `web/src/app/page.tsx` so it renders in the initial SSR payload and stays permanent in the DOM.
- **Pre-Flight Audit**:
  - Update structured data (`WebApplication` / FAQ schema if relevant), metadata in `web/src/app/layout.tsx`, and documentation.

## ✅ Task List

- [ ] **Infrastructure & Styling**
  - [ ] Refactor `web/src/index.scss` and container styles for responsive natural scroll without `!important` hacks.
  - [ ] Ensure desktop keeps clean full-height app experience above the fold with seamless scroll to editorial content.
- [ ] **Core Logic & Components**
  - [ ] Create `web/src/components/SeoContent.tsx` with rich semantic copy and structured headings.
  - [ ] Create `web/src/components/SeoContent.scss` adhering to SASS tokens, dark/light themes, and responsive breakpoints.
  - [ ] Integrate `SeoContent` into `web/src/app/page.tsx`.
- [ ] **Verification & Testing**
  - [ ] Verify SSR markup contains all textual content in initial HTML build.
  - [ ] Verify mobile and desktop responsiveness, scrolling, and theme support.
  - [ ] Run automated test suite: `npm run check:fast` and `npm run test`.
- [ ] **Documentation & SEO Pre-Flight**
  - [ ] Audit `README.md` & `docs/ARCHITECTURE.md`.
  - [ ] Audit metadata and JSON-LD in `web/src/app/layout.tsx`.
  - [ ] Audit `package.json` keywords and descriptions.

## 🧪 Verification Plan

- [ ] Manual Test:
  - Inspect responsive mobile viewport (375px - 768px) and desktop (>1024px) in browser.
  - Verify Studio controls remain 100% functional and the page scrolls smoothly to the SEO content section.
  - Verify dark and light color scheme rendering of the new section.
- [ ] Automated Test:
  - `npm run check:fast` (type-check, lint, format)
  - `npm run test` (unit and integration tests)
  - `npm run test:web` (web test suite)

## 📝 Change Log

- 2026-10-08: Initial spec created for responsive scroll architecture and rich semantic SEO content section.
