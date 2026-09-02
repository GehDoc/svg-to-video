import path from 'path';
import fs from 'fs';
import { CLIFormatGenerator, CLIFormatOptions } from '../types.js';
import { mergeMetadataComments } from '../../../shared/metadata.js';
import { injectApngMetadata } from '../../../shared/apngMetadataInjector.js';

export class ApngFormatGenerator implements CLIFormatGenerator {
  readonly id = 'apng';
  readonly extensions = ['.apng', '.png'];
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

    args.push('-f', 'apng', '-plays', '0');
    if (transparent) {
      args.push('-pix_fmt', 'rgba');
    } else {
      args.push('-pix_fmt', 'rgb24');
    }

    args.push('-metadata', `comment=${finalComment}`);

    const outputFullPath = path.join(outDir, outputFileName);
    args.push(outputFullPath);

    return args;
  }

  postProcess(outputFilePath: string, options: CLIFormatOptions): void {
    const { metadata, pkgVersion } = options;
    let userComment: string | undefined;
    let title: string | undefined;
    if (metadata) {
      metadata.forEach((m) => {
        if (m.startsWith('comment=')) {
          userComment = m.split('=')[1];
        } else if (m.startsWith('title=')) {
          title = m.split('=')[1];
        }
      });
    }

    const fileBuf = fs.readFileSync(outputFilePath);
    const updatedBuf = injectApngMetadata(
      fileBuf,
      { title, comment: userComment },
      pkgVersion
    );
    fs.writeFileSync(outputFilePath, updatedBuf);
  }
}
