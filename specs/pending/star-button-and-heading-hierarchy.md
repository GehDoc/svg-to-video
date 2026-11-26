# Spec: Star Button Component, Semantic Heading Hierarchy & GitHub Rating Integration

**GitHub Issue**: None
**Pull Request**: https://github.com/GehDoc/svg-to-video/pull/277
**Status**: 🟡 To be reviewed

## 🎯 Objective

1. Promote HTML heading levels and list markup across `SeoContent` to establish a strict, W3C-compliant single-`h1` heading tree (`<h2>` section titles, `<h3>` sub-sections, `<h4>` FAQ questions, and semantic `<ol>` / `<li>` conversion steps).
2. Create a dedicated standalone `StarButton` component powered by `@tanstack/react-query` to fetch and display the live repository star count with offline resilience and zero layout shift.
3. Rename all instances of "Sponsor on GitHub" to "Sponsor me on GitHub" across UI components and update `#sponsor` to a dual-card `#support` section (Star on GitHub & Sponsor).
4. Introduce a unified dual-theme Storybook accessibility runner (`test:storybook:all`) ensuring 0 WCAG/Axe contrast violations across light and dark themes.

---

## 🛠 Technical Strategy

### 1. Semantic Heading Hierarchy & Ordered Lists

- **Heading Level Hierarchy**: Resolve heading level skips in `SeoContent.tsx` by promoting top-level documentation sections (`#why-convert`, `#how-to-convert`, `#formats`, `#automation`, `#faq`, `#support`) from `<h3>` to `<h2>`.
- **Sub-section Hierarchy**: Promote nested sub-headings from `<h4>` to `<h3>` (feature card titles, CLI & Docker Automation, AI Agent & MCP Integration, FAQ category titles).
- **FAQ Item Hierarchy**: Promote individual FAQ questions from `<h5>` to `<h4>`.
- **Ordered List Semantics**: Convert the conversion sequence in "How to Convert" from generic `<div>` wrappers to semantic `<ol className="steps-container">` and `<li className="step-card">`.
- **Test Alignment**: Update unit tests in `SeoContent.test.tsx` expecting heading `level: 2` and `level: 3`.

### 2. Dedicated StarButton Component & TanStack React Query

- **TanStack React Query Integration**:
  - Install `@tanstack/react-query` in `web/package.json`.
  - Add a lightweight client provider (`web/src/components/Providers.tsx`) in Next.js App Router layout (`layout.tsx`).
  - Implement custom hook `useGitHubRepoStars()` querying `https://api.github.com/repos/GehDoc/svg-to-video`.
  - Configure resilient cache policy (`staleTime: 1000 * 60 * 30` / 30 mins, `gcTime: 1000 * 60 * 60`, graceful offline / rate-limit fallback without UI layout shift).
  - Provide test query client wrapper in Storybook decorators and Vitest test setups to prevent outbound network calls.
- **Dedicated StarButton Component**:
  - Implement standalone component `web/src/components/StarButton/StarButton.tsx` with unit tests, Storybook stories, and SCSS partial.
  - Structure: Star icon + live star count badge (with fallback/skeleton state).
  - Used in `Header.tsx` (desktop navigation & mobile drawer) and easily embeddable elsewhere.
  - Directs users to `https://github.com/GehDoc/svg-to-video` with tooltip ("Star svg-to-video on GitHub ↗") and external link indicator.

### 3. "Sponsor me on GitHub" Renaming & Community Support Section

- **Renaming**: Update all header buttons, mobile drawer links, tooltips, and SEO support buttons from "Sponsor on GitHub" to "Sponsor me on GitHub" across `Header.tsx`, `HeaderMenu.tsx`, `Header.test.tsx`, and `SeoContent.tsx`.
- **Dedicated Star & Support Section in SeoContent**:
  - Expand/unify the existing `#sponsor` section into `#support` ("Support SVG to Video & Star on GitHub").
  - Preserve an anchor alias (`id="sponsor"`) to ensure backward compatibility for existing external links.
  - Present side-by-side or stacked community cards:
    - **Star on GitHub Card**: Prompt users to star and bookmark the repository, displaying live stars.
    - **Sponsor Card**: Sponsoring prompt renamed to "Sponsor me on GitHub ↗".

### 4. Design Tokens & Dual-Theme Storybook Script

- **Zero Hardcoded Colors**: All colors for star buttons, rating badges, elevation shadows, or hover states must be centralized in `web/src/index.scss` using CSS variables (`--star-color`, `--star-bg`, etc.) with light & dark theme definitions.
- **Dual-Theme Storybook Runner**: Add `test:storybook:all` script to `web/package.json` (`vitest run -c vitest.storybook.ts && STORYBOOK_THEME=dark vitest run -c vitest.storybook.ts`) and root `package.json`.

