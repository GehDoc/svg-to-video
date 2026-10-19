# Spec: Align Rocket Sample Fuselage Gradient with Cylindrical Geometry

**Pull Request**: [#233](https://github.com/GehDoc/svg-to-video/pull/233)
**Status**: 🟢 Completed

## 🎯 Objective

Correct the linear gradient vector coordinates of the rocket fuselage in the built-in sample SVG (`web/src/assets/samples/rocket.svg`) to align with the rocket's cylindrical geometry across its width, eliminating optical lighting inversion during flight motion, and bump the patch version.

## 🛠 Technical Strategy

- **Gradient Geometry**: Update `<linearGradient id="rocketBody">` from diagonal bounding-box coordinates (`x1="0%" y1="0%" x2="100%" y2="100%"`) to horizontal/cross-section coordinates (`x1="0%" y1="0%" x2="100%" y2="0%"`). In the rocket's local coordinates (where the rocket points vertically along the Y axis), this produces consistent cylindrical lighting (light flank on left, shadow flank on right) that maintains coherent lighting orientation under `-45deg` group rotation.
- **Versioning**: Bump patch version in `package.json`, `web/package.json`, and synchronize dependent metadata per `CONTRIBUTING.md`.

## ✅ Task List

- [x] **Sample SVG Asset**
  - [x] Update `linearGradient id="rocketBody"` in `web/src/assets/samples/rocket.svg` to `x1="0%" y1="0%" x2="100%" y2="0%"`
- [x] **Testing & Verification**
  - [x] Verify test suite passes (`npm run test:unit`, `npm run type-check`, `npm run lint`)
  - [x] Verify visual tests or snapshots if affected
- [x] **Version Bump & Pre-Flight**
  - [x] Bump patch version in `package.json` and `web/package.json`
  - [x] Audit docs and manifests (`mcp.json`, etc.) if needed per `CONTRIBUTING.md`
- [x] **Clean Up & Spec Transition**
  - [x] Mark spec completed and move to `specs/completed/`

## 🧪 Verification Plan

- [x] Manual Test: Render `rocket.svg` at multiple timeframes (0s, 1s, 2.5s) to verify uniform cylindrical illumination without apparent gradient inversion.
- [x] Automated Test: Run `npm run check:fast` and relevant unit/web tests.

## 📝 Change Log

- 2026-10-19: Initial spec created for rocket sample gradient fix and patch release.
- 2026-10-19: Implemented cylindrical gradient fix in `rocket.svg`, verified visual rendering, bumped patch version to 0.32.1, and completed spec.
