import path from 'path';
import { CLIFormatGenerator, CLIFormatOptions } from '../types.js';
import { mergeMetadataComments } from '#shared/metadata.js';
import { FORMAT_CAPABILITIES } from '#shared/formatCapabilities.js';

const cap = FORMAT_CAPABILITIES.webm;

export class WebmFormatGenerator implements CLIFormatGenerator {
  readonly id = cap.id;
  readonly extensions = cap.extensions as string[];
  readonly mimeType = cap.mimeType;
  readonly supportsAlpha = cap.supportsAlpha;
  readonly needsColorKeying = cap.needsColorKeying;

  buildFfmpegArgs(options: CLIFormatOptions): string[] {
    const {
      fps,
      hold,
      outDir,
      transparent,
      metadata,
      inputPattern,
      pkgVersion,
      outputFileName,
    } = options;

    const args = [
      '-hide_banner',
      '-loglevel',
      'warning',
      '-y',
      '-framerate',
      String(fps),
      '-i',
      inputPattern,
    ];

    let userComment: string | undefined;
    if (metadata) {
      metadata.forEach((m) => {
        if (m.startsWith('comment=')) {
          userComment = m.split('=')[1];
        } else {
          args.push('-metadata', m);
        }
      });
    }

    const finalComment = mergeMetadataComments(userComment, pkgVersion);

    const filters: string[] = [];
    if (hold && hold > 0) {
      filters.push(`tpad=stop_mode=clone:stop_duration=${hold}`);
    }
    if (filters.length) {
      args.push('-vf', filters.join(','));
    }

    args.push('-metadata', `comment=${finalComment}`);

    const pixFmt = transparent ? 'yuva420p' : 'yuv420p';
    args.push('-c:v', 'libvpx-vp9', '-pix_fmt', pixFmt, '-f', 'webm');

    const outputFullPath = path.join(outDir, outputFileName);
    args.push(outputFullPath);

    return args;
  }
}
