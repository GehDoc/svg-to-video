export interface FormatCapability {
  readonly id: string;
  readonly label: string;
  readonly extension: string;
  readonly extensions: readonly string[];
  readonly mimeType: string;
  readonly supportsAlpha: boolean;
  readonly supportsMetadata: boolean;
  readonly needsColorKeying: boolean;
}

export const FORMAT_CAPABILITIES: Record<string, FormatCapability> = {
  mp4: {
    id: 'mp4',
    label: 'MP4',
    extension: '.mp4',
    extensions: ['.mp4'],
    mimeType: 'video/mp4',
    supportsAlpha: false,
    supportsMetadata: true,
    needsColorKeying: false,
  },
  webm: {
    id: 'webm',
    label: 'WebM',
    extension: '.webm',
    extensions: ['.webm'],
    mimeType: 'video/webm',
    supportsAlpha: true,
    supportsMetadata: true,
    needsColorKeying: false,
  },
  gif: {
    id: 'gif',
    label: 'GIF',
    extension: '.gif',
    extensions: ['.gif'],
    mimeType: 'image/gif',
    supportsAlpha: true,
    supportsMetadata: true,
    needsColorKeying: true,
  },
  apng: {
    id: 'apng',
    label: 'aPNG',
    extension: '.png',
    extensions: ['.apng', '.png'],
    mimeType: 'image/png',
    supportsAlpha: true,
    supportsMetadata: true,
    needsColorKeying: false,
  },
  mkv: {
    id: 'mkv',
    label: 'MKV',
    extension: '.mkv',
    extensions: ['.mkv'],
    mimeType: 'video/x-matroska',
    supportsAlpha: true,
    supportsMetadata: true,
    needsColorKeying: false,
  },
  mov: {
    id: 'mov',
    label: 'MOV',
    extension: '.mov',
    extensions: ['.mov'],
    mimeType: 'video/quicktime',
    supportsAlpha: true,
    supportsMetadata: true,
    needsColorKeying: false,
  },
};

export function getFormatCapability(
  formatOrExtension: string
): FormatCapability | undefined {
  if (!formatOrExtension) return undefined;
  const rawKey = formatOrExtension.toLowerCase().trim();
  if (FORMAT_CAPABILITIES[rawKey]) {
    return FORMAT_CAPABILITIES[rawKey];
  }

  const cleanKey = rawKey.startsWith('.') ? rawKey.slice(1) : rawKey;
  const extKey = rawKey.startsWith('.') ? rawKey : `.${rawKey}`;

  for (const cap of Object.values(FORMAT_CAPABILITIES)) {
    if (
      cap.id === cleanKey ||
      cap.extensions.includes(extKey) ||
      cap.extensions.includes(rawKey)
    ) {
      return cap;
    }
  }

  return undefined;
}

export function getAllFormatCapabilities(): FormatCapability[] {
  return Object.values(FORMAT_CAPABILITIES);
}
