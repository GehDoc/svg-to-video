### Title

feat(web): Add target dimension preview and capture method tooltips to ConfigPanel

### Description

#### Problem Statement

In the Web Studio, users currently select resolution presets (`Original Size`, `720p (Fit)`, `1080p (Fit)`) without seeing the exact target dimensions in pixels before starting the render. Additionally, users selecting between "Optimal" and "High Fidelity" capture methods lack inline context on how these methods differ (e.g. real-time canvas capture vs. frame-by-frame DOM animation scrubbing).

#### Proposed Solution

1. **Target Dimension Preview**: Display calculated resolution dimensions (e.g. `1280x720` or `1920x1080`) directly in or next to the resolution selector in `web/src/components/ConfigPanel.tsx`.
2. **Capture Method Tooltips/Help Text**: Add informative helper text or a tooltip for the "Capture Method" select control explaining:
   - **Optimal (Fast)**: Captures canvas stream in real-time. Best for simple CSS animations or fast exports.
   - **High Fidelity (Slow)**: Scrubs Web Animations API frame-by-frame for exact time accuracy. Best for complex CSS keyframes and sub-frame synchronization.

#### Technical Scope

- `web/src/components/ConfigPanel.tsx`
- `web/src/components/ConfigPanel.scss`
- Corresponding Storybook stories and unit tests in `web/src/components/ConfigPanel.test.tsx`.

#### Acceptance Criteria

- [ ] Selecting resolution presets displays the computed width and height (e.g., `1920 x 1080 px`).
- [ ] A helper hint or tooltip is displayed for the Capture Method dropdown describing "Optimal" vs "High Fidelity".
- [ ] Existing ConfigPanel tests pass and new unit tests verify dimension hint rendering.
