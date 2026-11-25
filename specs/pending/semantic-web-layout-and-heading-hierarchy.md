# Spec: Semantic Web Layout, Accessible Landmarks & Sticky Navigation

**GitHub Issue**: None
**Pull Request**: https://github.com/GehDoc/svg-to-video/pull/276
**Status**: 🟡 To be reviewed

## 🎯 Objective

Refactor the Web Studio HTML landmark structure, keyboard accessibility, and header navigation system to achieve 100% compliance with W3C semantic web standards and WCAG 2.1 criteria:

1. Establish a single-document primary landmark `<main id="main-content">` encapsulating both the interactive studio and editorial documentation across SSR and hydrated client states.
2. Provide a keyboard-focusable skip-to-content link and reserve the single document `<h1>` strictly for the primary Hero headline.
3. Implement a deterministic boundary-relative sticky header observer system (`useStickyObserver`) providing smooth scroll-elevation shadows (`--sticky-shadow`) across the desktop Hero fold, the scrollable Web Studio form sections, and two levels of editorial SEO content (section block headers and nested sub-headers / FAQ categories).

_(Note: Semantic heading level promotions `<h3>` → `<h2>` and the dedicated `StarButton` component with TanStack Query repo star caching are scoped to a dedicated follow-up spec `specs/pending/star-button-and-heading-hierarchy.md`.)_

## 🛠 Technical Strategy

### 1. Semantic Application Layout & Landmarks

- **Landmark Scope (SSR & Hydrated Client)**:
  - In `Studio.tsx`: promote `<main id="main-content" className="studio-main">` to encapsulate `HeroStrip`, `<section id="studio">`, and `SeoContent`.
  - In `page.tsx` (`!mounted` fallback): wrap `HeroStrip` and `SeoContent` inside `<main id="main-content">` so search crawlers and screen readers receive semantic landmarks in both SSR and hydrated states.
- **Single `<h1>` Document Standard**:
  - Convert application logo title in `Header.tsx` from `<h1>` to `<div className="header-title">`, leaving the Hero headline as the sole document `<h1>`.
- **Accessible Skip Link**:
  - Add an accessible, keyboard-focusable skip-link (`<a href="#main-content" className="skip-link">Skip to main content</a>`) with high-contrast focus styling in `Header.tsx` and `Header.scss`.

### 2. Sticky Headers with Dynamic Elevation Shadow

- **Hero Strip (`HeroStrip`)**:
  - Sticky on desktop/tablet with `position: sticky; top: var(--header-height, 48px); z-index: 90;` and smooth bottom elevation shadow (`--sticky-shadow`).
  - Stays `position: static` on mobile (`max-width: $mobile-breakpoint`) to conserve screen real estate.
- **Web Studio Form (`ConfigPanel`)**:
  - Sticky section headers inside the configuration column with solid disabled background (`var(--panel)`) and dynamic drop shadow activating only when content scrolls under each section.
  - Resolved mobile stickiness by ensuring `.config-content` and `.config-panel` have visible overflow on mobile viewports.
- **Editorial SEO Content (`SeoContent`)**:
  - Primary section block headers (`.block-header`) break out edge-to-edge (`100vw`) with `background: var(--panel)` and sticky pinning at `top: var(--header-height, 48px); z-index: 12`.
  - Dynamic horizontal padding (`max(1.5rem, calc(50vw - 540px + 1.5rem))`) ensures pixel-perfect text alignment with the 1080px inner container.
  - Nested Level 2 sticky sub-headers (Developer Automation sub-blocks and FAQ category titles) stick at `top: calc(var(--header-height, 48px) + 52px); z-index: 11` directly below active parent headers with matching edge-to-edge breakout and dynamic shadow.
- **Sticky State Hook (`useStickyObserver`)**:
  - Uses relative `getBoundingClientRect()` calculation against the container/viewport boundary rather than `offsetTop` to prevent layout hierarchy offsets.
  - Supports configurable `boundaryOffset` for multi-level sticky stacking.

---

## ✅ Task List

- [x] **Phase 1: Semantic Application Layout & Landmarks**
  - [x] Encompass studio workspace and SeoContent inside `<main id="main-content">` in `Studio.tsx` and `page.tsx`
  - [x] Convert header logo link to semantic `<div>` (preserving Hero as single document `<h1>`)
  - [x] Add accessible skip-to-content link with focus styles
- [x] **Phase 2: Sticky Header & Dynamic Elevation System**
  - [x] Implement sticky header behavior and bottom elevation shadow on `HeroStrip` (desktop only)
  - [x] Implement sticky headers and subtle shadow in `ConfigPanel` (desktop relative container + mobile window scrolling)
  - [x] Implement full-width breakout sticky block headers in `SeoContent`
  - [x] Implement 2nd-level nested sticky sub-headers for Developer Automation and FAQ categories
  - [x] Implement and unit-test `useStickyObserver` with `boundaryOffset` support
- [x] **Documentation, Security & SEO Pre-Flight**
  - [x] Update `docs/ARCHITECTURE.md` with Web Studio accessible landmark and sticky navigation architecture
  - [x] Audit `docs/SECURITY.md` (no subprocess calls, ephemeral files, or injection vectors introduced)
  - [x] Audit `README.md` and repo metadata
- [x] **Architecture & Maintainability Pre-Flight (`🟡 To be reviewed`)**
  - [x] CSS hygiene verified (zero hardcoded raw hex colors; semantic variables `--sticky-shadow`, `--panel`, `--bg`, etc.)
  - [x] UI stability & motion verified (no CLS layout shift, smooth elevation transitions)
  - [x] All automated verification suites passing cleanly (`check:fast`, `test:unit`, `test:storybook`, `test:visual`)
  - [x] Branch pushed and Pull Request #276 updated for human review handover

---

## 🧪 Verification Plan

- [x] Automated Tests:
  - `npm run check:fast` (ESLint, Prettier formatting, TypeScript typecheck) — PASS
  - `npm run test:unit` (26 test files, 98 unit tests) — PASS
  - `npm run test:storybook -w web` (18 storybook suites, 50 component stories) — PASS
  - `npm run test:visual -w web` (3 visual regression suites, 14 tests) — PASS
- [x] Manual & Browser Verification:
  - Verified `<main id="main-content">` wraps workspace fold and SeoContent in SSR and hydrated state.
  - Verified keyboard skip link focuses correctly and navigates to `#main-content`.
  - Verified desktop Hero sticky pinning and elevation shadow.
  - Verified ConfigPanel sticky headers stick smoothly on both desktop container scroll and mobile page scroll.
  - Verified SeoContent primary block headers and nested sub-headers / FAQ categories stick edge-to-edge with smooth shadows.

## 📝 Change Log

- 2026-11-25: Initial spec draft and branch setup.
- 2026-11-25: Completed landmark layout, skip link, and sticky header infrastructure.
- 2026-11-25: Refined ConfigPanel and SeoContent full-width breakout and nested sub-headers.
- 2026-11-26: Resolved FAQ category sticky shadow state; scoped heading hierarchy & StarButton to follow-up spec.
- 2026-11-26: Handover for human review (`🟡 To be reviewed`).
