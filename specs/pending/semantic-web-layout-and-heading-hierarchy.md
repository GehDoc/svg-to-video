# Spec: Semantic Web Layout, Heading Hierarchy & GitHub Star Rating Integration

**GitHub Issue**: None
**Pull Request**: https://github.com/GehDoc/svg-to-video/pull/276
**Status**: 🟠 Pending

## 🎯 Objective

1. Refactor the Web Studio HTML landmark structure, heading levels, and list semantics to achieve 100% compliance with W3C semantic web standards and WCAG 2.1 accessibility criteria (SC 1.3.1 Info and Relationships) across both SSR and client hydration.
2. Integrate a GitHub repository rating & star button ("star icon + number of stars" cached via TanStack React Query) into the top navigation bar, accompanied by a dedicated community support & star section inside `SeoContent` alongside the Sponsor card.
3. Add sticky header behaviors with subtle bottom shadow (matching SVG sample card selector aesthetic) for the web studio form sections, SEO content block headers, and desktop Hero strip (disabled on mobile).
4. Rename "Sponsor on GitHub" button text, tooltips, and labels to "Sponsor me on GitHub".
5. Enforce strict design token standards (zero hardcoded colors in component SCSS) and introduce a unified dual-theme Storybook accessibility test script (`test:storybook:all`).

## 🛠 Technical Strategy

### 1. Semantic Application Layout, Landmarks & Sticky Headers

- **Landmark Scope (SSR & Hydrated Client)**:
  - Wrap both the bounded studio workspace (`#studio`) and editorial documentation sections (`SeoContent`) inside the primary `<main id="main-content">` landmark.
  - In `Studio.tsx`: promote `<main className="studio-main">` to encapsulate `HeroStrip`, `<section id="studio">`, and `SeoContent`.
  - In `page.tsx` (`!mounted` fallback): wrap `HeroStrip` and `SeoContent` inside `<main id="main-content">` so search crawlers and screen readers receive semantic landmarks in both SSR and hydrated states.
- **Single `<h1>` Document Standard**:
  - Convert the application logo title in `Header.tsx` from `<h1>` to a semantic branding container (`<div className="header-title">`), leaving the Hero headline as the sole document `<h1>`.
- **Accessible Skip Link**:
  - Add an accessible, keyboard-focusable skip-link (`<a href="#main-content" className="skip-link">Skip to main content</a>`) with high-contrast focus styling.
- **Sticky Headers with Elevation Shadow**:
  - **Hero Strip (`HeroStrip`)**: Make sticky on desktop/tablet with `position: sticky; top: var(--header-height, 53px); z-index: 90;` and a subtle bottom elevation shadow (`box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04)`). Keep `position: static` on mobile (`max-width: $header-mobile-breakpoint`).
  - **Web Studio Form (`ConfigPanel`)**: Sticky section headers (`h2`) or form navigation inside the scrollable configuration column with subtle elevation when scrolled.
  - **SEO Content (`SeoContent`)**: Make section block headers (`.block-header`) sticky with appropriate background (`var(--bg)`) and bottom elevation shadow.

### 2. Semantic Heading Hierarchy & Ordered Lists

- **Heading Level Hierarchy**: Resolve heading level skips by promoting top-level documentation sections (`#why-svg-to-video`, `#how-to-convert`, `#formats`, `#automation`, `#faq`, `#support`) from `<h3>` to `<h2>`.
- **Sub-section Hierarchy**: Promote nested sub-headings from `<h4>` to `<h3>` (feature titles, CLI & Docker Automation, AI Agent & MCP Integration, FAQ category titles).
- **FAQ Item Hierarchy**: Promote individual FAQ questions from `<h5>` to `<h4>`.
- **Ordered List Semantics**: Convert the 5-step conversion sequence in "How to Convert" from generic `<div>` wrappers to semantic `<ol className="steps-container">` and `<li className="step-card">`.

### 3. GitHub Star Rating & Community Support Section

- **TanStack React Query Integration**:
  - Install `@tanstack/react-query` in `web/package.json`.
  - Add a lightweight client provider (`web/src/components/Providers.tsx`) in Next.js App Router.
  - Implement custom hook `useGitHubRepoStars()` querying `https://api.github.com/repos/GehDoc/svg-to-video`.
  - Configure resilient cache policy (`staleTime: 1000 * 60 * 30` / 30 mins, `gcTime: 1000 * 60 * 60`, graceful offline / rate-limit fallback without UI layout shift).
  - Provide test query client wrapper in Storybook decorators and Vitest test setups to prevent outbound network calls.
- **Top Bar Star Button**:
  - Add a dedicated GitHub Star button in `Header.tsx` (next to GitHub and Sponsor buttons).
  - Structure: Star icon + live star count badge (with fallback/skeleton state).
  - Directs users to `https://github.com/GehDoc/svg-to-video` with tooltip ("Star svg-to-video on GitHub ↗") and external link indicator.
- **"Sponsor me on GitHub" Renaming**:
  - Update all header buttons, mobile drawer links, tooltips, and SEO support buttons from "Sponsor on GitHub" to "Sponsor me on GitHub".
