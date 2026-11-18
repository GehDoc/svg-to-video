# Spec: Deliver Seamless Mechanical Gear GIF Export with Flicker-Free High-Fidelity Palette

**GitHub Issue**: None
**Follow-up Issue**: [#265](https://github.com/GehDoc/svg-to-video/issues/265)
**Status**: 🟡 To be reviewed

## 🎯 Objective

Fix the mechanical gear animation loop synchronization to eliminate rotational hiccup and optimize the GIF quantization and palette pipeline across Web Studio and CLI to eliminate flickering and achieve maximum color fidelity.

## 🛠 Technical Strategy

- **Core Technologies**: CSS SVG Animations, WebCodecs/Canvas, `gifenc` (PnnQuant, NeuQuant / PNN quantization), FFmpeg `palettegen` & `paletteuse`.
- **Architecture**: Web Studio client-side encoder (`web/src/utils/encoders/GifEncoder.ts`), CLI format generator (`src/formats/generators/GifFormatGenerator.ts`), shared animation analyzer (`shared/analyzeSvgAnimation.ts`).
- **Key Dependencies**: `gifenc`, `puppeteer`, `ffmpeg`.

### 1. Gear Animation & Loop Synchronization

- **Rotational Hiccup Cause**: In `gear.svg`, the large gear animation duration was 6s (1 revolution in 6s), while the small gear was 3.6s. In a 6-second capture loop, the small gear completed $6 / 3.6 = 1.666$ revolutions (stopping at $240^\circ$), resulting in a $120^\circ$ jump when looping back to $0^\circ$. Additionally, the small gear had asymmetric tooth geometry (4 teeth at $90^\circ$ intervals and 2 teeth arbitrarily rotated at $60^\circ$).
- **Mathematical Synchronization**:
  - Large gear ($N_1 = 8$ teeth): Period $T_1 = 2$s ($3$ full revolutions in $6$s).
  - Small gear ($N_2 = 6$ teeth): Period $T_2 = 1.5$s ($4$ full revolutions in $6$s).
  - Pitch meshing: $8 \times 3 = 24$ teeth mesh against $6 \times 4 = 24$ teeth in 6s. The speed ratio is $\omega_2 / \omega_1 = 4 / 3 = N_1 / N_2$, matching physical gear kinematics.
  - Symmetrical geometry: Correct the small gear's 6 teeth to use exact $60^\circ$ radial increments around its center `(265, 255)` with appropriate mesh phase alignment.
  - Duration auto-detection: `analyzeSvgAnimation` computes $\operatorname{LCM}(2000, 1500) = 6000$ ms ($6$ seconds), which automatically synchronizes with the sample's preset duration of $6$s.

### 2. Web Studio GIF Palette Optimization (`GifEncoder.ts`)

- **Flickering & Palette Degradation Cause**: When `isTransparent = true`, `GifEncoder` previously passed `format: 'rgba4444'` to `quantize(allPixels, 255)`. In `pnnquant2`, `rgba4444` quantizes alpha as a 4-bit channel, squandering over 70% of the 255 palette slots on intermediate translucent alpha values ($a = 1 \dots 254$). Since GIF89a only supports binary 1-bit transparency (a single transparent color index), all non-zero alpha palette entries are rendered completely opaque. Anti-aliased edge pixels randomly matched these intermediate palette entries, causing severe edge flickering and speckling between frames. Moreover, solid gradient colors were restricted to 4 bits per RGB channel, causing banding and color jumping.
- **Optimal Palette Pipeline**:
  - Separate transparent pixels ($\alpha < 128$) from opaque pixels ($\alpha \ge 128$) across frames.
  - Quantize opaque pixels using high-precision `rgb565` (16-bit color, 65,536 histogram bins) into up to 255 colors.
  - Prepend index 0 as transparent: `[0, 0, 0, 0]`.
  - Frame encoding: Map pixels with $\alpha < 128$ directly to index 0 (`transparentIndex`), and map pixels with $\alpha \ge 128$ to the 255-color `rgb565` palette (offset by +1).
  - For non-transparent GIFs: Quantize all 256 colors with `rgb565`.

### 3. CLI / MCP / Docker GIF Rendering Pipeline (`GifFormatGenerator.ts`)

- **CLI Quality Parity**:
  - In FFmpeg, default `paletteuse` uses `dither=sierra2_4a`. Error diffusion dithering shifts patterns across moving gradients on each frame, creating shimmering/flicker.
  - Update `paletteuse` in `GifFormatGenerator.ts` to use deterministic ordered dithering (`dither=bayer:bayer_scale=3` or `dither=bayer:bayer_scale=2`) or `diff_mode=rectangle`, ensuring stable frame-to-frame color rendering without temporal noise.

## ✅ Task List

- [x] **Infrastructure & Branching**
  - [x] Create feature branch `feat/improve-gear-sample-gif-export`
  - [x] Commit initial spec and open Draft Pull Request via `gh pr create`
- [x] **Gear Sample Animation Fix**
  - [x] Correct gear animation periods in `web/src/assets/samples/gear.svg` ($T_1 = 2$s for large gear, $T_2 = 1.5$s for small gear)
  - [x] Fix tooth placement and angular spacing for small gear (6 teeth evenly spaced at $60^\circ$ increments around center `(265, 255)`)
  - [x] Verify seamless meshing and check rotation continuity across loop boundary
  - [x] Verify `analyzeSvgAnimation` returns 6s for the updated `gear.svg`
- [x] **Web Studio GIF Encoder Enhancement**
  - [x] Refactor `web/src/utils/encoders/GifEncoder.ts` to separate opaque pixels and quantize using `rgb565` with dedicated transparent index 0
  - [x] Update frame index mapping in `GifEncoder.ts` to cleanly map transparent pixels ($\alpha < 128$) to index 0 and opaque pixels to `rgb565` palette
  - [x] Update unit tests in `web/src/utils/encoders/GifEncoder.test.ts`
- [x] **CLI GIF Generator Parity**
  - [x] Update FFmpeg `paletteuse` filter arguments in `src/formats/generators/GifFormatGenerator.ts` to use deterministic dithering (`dither=bayer:bayer_scale=3`)
  - [x] Update CLI format generator unit tests in `src/formats/registry.test.ts`
- [x] **Documentation, Security & SEO Pre-Flight**
  - [x] Audit `README.md` & `docs/ARCHITECTURE.md`
  - [x] Audit `docs/SECURITY.md`
  - [x] Check `docs/ANALYTICS.md`
  - [x] Check `web/src/app/layout.tsx` & `web/src/components/SeoFallback.tsx`
  - [x] Run full test suites (`npm test`, `npm run lint`)
- [x] **Review Handover**
  - [x] Mark spec as `🟡 To be reviewed`
  - [x] Push branch and update PR

## 🧪 Verification Plan

- [x] Automated Tests:
  - `npm test` (root test suite including CLI format generator)
  - `npm run test:unit -w web` (web studio unit tests including `GifEncoder.test.ts`)
  - `npm run lint` & `npm run type-check -w web`
- [x] Visual & Functional Verification:
  - Export `gear.svg` to GIF via CLI and verify zero edge flickering, clean transparency, and seamless loop.
  - Export `gear.svg` to GIF via Web Studio logic and verify pristine palette (255 colors in `rgb565`), no edge noise, and seamless loop.

## 📝 Change Log

- 2026-11-18: Initial spec created by Antigravity.
- 2026-11-18: Implemented gear rotation synchronization ($T_1 = 2$s, $T_2 = 1.5$s), optimized Web Studio `GifEncoder.ts` with opaque pixel separation and `rgb565` quantization, synchronized CLI FFmpeg `paletteuse` with deterministic `bayer` dithering, created follow-up issue #265, and verified all tests pass. Spec marked `🟡 To be reviewed`.
