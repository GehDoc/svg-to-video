# Spec: Homepage Layout & Navigation Redesign for UX, Discoverability and Accessibility

**GitHub Issue**: None
**Pull Request**: [#275](https://github.com/GehDoc/svg-to-video/pull/275)
**Status**: 🟡 To be reviewed

## 🎯 Objective

Modernize the Web Studio homepage by introducing a sticky header with direct section jump navigation and sponsor action, a compact hero strip for immediate context and SEO, a bounded studio workspace, a repurposed scroll cue, streamlined editorial doc sections with crawlable anchor IDs, and a full-width site footer with version and ecosystem links.

## 🛠 Technical Strategy

- **Core Technologies**: Next.js 14, React 18, TypeScript, SASS (SCSS modules / design tokens)
- **Architecture**:
  - Reorganize page layout hierarchy into distinct landmark regions: Sticky Header -> Hero Strip -> Bounded Studio Workspace (`#studio`) -> Editorial Doc Sections (`#how-to-convert`, `#formats`, `#why-svg-to-video`, `#automation`, `#faq`, `#sponsor`) -> Full-Width Site Footer.
  - Keep client-side state in `useStudioState` and heavy `Studio` mounting pattern intact to prevent hydration mismatches.
- **Key Dependencies**: `react-icons/fa`, `pkg` metadata (`package.json`), Umami telemetry tracking.
- **Header & Navigation Strategy**:
  - **Desktop (min-width: 901px)**:
    - Left: Brand logo + "SVG to Video STUDIO" (smooth jump / reset).
    - Center: `<nav className="jump-nav" aria-label="Page navigation">` with direct jump links: Studio (`#studio`), How It Works (`#how-to-convert`), Formats (`#formats`), CLI & MCP (`#automation`), FAQ (`#faq`).
    - Right: Standardized GitHub repository icon button (`<FaGithub size={20} />` with accessible label & telemetry) + prominent Sponsor action button (`pkg.funding.url`) with telemetry tracking.
  - **Mobile (max-width: 900px)**:
    - Jump links hidden; burger menu button (`<button className="menu-btn" aria-expanded={isOpen} aria-controls="mobile-drawer">`) toggles an accessible drawer.
    - Drawer contains direct jump links, GitHub repository link, Sponsor link, and Report an Issue link.
  - **Desktop Burger Item Relocation**:
    - _View Source Code_: Standardized to modern open-source convention as a dedicated `<FaGithub size={20} />` header action icon button, also included in footer ecosystem links and mobile drawer.
    - _Buy me a Coffee_: Removed / unified into header Sponsor button.
    - _Version_: Placed in full-width site footer meta (`v${pkg.version}` with commit SHA linking to release/commit).
    - _License_: Placed in footer meta (`MIT License`).
    - _Report an Issue_: Integrated in footer ecosystem links and mobile drawer.
- **Compact Hero Strip**:
  - Placed right above the studio workspace.
  - Displays `<h1>` headline and tagline from SEO data for immediate visitor clarity and search indexer extraction.
- **Bounded Studio Workspace**:
  - Clean two-column grid (`.studio-shell` / `.studio-layout`): ConfigPanel sidebar (320-350px) + MonitorPanel stage (flex-1).
  - Explicit bounded height on desktop (`min-height: 620px; max-height: 720px;` or `height: clamp(600px, calc(100vh - 160px), 740px)`) with clean bottom border.
  - Sidebar scrolls independently; stage does not spill into the editorial sections below.
- **LandingView Streamlining & Scroll Cue**:
  - Keep welcome header, interactive sample cards, privacy/alpha highlights, and format badges in LandingView.
  - Remove duplicate CLI/MCP DevCard from LandingView stage (now exclusively in `#automation`).
  - Repurpose bottom bar from static MIT notice to interactive scroll & jump cue ("More guides, format specs & automation below" with jump links `How to Convert ↓`, `Formats & Specs ↓`, `CLI, Docker & MCP ↓`, `FAQ ↓`).
- **Stage Height Ergonomics (RenderingView & SuccessView)**:
  - Optimize padding and spacing in `RenderingView.scss` and `SuccessView.scss` (`gap: 0.75rem - 1rem`, `padding: 1rem 1.25rem`).
  - Preserve `flex: 1; min-height: 0;` with `object-fit: contain` on media previews to eliminate vertical scrollbars on standard 1080p and 768p displays.
- **Full-Width Site Footer**:
  - Edge-to-edge footer replacing floating bordered `.seo-ecosystem` box.
  - Contains brand meta, version tag, ecosystem links, and "Back to top ↑" button.
- **UI, Interaction & Motion Budget**:
  - Semantic tokens from `index.scss` (`var(--bg)`, `var(--panel)`, `var(--border)`, `var(--text)`, `var(--text-muted)`, `var(--primary)`, `var(--sponsor)`).
  - Zero `!important` additions; smooth scroll behavior via CSS.
  - High accessibility: ARIA attributes, semantic headings (`h1` -> `h2` -> `h3`), keyboard navigability.

## ✅ Task List

- [x] **Infrastructure & Branch Setup**
  - [x] Create feature branch `feat/homepage-layout-navigation-redesign`
  - [x] Initialize spec `specs/pending/homepage-layout-navigation-redesign.md`
  - [x] Commit initial spec and push to origin
- [x] **Header & Navigation Overhaul**
  - [x] Update `Header.tsx` and `Header.scss` to support desktop direct jump links + Sponsor CTA
  - [x] Add accessible mobile drawer toggle (≤ 900px) with ARIA states
  - [x] Relocate burger dropdown items (version, license, report issue) to footer & mobile drawer
- [x] **Hero Strip & Page Shell**
  - [x] Create `HeroStrip` component or layout integration above studio workspace with `<h1>` headline
  - [x] Set up bounded studio container in `Studio.tsx` / `index.scss` preventing sidebar bleed
- [x] **LandingView Streamlining & Workspace Bottom Bar Cue**
  - [x] Remove CLI/MCP DevCard from `LandingView.tsx`
  - [x] Repurpose `LandingView` bottom bar into an interactive scroll cue with downward anchor links
- [x] **Stage Height Ergonomics (No Scrollbars on Standard Screens)**
  - [x] Adjust `RenderingView.scss` (padding, gap, monitor wrapper scaling)
  - [x] Adjust `SuccessView.scss` (padding, icon size, preview flex constraints)
  - [x] Verify both views fit without vertical scrollbars on 768p-1080p viewports
- [x] **Editorial & SEO Sections Refinement**
  - [x] Update `SeoContent.tsx` with explicit section anchor IDs (`#how-to-convert`, `#formats`, `#why-svg-to-video`, `#automation`, `#faq`, `#sponsor`)
  - [x] Remove redundant top `.seo-header` from `SeoContent`
  - [x] Remove old floating `.seo-ecosystem` box
- [x] **Full-Width Site Footer**
  - [x] Create `SiteFooter` component with branding, version, ecosystem links, and "Back to top ↑"
  - [x] Integrate into `page.tsx` or layout
- [x] **Documentation, Security & SEO Pre-Flight**
  - [x] Audit `README.md`, `web/src/app/layout.tsx` (meta/jsonLd), `web/src/components/SeoFallback.tsx`
  - [x] Verify test suite passing: `npm run test:unit`, `npm run check:fast`
- [x] **Architecture & Maintainability Pre-Flight (`🟡 To be reviewed`)**
  - [x] State atomicity verified (single source of truth, atomic reset, no loose duplicate setters)
  - [x] CSS hygiene verified (zero `!important`, semantic variables)
  - [x] Accessibility verified (landmark roles, ARIA attributes, keyboard navigation)
  - [x] Layout stability verified (no horizontal overflow, no vertical scrollbars in studio stage)

## 🧪 Verification Plan

- [x] Automated Tests:
  - `npm run test:unit` (ensure Header, LandingView, SeoContent, SuccessView tests pass)
  - `npm run check:fast` (type-check, lint, prettier)
- [x] Visual & Interaction Inspection:
  - Header desktop jump links smoothly scroll to correct sections
  - Header mobile drawer expands and collapses cleanly under ≤ 900px
  - Compact hero strip displays properly above studio
  - Studio workspace is bounded cleanly before editorial sections
  - LandingView bottom bar scroll cue jumps to sections
  - RenderingView and SuccessView fit in the stage without vertical scrollbars on normal screens
  - Full-width footer renders edge-to-edge with version tag and Back to top link
- [x] Build & Lint:
  - `npm run build -w web`

## 📝 Change Log

- 2026-11-24: Initial spec created by Antigravity agent based on user design brief.
- 2026-11-24: Updated spec with standardized GitHub repo icon button in header and mobile drawer.
- 2026-11-24: Completed implementation of sticky header, hero strip, bounded studio workspace, scroll cue, stage height ergonomics, editorial anchor IDs, and full-width site footer. All unit tests, fast checks, and web build passing. Status set to `🟡 To be reviewed`.
