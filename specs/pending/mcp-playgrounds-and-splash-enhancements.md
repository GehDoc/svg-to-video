# Spec: MCP Playgrounds Integration & Splash Screen Enhancements

**Pull Request**: [#282](https://github.com/GehDoc/svg-to-video/pull/282)
**Status**: 🟡 To be reviewed

## 🎯 Objective

Showcase interactive MCP playgrounds (HuggingFace Spaces & Glama.ai) across documentation and the Web Studio SEO automation section, provide a concise Glama.ai maintenance guide in `docs/MCP.md`, streamline the README header by removing the top banner and extraneous badge clutter, and modernize the Web Studio splash screen with accessible ecosystem SVG icon links and cleaner layout.

## 🛠 Technical Strategy

- **Core Technologies**: React, Next.js, SCSS, React Icons (`react-icons/fa`, `react-icons/si`), Node.js SEO generation script.
- **Architecture**:
  - **Documentation & README Rationalization**:
    - Remove `<img src="./docs/assets/social-preview.svg" ...>` from the top of `README.md` to keep the presentation clean and focused.
    - Remove the top HuggingFace badge from the top badge ribbon (avoid adding a top Glama badge) to keep top badges strictly focused on package status and CI.
    - Add Glama.ai MCP server listing (`https://glama.ai/mcp/servers/GehDoc/svg-to-video`) alongside HuggingFace in the "Official Package Distributions" list.
    - Add a new 3rd sub-chapter in `README.md` under the developer automation section: _Interactive MCP Playgrounds (HuggingFace & Glama.ai)_ explaining how developers can test and inspect the MCP API in the browser with zero local dependencies.
  - **Lightweight Glama.ai Maintenance Guide (`docs/MCP.md`)**:
    - Add a concise section covering container build steps, the `/opt/google/chrome` symlink trick for Chromium discovery, and the `mcp-proxy` execution argument (`["mcp-proxy", "--", "node", "dist/src/mcp.js", "--hosted"]`).
  - **SEO Pipeline & SPA Integration**:
    - Update `web/scripts/generate-seo-data.ts` to parse the new playgrounds sub-chapter.
    - Update `web/src/components/SeoContent.tsx` to render the 3rd sub-block in the _Developer CLI, Docker & Model Context Protocol (MCP)_ section.
    - Add `glama: 'https://glama.ai/mcp/servers/GehDoc/svg-to-video'` to `ECOSYSTEM_LINKS` in `web/src/utils/constants.ts` and `web/src/app/layout.tsx` (`sameAs`).
  - **Web Studio Splash Screen Modernization (`SeoFallback.tsx`)**:
    - Remove the `<p>Initializing Studio...</p>` text for improved SEO and minimal visual design.
    - Replace text links in the splash screen with accessible SVG icon links (GitHub, npm, Docker, MCP Registry, HuggingFace, Glama) with accessible `aria-label` / `title` attributes.
    - Keep only the "MIT License" as text link.
    - Adjust `web/src/components/SeoFallback.scss` for clean icon alignment and hover states.

## ✅ Task List

- [x] **Infrastructure & Branch Setup**
  - [x] Create feature branch `feat/mcp-playgrounds-and-splash-enhancements`
  - [x] Initialize spec `specs/pending/mcp-playgrounds-and-splash-enhancements.md`
- [x] **README.md Streamlining & MCP Playgrounds Section**
  - [x] Remove `social-preview.svg` header image
  - [x] Remove top HuggingFace badge from the header badge list
  - [x] Add Glama.ai listing to `Official Package Distributions`
  - [x] Add 3rd chapter for interactive playgrounds (HuggingFace & Glama.ai)
- [x] **Concise MCP Documentation (`docs/MCP.md`)**
  - [x] Add lightweight deployment and maintenance guide for Glama.ai
- [x] **Web Studio Constants & SEO Pipeline**
  - [x] Add `glama` to `ECOSYSTEM_LINKS` in `web/src/utils/constants.ts`
  - [x] Add `glama` to JSON-LD `sameAs` array in `web/src/app/layout.tsx`
  - [x] Update `web/scripts/generate-seo-data.ts` to parse the playgrounds section
  - [x] Update `web/src/components/SeoContent.tsx` to render the playgrounds sub-block
- [x] **Web Studio Splash Screen Modernization (`SeoFallback.tsx`)**
  - [x] Remove "Initializing Studio..." text
  - [x] Replace text links with accessible SVG icon links + text MIT License
  - [x] Update SCSS styles in `SeoFallback.scss`
- [x] **Documentation, Security & SEO Pre-Flight (`🟡 To be reviewed`)**
  - [x] Run `npm run prebuild` to verify SEO data extraction
  - [x] Run `npm run check:fast` (lint, prettier, type checks)
  - [x] Run test suite (`npm run test:unit`, `npm run test:mcp`, `npm run test:cli`)

## 🧪 Verification Plan

- [x] Automated Test: `npm run check:fast` (passed 100% with zero warnings/errors)
- [x] Automated Test: `npm run prebuild` && `npm run build -w web` (passed 100%, static export clean)
- [x] Automated Test: `npm run test:unit -w web` (28/28 test files, 115/115 passed)
- [x] Automated Test: `npm run test:mcp` (13/13 passed)
- [x] Automated Test: `npm run test:cli` (29/29 passed)
- [x] Visual Inspection: Web Studio splash screen icon links, hover states, loader bar, and playground sub-block rendered cleanly.

## 📝 Change Log

- _2026-11-28: Initial spec created for MCP playgrounds integration and splash screen enhancements._
- _2026-11-28: Implementation complete. Streamlined README.md, added lightweight Glama.ai documentation in docs/MCP.md, modernized splash screen with SVG icons, added interactive playgrounds to SEO pipeline and SPA, and verified all tests._
