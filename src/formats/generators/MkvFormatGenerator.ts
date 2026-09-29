import path from 'path';
import { CLIFormatGenerator, CLIFormatOptions } from '../types.js';
import { mergeMetadataComments } from '#shared/metadata.js';

export class MkvFormatGenerator implements CLIFormatGenerator {
  readonly id = 'mkv';
  readonly extensions = ['.mkv'];
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
      args.push('-c:v', 'libvpx-vp9');
      if (options.crf !== undefined) {
        args.push('-crf', String(options.crf));
        if (!options.bitrate) {
          args.push('-b:v', '0');
        }
      }
      if (options.bitrate) {
        args.push('-b:v', options.bitrate);
      }
      args.push('-pix_fmt', 'yuva420p');
    } else {
      const crfValue = options.crf !== undefined ? String(options.crf) : '20';
      args.push('-c:v', 'libx264', '-crf', crfValue);
      if (options.bitrate) {
        args.push('-b:v', options.bitrate);
      }
      args.push('-preset', 'slow', '-pix_fmt', 'yuv420p');
    }

    const outputFullPath = path.join(outDir, outputFileName);
    args.push(outputFullPath);

    return args;
  }
}
