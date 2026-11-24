# Spec: Semantic Web Layout & Heading Hierarchy Refactoring

**GitHub Issue**: None
**Pull Request**: Pending
**Status**: 🟠 Pending

## 🎯 Objective

Refactor the Web Studio HTML landmark structure, heading levels, and list semantics to achieve 100% compliance with W3C semantic web standards and WCAG 2.1 accessibility criteria (SC 1.3.1 Info and Relationships).

## 🛠 Technical Strategy

- **Phase 1: Semantic Application Layout**:
  - **Landmark Scope**: Encompass both the studio workspace (`#studio`) and editorial documentation sections (`SeoContent`) inside the `<main>` landmark, ensuring screen readers and crawlers parse the full primary content.
  - **Single `<h1>` Document Standard**: Convert the application logo title in `Header.tsx` from `<h1>` to a semantic branding container (`<div className="header-title">` or `<strong>`), leaving the Hero headline as the single document `<h1>`.
  - **Skip Link**: Add an accessible, visually hidden skip-link (`<a href="#studio" className="skip-link">Skip to studio content</a>`) for keyboard navigation.

- **Phase 2: Semantic SEO Content Enhancements**:
  - **Heading Level Hierarchy**: Resolve heading level skipping by promoting top-level documentation sections (`#why-svg-to-video`, `#how-to-convert`, `#formats`, `#automation`, `#faq`, `#sponsor`) from `<h3>` to `<h2>`.
  - **Sub-section Hierarchy**: Promote nested sub-headings from `<h4>` to `<h3>` (feature titles, CLI & Docker Automation, AI Agent & MCP Integration, FAQ category titles).
  - **FAQ Item Hierarchy**: Promote FAQ questions from `<h5>` to `<h4>`.
  - **Ordered List Semantics**: Convert the 5-step conversion sequence in "How to Convert" from generic `<div>`s to semantic `<ol className="steps-container">` and `<li className="step-card">`.

## ✅ Task List

- [ ] **Phase 1: Semantic Application Layout**
  - [ ] Encompass studio workspace and SeoContent inside `<main>`
  - [ ] Convert header logo link to semantic `<span>` / `<strong>` (preserving Hero as single `<h1>`)
  - [ ] Add accessible skip-to-content link
  - [ ] Verify layout, responsive fold, and visual regressions
  - [ ] Review and commit Phase 1
- [ ] **Phase 2: Semantic SEO Content Enhancements**
  - [ ] Promote top-level section headings to `<h2>`
  - [ ] Promote sub-section headings to `<h3>`
  - [ ] Promote FAQ questions to `<h4>`
  - [ ] Convert "How to Convert" steps to `<ol>` / `<li>`
  - [ ] Update unit tests in `SeoContent.test.tsx` for new heading levels
  - [ ] Review and commit Phase 2

## 🧪 Verification Plan

- [ ] Automated Tests:
  - `npm run test:unit`
  - `npm run test:visual -w web`
  - `npm run test:storybook -w web`
  - `npm run check:fast`
- [ ] Manual Accessibility Audit:
  - Verify heading tree with browser accessibility tree / dev tools
  - Verify `<main>` landmark boundaries