---

## ✅ Task List

- [x] **Phase 1: Semantic Heading Hierarchy & Ordered Lists**
  - [x] Promote top-level section headings to `<h2>` in `SeoContent.tsx`
  - [x] Promote sub-section headings to `<h3>` in `SeoContent.tsx`
  - [x] Promote FAQ questions to `<h4>` in `SeoContent.tsx`
  - [x] Convert "How to Convert" steps to `<ol>` / `<li>` in `SeoContent.tsx`
  - [x] Update unit tests in `SeoContent.test.tsx` for new heading levels
  - [x] Review and commit Phase 1
- [x] **Phase 2: Dedicated StarButton Component & GitHub Repo Stars Integration**
  - [x] Install `@tanstack/react-query` in `web` workspace and configure `Providers.tsx`
  - [x] Implement `useGitHubRepoStars` hook with cached query (`staleTime: 30m`) and offline/rate-limit fallback
  - [x] Create dedicated `StarButton` component (with `.scss`, `.test.tsx`, and `.stories.tsx`)
  - [x] Integrate `StarButton` into `Header.tsx` (desktop & mobile drawer)
  - [x] Add mock QueryClient wrapper in Vitest setup and Storybook preview
  - [x] Review and commit Phase 2
- [x] **Phase 3: "Sponsor me on GitHub" Renaming & Community Support Section**
  - [x] Rename "Sponsor on GitHub" to "Sponsor me on GitHub" across Header, mobile drawer, tooltips, and SeoContent
  - [x] Update `#sponsor` in `SeoContent.tsx` to `#support` with a dedicated "Star on GitHub" rating card alongside Sponsor (with backward-compatible `#sponsor` anchor alias)
  - [x] Add unit & Storybook tests for Star button and Support section
  - [x] Review and commit Phase 3
- [x] **Phase 4: Design Tokens & Dual-Theme Storybook Script**
  - [x] Add star rating tokens (`--star-color`, `--star-bg`, etc.) to `web/src/index.scss` (light & dark)
  - [x] Add `"test:storybook:all"` to `web/package.json` and root `package.json`
  - [x] Run dual-theme Axe contrast validation to ensure 0 violations
  - [x] Review and commit Phase 4
- [x] **Phase 5: Documentation, Security & Pre-Flight Audits (`🟡 To be reviewed`)**
  - [x] Update README.md and documentation for `#support` section anchor
  - [x] Audit docs/SECURITY.md (API query sanitization, external link `rel="noopener noreferrer"`)
  - [x] Audit docs/ANALYTICS.md (telemetry for star button clicks)
  - [x] Update package.json and SEO metadata if needed
  - [x] Run full test suites (`check:fast`, `test:unit`, `test:visual`, `test:storybook:all`)
  - [x] Update PR description and mark spec as `🟡 To be reviewed`
- [x] **Phase 6: Post-Review Defect Resolutions**
  - [x] Remove StarButton from mobile navigation drawer in `Header.tsx` & `Header.scss` (retaining it in desktop header actions and support card)
  - [x] Update `Header.test.tsx` assertions for single header StarButton instance
  - [x] Add `overscroll-behavior: contain` to `.config-content` in `ConfigPanel.scss` to prevent scroll chaining
  - [x] Remove artificial fixed layout CSS injection from `demo.spec.ts` to restore zero-gap alignment between `.site-header` and `.hero-strip`
  - [x] Set `smoothScroll: false` on Driver.js and scope spotlight scrolling strictly to internal `.config-content` container
  - [x] Verify demo video generation (`npm run test:demo -w web`) and validate frame boundaries

---

## 🧪 Verification Plan

- [x] Automated Tests:
  - `npm run check:fast`
  - `npm run test:unit`
  - `npm run test:visual -w web`
  - `npm run test:storybook:all` (verifies Axe compliance in both light and dark modes)
  - `npm run test:demo -w web` (generates demo video without gap or page scrolling)
- [x] Manual & Browser Inspection:
  - Verify heading tree structure in DevTools accessibility tree (`h1` -> `h2` -> `h3` -> `h4`)
  - Verify "Sponsor me on GitHub" text and tooltips
  - Verify GitHub Star button renders live count or fallback gracefully without layout shift
  - Verify dark mode contrast of star rating button and support cards
  - Verify demo video shows seamless header-hero contact and locked outer viewport

---

## 📝 Change Log

- 2026-11-26: Phase 6 added to address review defects (mobile drawer button cleanup, scroll containment, and demo video alignment).
- 2026-11-26: Initial spec created from partitioned scope of `semantic-web-layout-and-heading-hierarchy.md`.
