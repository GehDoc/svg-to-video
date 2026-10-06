**Status**: 🟢 Completed

## 🎯 Objective

Ensure all documentation consistently uses the binary-name npx invocation pattern (`npx -y -p @gehdoc/svg-to-video svg-to-video[-mcp]`), surface all HuggingFace Space pointers across every SEO/discoverability file, add a note about the backing Python HF repository, and add manual update reminders for external surfaces (HuggingFace Space README and Docker Hub overview) to the pre-flight checklist.

## 🛠 Technical Strategy

- **Scope**: Documentation-only — no functional code changes.
- **npx pattern**: `npx -y -p @gehdoc/svg-to-video svg-to-video` (CLI) and `npx -y -p @gehdoc/svg-to-video svg-to-video-mcp` (MCP). The `-p` flag explicitly names the package to install; the trailing argument is the binary exposed via `package.json` `bin`.
- **HuggingFace Space**: `https://huggingface.co/spaces/GehDoc/svg-to-video-mcp` — exposes the MCP server via a Python wrapper (npm, not Dockerfile) for cost reasons. The HF Space is backed by a dedicated **HuggingFace repository** (`GehDoc/svg-to-video-mcp`) that requires Python development for any changes to the hosting layer.
- **External surfaces**: HuggingFace Space README and Docker Hub overview cannot be auto-updated from this repository and must be checked manually at release time.
- **`mcp.json` unchanged**: The MCP registry schema only supports positional/named `runtimeArguments`; it has no binary-name field, so the existing entry remains correct for registry tooling.

## ✅ Task List

- [x] **npx Invocation Fixes** (CLI binary: `svg-to-video`, MCP binary: `svg-to-video-mcp`)
  - [x] `README.md` — fix 4 CLI invocations (lines 80, 83, 86, 132)
  - [x] `docs/CLI.md` — fix remote usage example
  - [x] `CONTRIBUTING.md` — fix remote/published CLI example
  - [x] `skills/svg-to-video/SKILL.md` — fix Option B CLI example
  - [x] `mcp.json` — no change needed (schema has no binary-name field; positional `"mcp"` arg is schema-correct)

- [x] **HuggingFace Space Pointers & Notes**
  - [x] `web/public/llms.txt` — add HF Space to Core Resources
  - [x] `docs/MCP.md` — expand HF section: add note about backing Python HF repo requiring Python development
  - [x] `web/src/app/layout.tsx` — add "HuggingFace hosted MCP server" to `featureList`
  - [x] `package.json` — add `huggingface` keyword

- [x] **Publication Pre-Flight Reminders**
  - [x] `AGENTS.md` — add HuggingFace Space README and Docker Hub overview to the Documentation & SEO Pre-Flight checklist (point 6)

## 🧪 Verification Plan

- [x] Manual: `grep -rn "npx @gehdoc\|npx -y @gehdoc" --include="*.md"` returns no results outside `specs/` ✅
- [x] Manual: Confirmed `llms.txt` contains HuggingFace link ✅
- [x] Manual: Confirmed `AGENTS.md` pre-flight mentions HF Space README and Docker Hub overview ✅
