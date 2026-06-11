# Spec: Add Metadata Support for aPNG and GIF

**Status**: 🟠 Pending

## 🎯 Objective

Extend the current animated image encoders (`upng-js` and `gifenc`) to support embedding standard metadata (Title and Comment/Description).

## 🛠 Technical Strategy

- **aPNG**: Investigate manual injection of `tEXt` or `zTXt` chunks into the raw PNG stream produced by `UPNG.js`.
- **GIF**: Implement GIF "Comment Extension" block insertion. Since `gifenc` returns a `Uint8Array`, we might need to manually splice the comment block before the GIF trailer (`0x3B`).

## ✅ Task List

- [ ] **Core Logic**
  - [ ] Implement PNG chunk injection in `ApngEncoder.ts`.
  - [ ] Implement GIF Comment Extension in `GifEncoder.ts`.
- [ ] **UI Integration**
  - [ ] Enable `#meta-title` and `#meta-comment` in `ConfigPanel.tsx` for these formats.
- [ ] **Verification**
  - [ ] Update `metadata-integrity.spec.ts` to include these formats in the "Supported" suite.

## 🧪 Verification Plan

- [ ] Automated Test: `npm run test:web -- tests/metadata-integrity.spec.ts` (moving formats to supported list).
