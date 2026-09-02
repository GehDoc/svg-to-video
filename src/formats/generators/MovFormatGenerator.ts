import path from 'path';
import { CLIFormatGenerator, CLIFormatOptions } from '../types.js';
import { mergeMetadataComments } from '../../../shared/metadata.js';

export class MovFormatGenerator implements CLIFormatGenerator {
  readonly id = 'mov';
  readonly extensions = ['.mov'];
  readonly supportsAlpha = true;

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

    if (transparent) {
      args.push('-c:v', 'png', '-pix_fmt', 'rgba');
    } else {
      args.push(
        '-c:v',
        'libx264',
        '-crf',
        '20',
        '-preset',
        'slow',
        '-pix_fmt',
        'yuv420p'
      );
    }

    const outputFullPath = path.join(outDir, outputFileName);
    args.push(outputFullPath);

    return args;
  }
}
