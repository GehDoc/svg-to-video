# Spec: Correct Web Studio & Storybook SEO Indexing Directives, Stable FFmpeg CI Setup, and SMIL Animation Promotion

**GitHub Issue**: N/A
**Status**: 🟠 Pending

## 🎯 Objective

Accurately configure search engine indexing directives across the Web Studio (keep homepage indexable without declaring a canonical URL) and Storybook (exclude Storybook tree via robots.txt and Storybook manager home via noindex meta tag), replace unreliable third-party FFmpeg action with standard Ubuntu apt-get installation in CI, and actively document and showcase full native SMIL animation support across docs, samples, and agent metadata.

## 🛠 Technical Strategy

- **SEO & Search Indexing**:
  - `web/src/app/layout.tsx`: Remove `alternates.canonical` so the homepage does not declare a canonical URL, while keeping standard indexing enabled (do NOT add `robots: { index: false, follow: false }`).
  - `web/public/robots.txt`: Ensure `/storybook/` and `/storybook` are disallowed for all user agents.
  - `web/.storybook/manager-head.html`: Add `<meta name="robots" content="noindex, nofollow" />` to ensure Storybook manager frame (`index.html`) is non-indexable, matching `preview-head.html`.
  - Update `web/tests/smoke.spec.ts` to verify the homepage has no canonical link and is indexable, and that Storybook head files have the noindex tag.
- **CI / FFmpeg Installation**:
  - Update `.github/actions/setup/action.yml` to replace `FedericoCarboni/setup-ffmpeg@v3` with standard `sudo apt-get update && sudo apt-get install -y ffmpeg` to provide full codec support across standard Ubuntu packages without third-party download failures.
- **SMIL Animation Promotion & Samples**:
  - Add a dedicated SMIL animation sample SVG file in `web/src/assets/samples/` (e.g. `morph-pulse.svg` or `radar.svg` leveraging `<animate>`, `<animateTransform>`).
  - Register the new sample in `web/src/utils/samples.ts`.
  - Update public documentation, agent metadata, and SEO copy (`README.md`, `skills/svg-to-video/SKILL.md`, `web/public/llms.txt`, `src/index.ts`, `docs/ARCHITECTURE.md`, `docs/FAQ.md`, `web/src/components/SeoContent.tsx`, `web/src/data/seoDocumentation.json`) from "CSS-animated SVGs" to "CSS- and SMIL-animated SVGs" (or "animated SVGs (CSS & SMIL)").

## ✅ Task List

- [ ] **Infrastructure & CI**
  - [ ] Update `.github/actions/setup/action.yml` to install FFmpeg via `sudo apt-get update && sudo apt-get install -y ffmpeg`
- [ ] **SEO & Indexing Directives**
  - [ ] Remove `alternates.canonical` from `web/src/app/layout.tsx` (preserving default indexing)
  - [ ] Verify `web/public/robots.txt` disallows `/storybook/` and `/storybook`
  - [ ] Create `web/.storybook/manager-head.html` with `<meta name="robots" content="noindex, nofollow" />`
  - [ ] Update smoke tests in `web/tests/smoke.spec.ts` for canonical link removal and Storybook head tags
- [ ] **SMIL Sample & Engine Showcase**
  - [ ] Create SMIL sample SVG in `web/src/assets/samples/`
  - [ ] Register SMIL sample in `web/src/utils/samples.ts`
  - [ ] Verify sample rendering and seeking in Web Studio tests
- [ ] **Documentation, Agent Skills & SEO Pre-Flight**
  - [ ] Update `README.md` to highlight SMIL and CSS animation capabilities
  - [ ] Update `skills/svg-to-video/SKILL.md` to clarify SMIL support for AI agents
  - [ ] Update `web/public/llms.txt`
  - [ ] Update CLI description in `src/index.ts`
  - [ ] Update `web/src/components/SeoContent.tsx` & `web/scripts/generate-seo-data.ts`
  - [ ] Run `npm run docs:generate-seo` to synchronize SEO JSON data
  - [ ] Audit `AGENTS.md` and `CONTRIBUTING.md` guidelines

## 🧪 Verification Plan

- [ ] Run `npm run test:fast` / `npm run check:fast` to verify types, formatting, and linting
- [ ] Run `npm run test:web -w web` to verify smoke and unit tests
- [ ] Inspect generated HTML of Web Studio homepage to confirm no canonical tag and presence of indexability
- [ ] Inspect generated Storybook manager HTML to confirm `noindex, nofollow` meta tag
- [ ] Verify CI builds with FFmpeg installation via apt-get

## 📝 Change Log

- 2026-10-19: Initial spec created by Antigravity assistant.
