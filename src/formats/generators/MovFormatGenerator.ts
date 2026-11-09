import path from 'path';
import { CLIFormatOptions } from '../types.js';
import { BaseCLIFormatGenerator } from '../BaseCLIFormatGenerator.js';
import { mergeMetadataComments } from '#shared/metadata.js';

export class MovFormatGenerator extends BaseCLIFormatGenerator {
  constructor() {
    super('mov');
  }

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

    const args = ['-hide_banner', '-loglevel', 'warning', '-y'];

    if (inputPattern === 'pipe:0' || inputPattern.startsWith('pipe:')) {
      args.push('-f', 'image2pipe');
    }

    args.push('-framerate', String(fps), '-i', inputPattern);

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
