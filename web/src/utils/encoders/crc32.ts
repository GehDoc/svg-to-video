let crcTable: Uint32Array | null = null;

function makeCrcTable(): Uint32Array {
  const table = new Uint32Array(256);
  for (let entryIndex = 0; entryIndex < 256; entryIndex++) {
    let currentByte = entryIndex;
    for (let bitIndex = 0; bitIndex < 8; bitIndex++) {
      currentByte =
        currentByte & 1 ? 0xedb88320 ^ (currentByte >>> 1) : currentByte >>> 1;
    }
    table[entryIndex] = currentByte;
  }
  return table;
}

function getCrcTable(): Uint32Array {
  if (!crcTable) {
    crcTable = makeCrcTable();
  }
  return crcTable;
}

export const crc32 = (buffer: Uint8Array): number => {
  const table = getCrcTable();
  let crcChecksum = 0xffffffff;
  for (let byteIndex = 0; byteIndex < buffer.length; byteIndex++) {
    crcChecksum =
      (crcChecksum >>> 8) ^ table[(crcChecksum ^ buffer[byteIndex]) & 0xff];
  }
  return (crcChecksum ^ 0xffffffff) >>> 0;
};