- **Dedicated Star & Support Section in SeoContent**:
  - Expand/unify the existing `#sponsor` section into `#support` ("Support the Project & Star on GitHub").
  - Preserve an anchor alias (`id="sponsor"`) to ensure backward compatibility for existing external links.
  - Present side-by-side or stacked community cards:
    - **Star on GitHub Card**: Prompt users to star and bookmark the repository, displaying live stars.
    - **Sponsor Card**: Sponsoring prompt renamed to "Sponsor me on GitHub ↗".

### 4. Design Token & Theming Standardization

- **Zero Hardcoded Colors**: Strictly forbid raw hex or rgba values in component `.scss` files. Any colors for star buttons, rating badges, sticky elevation shadows, or hover states must be centralized in `web/src/index.scss` using CSS variables (`--star-color`, `--star-bg`, `--shadow-sm`, etc.) with light & dark theme definitions.
- **Third-Party Theme Isolation**: Maintain all external library styles in dedicated SCSS partials (like `web/src/styles/_syntax.scss`).

### 5. Unified Dual-Theme Accessibility Verification

- Add `test:storybook:all` script to `web/package.json`:
  ```json
  "test:storybook:all": "vitest run -c vitest.storybook.ts && STORYBOOK_THEME=dark vitest run -c vitest.storybook.ts"
  ```
- Expose `npm run test:storybook:all` from the root workspace.

---

## ✅ Task List

- [ ] **Phase 1: Semantic Application Layout, Landmarks & Sticky Headers**
  - [ ] Encompass studio workspace and SeoContent inside `<main id="main-content">` in `Studio.tsx` and `page.tsx`
  - [ ] Convert header logo link to semantic `<div>` (preserving Hero as single document `<h1>`)
  - [ ] Add accessible skip-to-content link with focus styles
  - [ ] Implement sticky header behavior and bottom elevation shadow on `HeroStrip` (desktop only)
  - [ ] Implement sticky headers and subtle shadow in `ConfigPanel` and `SeoContent`
  - [ ] Verify layout, responsive fold, and visual regressions
  - [ ] Review and commit Phase 1
- [ ] **Phase 2: Semantic Heading Hierarchy & List Semantics**
  - [ ] Promote top-level section headings to `<h2>`
  - [ ] Promote sub-section headings to `<h3>`
  - [ ] Promote FAQ questions to `<h4>`
  - [ ] Convert "How to Convert" steps to `<ol>` / `<li>`
  - [ ] Update unit tests in `SeoContent.test.tsx` for new heading levels
  - [ ] Review and commit Phase 2
- [ ] **Phase 3: GitHub Star Rating, Support Section & Sponsoring Renaming**
  - [ ] Install `@tanstack/react-query` in `web` workspace and configure `Providers.tsx`
  - [ ] Implement `useGitHubRepoStars` hook with cached query (`staleTime: 30m`) and offline/rate-limit fallback
  - [ ] Add star button with icon + star count in `Header.tsx` (desktop & mobile drawer)
  - [ ] Rename "Sponsor on GitHub" to "Sponsor me on GitHub" across Header, mobile drawer, tooltips, and SeoContent
  - [ ] Update `#sponsor` in `SeoContent.tsx` to `#support` with a dedicated "Star on GitHub" rating card alongside Sponsor (with backward-compatible `#sponsor` anchor alias)
  - [ ] Add unit & Storybook tests for Star button and Support section with mock QueryClient
  - [ ] Review and commit Phase 3
- [ ] **Phase 4: Design Tokens & Dual-Theme Storybook Script**
  - [ ] Add star rating and elevation tokens (`--star-color`, `--star-bg`, `--shadow-sm`, etc.) to `web/src/index.scss` (light & dark)
  - [ ] Add `"test:storybook:all"` to `web/package.json` and root `package.json`
  - [ ] Run dual-theme Axe contrast validation to ensure 0 violations
  - [ ] Review and commit Phase 4
- [ ] **Documentation, Security & Pre-Flight Audit**
  - [ ] Audit `README.md`, `docs/FAQ.md`, and metadata for new anchor IDs
  - [ ] Run full check (`check:fast`, `test:unit`, `test:visual`, `test:storybook:all`)

---

## 🧪 Verification Plan

- [ ] Automated Tests:
  - `npm run test:unit`
  - `npm run test:visual -w web`
  - `npm run test:storybook:all` (verifies Axe compliance in both light and dark modes)
  - `npm run check:fast`
- [ ] Manual & Browser Inspection:
  - Verify heading tree structure in DevTools accessibility tree
  - Verify `<main>` landmark contains entire primary page content in both SSR and hydrated state
  - Test keyboard skip link navigation
  - Verify sticky headers and subtle bottom shadow behavior (desktop Hero vs mobile static Hero)
  - Verify "Sponsor me on GitHub" text and tooltips
  - Verify GitHub Star button renders live count or fallback gracefully without layout shift
  - Verify dark mode contrast of star rating button and support cards
