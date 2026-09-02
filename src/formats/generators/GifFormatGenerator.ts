import path from 'path';
import fs from 'fs';
import { CLIFormatGenerator, CLIFormatOptions } from '../types.js';
import { mergeMetadataComments } from '../../../shared/metadata.js';
import { injectGifMetadata } from '../../../shared/gifMetadataInjector.js';

export class GifFormatGenerator implements CLIFormatGenerator {
  readonly id = 'gif';
  readonly extensions = ['.gif'];
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
    let title: string | undefined;
    if (metadata) {
      metadata.forEach((m) => {
        if (m.startsWith('comment=')) {
          userComment = m.split('=')[1];
        } else if (m.startsWith('title=')) {
          title = m.split('=')[1];
          args.push('-metadata', m);
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

    const reserveTrans = transparent ? 1 : 0;
    let filterComplex: string;
    if (filters.length > 0) {
      filterComplex = `${filters.join(',')},split[a][b];[a]palettegen=reserve_transparent=${reserveTrans}[p];[b][p]paletteuse`;
    } else {
      filterComplex = `split[a][b];[a]palettegen=reserve_transparent=${reserveTrans}[p];[b][p]paletteuse`;
    }

    args.push('-filter_complex', filterComplex);
    args.push('-loop', '0');

    const gifComment = title ? `${title} - ${finalComment}` : finalComment;
    args.push('-metadata', `comment=${gifComment}`);

    const outputFullPath = path.join(outDir, outputFileName);
    args.push('-f', 'gif', outputFullPath);

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
    const updatedBuf = injectGifMetadata(
      fileBuf,
      { title, comment: userComment },
      pkgVersion
    );
    fs.writeFileSync(outputFilePath, updatedBuf);
  }
}
