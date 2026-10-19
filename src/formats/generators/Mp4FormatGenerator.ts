import path from 'path';
import { CLIFormatOptions } from '../types.js';
import { BaseCLIFormatGenerator } from '../BaseCLIFormatGenerator.js';
import { mergeMetadataComments } from '#shared/metadata.js';

export class Mp4FormatGenerator extends BaseCLIFormatGenerator {
  constructor() {
    super('mp4');
  }

  buildFfmpegArgs(options: CLIFormatOptions): string[] {
    const {
      fps,
      hold,
      outDir,
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

    args.push(
      '-metadata',
      `comment=${finalComment}`,
      '-c:v',
      'libx264',
      '-crf',
      '20',
      '-preset',
      'slow',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart'
    );

    const outputFullPath = path.join(outDir, outputFileName);
    args.push(outputFullPath);

    return args;
  }
}
