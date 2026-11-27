# Spec: MCP Quality Schema Alignment and HuggingFace Demo Integration

**GitHub Issue**: N/A
**Status**: 🟡 To be reviewed

## 🎯 Objective

Clarify and enrich MCP tool schema contracts for video quality parameters (`bitrate`, `crf`, `quality`) with JSON Schema constraints (`minimum`, `maximum`) and explicit fallback documentation, while updating and adding automated test suites to the Hugging Face Spaces client (`svg-to-video-mcp`) so dynamic form translation, schema parsing, and execution payloads operate reliably.

## 🛠 Technical Strategy

### 1. `svg-to-video` (Core Engine & MCP Server)

- **JSON Schema Enhancements (`src/mcp.ts`)**:
  - Add explicit bounds to `render_svg_to_video` parameter schema:
    - `crf`: `{ type: 'number', minimum: 0, maximum: 63, description: '...' }`
    - `quality`: `{ type: 'number', minimum: 1, maximum: 100, description: '...' }`
  - Enhance parameter descriptions to document omission defaults:
    - `bitrate`: clarify that omitting this parameter delegates to CRF or format default rate control.
    - `crf`: clarify that omitting this parameter defaults to 20 for MP4/MKV (when bitrate is not set) or VP9 encoder default for WebM.
    - `quality`: clarify that omitting this parameter defaults to full 256-color palette (GIF) and default compression (aPNG).
- **Test Suite (`tests/mcp.spec.ts`)**:
  - Assert that `crf` exposes `minimum: 0` and `maximum: 63` in `listTools()`.
  - Assert that `quality` exposes `minimum: 1` and `maximum: 100` in `listTools()`.
- **Documentation**:
  - Audit and synchronize `docs/MCP.md` with updated parameter descriptions and schema metadata.

### 2. `svg-to-video-mcp` (Hugging Face Spaces Client)

- **Schema Extraction Fix (`app.py`)**:
  - Update `fetch_mcp_tools_schema()` to resolve `input_schema` (standard snake_case attribute on Pydantic `Tool` model in Python `mcp` SDK >= 1.0 / 2.x) with fallback to `inputSchema`, converting models via `model_dump()` if applicable.
- **Environment & Chromium Portability (`app.py`)**:
  - Conditionally set `PUPPETEER_EXECUTABLE_PATH = "/usr/bin/chromium"` only when `/usr/bin/chromium` exists, enabling local and CI test execution while preserving Hugging Face container compatibility.
- **Dynamic Form & Bounds Handling (`ui_builder.py`)**:
  - In `render_dynamic_form`, forward `minimum` and `maximum` from `prop_schema` to `gr.Number` (with fallback to 0..63 for `crf` and 1..100 for `quality` for backward compatibility with older server packages).
  - Add placeholder hints for optional text and numeric fields to clarify format defaults when left blank.
- **Automated Test Suite (`tests/`)**:
  - Add `pytest` test suite:
    - Test schema extraction and defaults dictionary construction.
    - Test `render_dynamic_form` component generation across types (dropdown, checkbox, number with min/max, textbox).
    - Test `on_submit` filtering logic: ensures optional fields left blank (`None` or `""`) are omitted from the generated execution payload, while explicit values are preserved.

## ✅ Task List

- [x] **Phase 1: Hugging Face MCP Client Fixes & Testing (`svg-to-video-mcp`)**
  - [x] Fix Pydantic model `input_schema` extraction in `app.py`.
  - [x] Guard `PUPPETEER_EXECUTABLE_PATH` in `app.py` for cross-environment portability.
  - [x] Update `ui_builder.py` with `minimum`/`maximum` constraints and optional placeholders.
  - [x] Create automated test suite (`tests/test_ui_builder.py`, `tests/test_schema.py`) and run with `pytest`.
  - [x] Run linter/formatting (`ruff`) in `svg-to-video-mcp`.
  - [x] Commit changes to `svg-to-video-mcp` on `main`.
- [x] **Phase 2: Core MCP Server Schema Enrichment (`svg-to-video`)**
  - [x] Add `minimum` and `maximum` properties to `crf` and `quality` in `src/mcp.ts`.
  - [x] Refine descriptions for `bitrate`, `crf`, and `quality` in `src/mcp.ts`.
  - [x] Update tests in `tests/mcp.spec.ts` asserting schema bounds.
  - [x] Run verification tests (`npm run test:mcp`, `npm run check:fast`, `npm run test:unit`).
  - [x] Update `docs/MCP.md`.
- [x] **Documentation, Security & Pre-Flight Audits**
  - [x] Audit `docs/SECURITY.md`.
  - [x] Audit `README.md` and `docs/MCP.md`.
  - [x] Run full test suites (`npm run check:fast`, `npm test`).
  - [x] Mark spec status as `🟡 To be reviewed`.

## 🧪 Verification Plan

- [x] Automated Tests in `svg-to-video-mcp`: `pytest` (4 passed, ruff & pyright clean).
- [x] Automated Tests in `svg-to-video`: `npm run test:mcp` (11 passed).
- [x] Full regression check: `npm run check:fast` and `npm run test:unit` (208 passed).

## 📝 Change Log

- 2026-11-27: Initial spec created for aligning MCP quality schemas and repairing Hugging Face Space client integration.
