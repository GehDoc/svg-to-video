### Title

feat(cli,mcp): Add custom width and height resolution parameter support

### Description

#### Problem Statement

Currently, the CLI and MCP server interfaces support fixed resolution presets (`original`, `720p`, `1080p`) and a scale factor (1-4x for `original`). Users cannot specify arbitrary target resolution dimensions (e.g., square video `1080x1080`, vertical video `1080x1920`, or custom banners `1200x630`) when rendering SVGs via terminal or LLM agent tools.

#### Proposed Solution

1. **CLI Support**: Add `--width <pixels>` and `--height <pixels>` options (or support formatted resolution strings like `--resolution 1080x1080` in addition to preset keywords) in `src/index.ts`.
2. **MCP Tool Schema**: Update `render_svg_to_video` in `src/mcp.ts` to accept optional `width` and `height` numerical properties or expanded `resolution` string format.
3. **Renderer Engine Integration**: Pipe explicit width and height dimensions to the Puppeteer viewport and canvas rendering pipeline in `src/index.ts`.

#### Technical Scope

- `src/index.ts` (CLI argument parsing and Puppeteer viewport calculation)
- `src/mcp.ts` (`render_svg_to_video` tool input schema and CLI invocation mapping)
- `src/utils/validateOptions.ts` (validation logic for custom dimensions)
- Unit tests in `src/utils/validateOptions.test.ts` and E2E CLI tests in `tests/cli.spec.ts`.

#### Acceptance Criteria

- [ ] Users can specify custom width and height (e.g., `npx @gehdoc/svg-to-video input.svg 60 ./out --width 1080 --height 1920`).
- [ ] MCP agents can invoke `render_svg_to_video` with custom `width` and `height` parameters.
- [ ] Option validation rejects invalid, zero, or negative dimensions.
- [ ] CLI help text and `docs/CLI.md` / `docs/MCP.md` are updated to reflect the new parameters.
