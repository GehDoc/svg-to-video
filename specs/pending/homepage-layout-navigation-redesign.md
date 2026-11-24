# Spec: Homepage Layout & Navigation Redesign for UX, Discoverability and Accessibility

**GitHub Issue**: None
**Pull Request**: [#275](https://github.com/GehDoc/svg-to-video/pull/275)
**Status**: 🟡 To be reviewed

## 🎯 Objective

Modernize the Web Studio homepage by introducing a sticky header with direct section jump navigation and sponsor action, a compact hero strip for immediate context and SEO, a bounded studio workspace, a repurposed scroll cue, streamlined editorial doc sections with crawlable anchor IDs, and a full-width site footer with version and ecosystem links.

## 🛠 Technical Strategy

- **Core Technologies**: Next.js 14, React 18/19, TypeScript, SASS (SCSS modules / design tokens), Prism.js for syntax coloring.
- **Architecture**:
  - Reorganize page layout hierarchy into distinct landmark regions: Sticky Header -> Hero Strip -> Bounded Studio Workspace (`#studio`) -> Editorial Doc Sections (`#how-to-convert`, `#formats`, `#why-svg-to-video`, `#automation`, `#faq`, `#sponsor`) -> Full-Width Site Footer.
  - Header position: switched from `position: sticky` to `position: fixed; top: 0; left: 0; right: 0; z-index: 100` with `--header-height: 48px`, container offset `padding-top: var(--header-height)`, and `scroll-padding-top: var(--header-height)` on `html` so it reliably pins to the viewport across all browsers without parent scroll container conflicts.
  - Community & Contributing footer section: dedicated "Contribute & Feedback" section featuring "Bug or Suggest Improvement ↗" and "Contributing Guide ↗".
  - Unified mobile breakpoint: sync header mobile drawer and studio workspace collapse triggers to a single breakpoint (`$mobile-breakpoint: 1024px`).
  - Studio link behavior: update Studio jump link in desktop and mobile drawer to target `#top` (navigating to the top of the page).
  - Left alignment guide: align header logo, hero strip text, studio workspace, and site footer text to the same left padding guide (`1.5rem` / `24px`).
  - Hero strip subtitle: remove awkward line wraps before "transparency" by relaxing `max-width` to flow naturally across wide viewports.
  - Studio stage refinement: remove redundant "Welcome to SVG to Video Studio" heading from LandingView to save vertical space.
  - Viewport-fitted studio fold: wrapped `<HeroStrip />` and `<main id="studio">` inside `.studio-viewport-fold` (`height: calc(100vh - var(--header-height))`), with `.hero-strip` (`flex-shrink: 0`) and `.studio-layout` (`flex: 1; min-height: 0`). This ensures that `site navigation bar + hero + workspace height === window height (100vh)` exactly, with the workspace bottom bar flush with the bottom of the window fold without truncation or empty gaps.
  - Hero typography & spacing: configured hero headline `font-size: 1.35rem` with balanced vertical spacing using `margin-top: 1.75rem` on `h1` and `margin-bottom: 1.25rem` on `p`.
  - Site footer layout: top-aligned all footer columns (`align-items: flex-start`), and structured ecosystem and contribute sections as stacked rows inside a single middle column.
  - Site footer ergonomics: place app version directly following the application name; pin "Back to top ↑" to the right across all screen sizes.
  - FAQ categorization: split `docs/FAQ.md` into distinct "Web Studio" and "CLI, Docker & MCP Automation" sections, with updated extractor generating `faqCategories` rendered in organized blocks.
  - CLI & MCP sub-sections: split automation section into dedicated "CLI & Docker Automation" (with interactive tabs for copyable one-liners and prerequisites) and "AI Agent & MCP Integration" (with step-by-step config and 1-click copyable agent prompt query).

## ✅ Task List

- [x] **Infrastructure & Branch Setup**
  - [x] Create feature branch `feat/homepage-layout-navigation-redesign`
  - [x] Initialize spec `specs/pending/homepage-layout-navigation-redesign.md`
  - [x] Commit initial spec and push to origin
- [x] **Header & Navigation Overhaul**
  - [x] Update `Header.tsx` and `Header.scss` to support desktop direct jump links + Sponsor CTA
  - [x] Add accessible mobile drawer toggle with ARIA states
  - [x] Relocate burger dropdown items (version, license, report issue) to footer & mobile drawer
- [x] **Homepage Layout & Alignment Corrections (User Feedback)**
  - [x] Fix sticky header: replace `overflow-x: hidden` with `overflow-x: clip` in `index.scss`
  - [x] Align responsive breakpoints: synchronize header drawer and studio collapse triggers to `$mobile-breakpoint`
  - [x] Update Studio navigation link to scroll to `#top`
  - [x] Align Hero and Site Footer left edge with the header logo (`padding: 1.5rem`)
  - [x] Fix Hero subtitle line wrapping so "transparency" does not break awkwardly
  - [x] Remove "Welcome to SVG to Video Studio" heading from `LandingView.tsx`
  - [x] Fix studio workspace height ergonomics so the bottom scroll cue bar is not truncated at the bottom of the viewport
  - [x] Place app version directly next to the application name in `SiteFooter.tsx`
  - [x] Ensure "Back to top ↑" is always pinned to the right in `SiteFooter.scss`
- [x] **FAQ Reordering & Documentation**
  - [x] Move GIF engine question in `docs/FAQ.md` before any CLI/MCP questions
  - [x] Regenerate `seoDocumentation.json` via `generate-seo-data.ts`
- [x] **Syntax Highlighting in Code Samples**
  - [x] Install `prismjs` and `@types/prismjs` in `web`
  - [x] Update `DevCard.tsx` to highlight code snippets using Prism.js
  - [x] Add dark syntax token styles in `DevCard.scss`
- [x] **Documentation, Security & SEO Pre-Flight**
  - [x] Run `npm run test:unit`, `npm run check:fast`, and `npm run build -w web`
  - [x] Re-verify visual alignment and responsive behavior
  - [x] Resolve visual regression test assertions and Storybook token contrast CI checks

## 🧪 Verification Plan

- [x] Automated Tests:
  - `npm run test:unit` (ensure Header, LandingView, SeoContent, SuccessView tests pass)
  - `npm run test:visual -w web` (all 3 test suites / 14 visual tests pass)
  - `npm run test:storybook -w web` (Storybook accessibility checks pass with 0 Axe contrast violations)
  - `npm run check:fast` (type-check, lint, prettier pass)
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
- 2026-11-24: Completed implementation of sticky header, hero strip, bounded studio workspace, scroll cue, stage height ergonomics, editorial anchor IDs, and full-width site footer.
- 2026-11-24: Split FAQ into Web Studio and CLI/MCP sections with dynamic category extractor.
- 2026-11-24: Split automation into copyable CLI one-liners (tabbed DevCard) and AI Agent MCP integration (step-by-step with 1-click prompt copy).
- 2026-11-24: Resolved visual regression test assertions and Storybook Axe contrast violations. Extracted subsequent semantic layout & heading hierarchy refactoring into a dedicated follow-up spec. Status set to `🟡 To be reviewed`.
