# Spec: Add Metadata Support for aPNG and GIF

**Status**: 🟠 Pending

## 🎯 Objective

Extend the current animated image encoders (`upng-js` and `gifenc`) to support embedding standard metadata (Title and Comment/Description).

## 🛠 Technical Strategy

- **aPNG (`upng-js`)**:
  - PNG files use `tEXt`, `zTXt`, or `iTXt` chunks for metadata.
  - I will investigate manually injecting `tEXt` chunks (Key: `Title` and `Description`) into the `ArrayBuffer` returned by `UPNG.encode`.
  - The chunk format is: `[4-byte length][4-byte type "tEXt"][keyword][null separator][text][4-byte CRC]`.
- **GIF (`gifenc`)**:
  - GIF supports a "Comment Extension" block (Label `0xFE`).
  - `gifenc` returns a `Uint8Array`. I will manually splice the comment block before the GIF trailer byte (`0x3B`).
  - The format is: `[0x21 (Extension Introducer)][0xFE (Comment Label)][sub-blocks of text][0x00 (Block Terminator)]`.

## ✅ Task List

- [ ] **Core Logic**
  - [ ] Implement PNG chunk injection in `ApngEncoder.ts`.
  - [ ] Implement GIF Comment Extension in `GifEncoder.ts`.
- [ ] **UI Integration**
  - [ ] Enable `#meta-title` and `#meta-comment` in `ConfigPanel.tsx` for these formats.
- [ ] **Verification**
  - [ ] Update `metadata-integrity.spec.ts` to include these formats in the "Supported" suite.
  - [ ] Add unit tests for the metadata injection logic in `ApngEncoder.test.ts` and `GifEncoder.test.ts`.

## 🧪 Verification Plan

- [ ] Automated Test: `npm run test:web -- tests/metadata-integrity.spec.ts`
- [ ] Automated Test: `npm run test:unit` for encoders.

## 📝 Change Log

- 2026-06-11: Initial spec created and technical strategy refined.
