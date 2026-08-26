#!/usr/bin/env node
import fs from 'fs';
import child_process from 'child_process';
import puppeteer, { Page, Browser, ScreenshotOptions } from 'puppeteer';
import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import { seekAnimations } from '../shared/animation-engine.js';
import { validateOptions } from './utils/validateOptions.js';
import { analyzeSvgAnimation } from '../shared/analyzeSvgAnimation.js';
import { mergeMetadataComments } from '../shared/metadata.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../package.json');
import zlib from 'zlib';
import { JSDOM } from 'jsdom'; // For duration detection in Node environment

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type FrameFileExtension = 'png';
const frameFileExtension: FrameFileExtension = 'png';

interface RunOptions {
  duration?: number;
  keepFrames: boolean;
  hold: number;
  force: boolean;
  resolution: string;
  scale: number;
  transparent: boolean;
  bgColor: string;
  metadata?: string[];
  format?: string;
}

async function main(): Promise<void> {
  const program = new Command();
  program
    .name('svg-to-video')
    .version(pkg.version)
    .description(
      `svg-to-video v${pkg.version} - Render a CSS-animated SVG to a high-quality video or animated image (MP4, WebM, MKV, MOV, GIF, aPNG)`
    )
    .usage('<svgPath> <fps> <outDir> [options]')
    .addHelpText(
      'after',
      `
Resources:
  GitHub:  ${pkg.homepage}
  Support: ${pkg.funding.url} (Buy me a coffee! \u2615)`
    )
    .argument('<svgPath>', 'input animated SVG file')
    .argument('<fps>', 'frames per second', (v) => parseInt(v, 10))
    .argument('<outDir>', 'output directory')
    .option(
      '-d, --duration <seconds>',
      'desired animation duration (seconds)',
      (v) => parseFloat(v)
    )
    .option(
      '-h, --hold <seconds>',
      'additional seconds to freeze last frame',
      (v) => {
        const num = parseFloat(v);
        if (isNaN(num) || num < 0) {
          console.warn(`Warning: Invalid hold value "${v}". Defaulting to 0.`);
          return 0;
        }
        return num;
      },
      0
    )
    .option(
      '--keep-frames',
      'keep temporary frames after creating video',
      false
    )
    .option(
      '-f, --force',
      'overwrite existing output files without asking',
      false
    )
    .option(
      '--resolution <preset>',
      'resolution preset: 720p, 1080p, or original',
      'original'
    )
    .option(
      '--scale <number>',
      'scale factor for original resolution (1-4)',
      (v) => parseFloat(v),
      1
    )
    .option('--transparent', 'render with a transparent background', false)
    .option(
      '--bg-color <hex>',
      'background color for the video (e.g., #FFFFFF)',
      '#ffffff'
    )
    .option(
      '--metadata <items...>',
      'metadata tags (e.g., --metadata title="My Video" author="Me")'
    )
    .option(
      '--format <format>',
      'output format: mp4, webm, mkv, mov, gif, apng, png'
    )
    .action(run);

  program.parse(process.argv);
}

/**
 * main function to run the conversion process
 */
async function run(
  svgPath: string,
  fps: number,
  outDir: string,
  options: RunOptions
): Promise<void> {
  const format = (
    options.format || (options.transparent ? 'webm' : 'mp4')
  ).toLowerCase();
  const ext = format === 'png' ? 'png' : format;
  const inputBasename = path.basename(svgPath, path.extname(svgPath));
  const outputFileName = `${inputBasename}.${ext}`;
  const outputFullPath = path.join(outDir, outputFileName);

  if (fs.existsSync(outputFullPath) && !options.force) {
    console.error(`❌ Error: Output file "${outputFullPath}" already exists.`);
    console.error(`   Use the --force (-f) flag to overwrite it.`);
    process.exit(1);
  }

  try {
    validateOptions(options);
  } catch (error) {
    console.error(
      `❌ Error: ${error instanceof Error ? error.message : error}`
    );
    process.exit(1);
  }

  const svg = fs.readFileSync(svgPath, 'utf-8');

  let duration = options.duration;
  if (duration === undefined) {
    console.log('🔍 Duration not provided, attempting to auto-detect...');

    const dom = new JSDOM('');
    duration = analyzeSvgAnimation(svg, dom.window.DOMParser);
    if (duration === undefined) {
      console.error(
        '❌ Error: Could not detect duration. Please provide a duration using -d or --duration.'
      );
      process.exit(1);
    }
    console.log(`✅ Auto-detected duration: ${duration}s`);
  }

  const puppeteerArgs = (process.env.PUPPETEER_ARGS || '')
    .split(' ')
    .filter((arg) => arg.trim().length > 0);

  const totalFrames = Math.ceil(fps * duration!);
  const padWidth = Math.floor(Math.log10(totalFrames)) + 1;

  console.log('🚀 Starting conversion:');
  console.log(`  Source:     ${svgPath}`);
  console.log(`  Target:     ${path.join(outDir, outputFileName)}`);

  console.log(
    `  Settings:   ${duration}s @ ${fps}fps (Format: ${format}, Hold: ${options.hold}s, Resolution: ${options.resolution}, Scale: ${options.scale}x, Transparent: ${options.transparent}, BGColor: ${options.bgColor || 'default'})`
  );
  if (puppeteerArgs.length > 0) {
    console.log(`  Puppeteer:  ${puppeteerArgs.join(' ')}`);
  }
  console.log(`  Frames:     ${totalFrames} total`);
  console.log('---');

  fs.mkdirSync(outDir, { recursive: true });

  await createFrames(
    svg,
    fps,
    totalFrames,
    padWidth,
    outDir,
    puppeteerArgs,
    options.resolution,
    options.scale,
    options.transparent,
    options.bgColor
  );

  convertToOutput(
    outputFileName,
    format,
    fps,
    padWidth,
    options.hold,
    outDir,
    options.transparent,
    options.metadata
  );

  if (!options.keepFrames) {
    cleanupFrames(totalFrames, padWidth, outDir);
  }

  console.log(`\n✅ Done! File saved to ${path.join(outDir, outputFileName)}`);
  console.log(
    '\x1b[2m%s\x1b[0m',
    `Love this tool? Star it on GitHub: ${pkg.homepage}`
  );
}

/**
 * create frame images by rendering the SVG in a headless browser and advancing the animation to the correct timestamp for each frame
 */
async function createFrames(
  svg: string,
  fps: number,
  totalFrames: number,
  padWidth: number,
  outDir: string,
  puppeteerArgs: string[],
  resolutionPreset: string,
  scaleFactor: number,
  transparent: boolean,
  bgColor: string
): Promise<void> {
  console.log('📸 Rendering frames with Puppeteer...');

  let width = 0;
  let height = 0;

  if (resolutionPreset === '1080p') {
    width = 1920;
    height = 1080;
  } else if (resolutionPreset === '720p') {
    width = 1280;
    height = 720;
  } else if (resolutionPreset === 'original') {
    const dom = new JSDOM(svg);
    const svgEl = dom.window.document.querySelector('svg');

    if (!svgEl) {
      throw new Error('Invalid SVG: No <svg> root element found.');
    }

    const viewBox = svgEl.getAttribute('viewBox');
    const widthAttr = svgEl.getAttribute('width');
    const heightAttr = svgEl.getAttribute('height');

    if (viewBox) {
      const parts = viewBox.trim().split(/[\s,]+/);
      if (parts.length === 4) {
        width = parseFloat(parts[2]);
        height = parseFloat(parts[3]);
      }
    }

    if ((!width || !height) && widthAttr && heightAttr) {
      width = parseFloat(widthAttr);
      height = parseFloat(heightAttr);
    }

    if (!width || !height) {
      console.warn(
        '⚠️ Warning: Could not detect SVG dimensions. Defaulting to 1280x720.'
      );
      width = 1280;
      height = 720;
    }

    width = Math.round(width * scaleFactor);
    height = Math.round(height * scaleFactor);
  } else {
    throw new Error(
      `Invalid resolution preset: ${resolutionPreset}. Expected '1080p', '720p', or 'original'.`
    );
  }

  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', ...puppeteerArgs],
  });

  const page: Page = await browser.newPage();
  await page.setViewport({ width, height });

  await page.goto('about:blank');
  await page.setContent(svg);

  let styleTag = '';
  if (transparent) {
    styleTag =
      '<style>html, body { background: transparent !important; }</style>';
  } else if (bgColor) {
    styleTag = `<style>html, body { background-color: ${bgColor} !important; }</style>`;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        ${styleTag}
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          svg { width: 100%; height: 100%; display: block; }
        </style>
      </head>
      <body>
        ${svg}
      </body>
    </html>
  `;

  await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

  const screenshotOptions: ScreenshotOptions = {
    omitBackground: transparent,
  };

  for (let frame = 1; frame <= totalFrames; ++frame) {
    const timeMs = ((frame - 1) / fps) * 1000;
    await page.evaluate(seekAnimations, timeMs);

    const filename = path.join(outDir, getFrameFilename(frame, padWidth));
    await page.screenshot({
      path: filename,
      ...screenshotOptions,
    });
  }

  await browser.close();
}

/**
 * convert the generated frames to an output format using ffmpeg
 */
function convertToOutput(
  outputFileName: string,
  format: string,
  fps: number,
  padWidth: number,
  hold: number,
  outDir: string,
  transparent: boolean,
  metadata?: string[]
): void {
  console.log('📦 Encoding output with FFmpeg...');

  const inputPattern = path.join(
    outDir,
    `%0${padWidth}d.${frameFileExtension}`
  );
  const outputFullPath = path.join(outDir, outputFileName);

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

  const finalComment = mergeMetadataComments(userComment, pkg.version);
  const normalizedFormat = format.toLowerCase();

  if (normalizedFormat === 'gif') {
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
    args.push('-f', 'gif', outputFullPath);
  } else if (normalizedFormat === 'apng' || normalizedFormat === 'png') {
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
    args.push(outputFullPath);
  } else {
    const filters: string[] = [];
    if (hold && hold > 0) {
      filters.push(`tpad=stop_mode=clone:stop_duration=${hold}`);
    }
    if (filters.length) {
      args.push('-vf', filters.join(','));
    }

    args.push('-metadata', `comment=${finalComment}`);

    if (normalizedFormat === 'webm') {
      if (transparent) {
        args.push(
          '-c:v',
          'libvpx-vp9',
          '-pix_fmt',
          'yuva420p',
          '-f',
          'webm',
          outputFullPath
        );
      } else {
        args.push(
          '-c:v',
          'libvpx-vp9',
          '-pix_fmt',
          'yuv420p',
          '-f',
          'webm',
          outputFullPath
        );
      }
    } else if (normalizedFormat === 'mkv') {
      if (transparent) {
        args.push('-c:v', 'libvpx-vp9', '-pix_fmt', 'yuva420p', outputFullPath);
      } else {
        args.push(
          '-c:v',
          'libx264',
          '-crf',
          '20',
          '-preset',
          'slow',
          '-pix_fmt',
          'yuv420p',
          outputFullPath
        );
      }
    } else if (normalizedFormat === 'mov') {
      if (transparent) {
        args.push('-c:v', 'png', '-pix_fmt', 'rgba', outputFullPath);
      } else {
        args.push(
          '-c:v',
          'libx264',
          '-crf',
          '20',
          '-preset',
          'slow',
          '-pix_fmt',
          'yuv420p',
          outputFullPath
        );
      }
    } else {
      args.push(
        '-c:v',
        'libx264',
        '-crf',
        '20',
        '-preset',
        'slow',
        '-pix_fmt',
        'yuv420p',
        '-movflags',
        '+faststart',
        outputFullPath
      );
    }
  }

  try {
    const output = child_process.execFileSync('ffmpeg', args, {
      encoding: 'utf8',
    });
    if (output) console.log(output);

    if (normalizedFormat === 'gif') {
      const fileBuf = fs.readFileSync(outputFullPath);
      const gifComment = title ? `${title} - ${finalComment}` : finalComment;
      const updatedBuf = injectGifMetadata(fileBuf, gifComment);
      fs.writeFileSync(outputFullPath, updatedBuf);
    } else if (normalizedFormat === 'apng' || normalizedFormat === 'png') {
      const fileBuf = fs.readFileSync(outputFullPath);
      const metadataMap: Record<string, string> = { Comment: finalComment };
      if (title) metadataMap['Title'] = title;
      if (metadata) {
        metadata.forEach((m) => {
          const eqIdx = m.indexOf('=');
          if (eqIdx !== -1) {
            const k = m.substring(0, eqIdx);
            const v = m.substring(eqIdx + 1);
            if (k !== 'comment' && k !== 'title') {
              metadataMap[k] = v;
            }
          }
        });
      }
      const updatedBuf = injectPngMetadata(fileBuf, metadataMap);
      fs.writeFileSync(outputFullPath, updatedBuf);
    }
  } catch (error) {
    console.error('❌ FFmpeg execution failed:');
    console.error(error);
    process.exit(1);
  }
}

/**
 * injects a GIF comment extension block into a GIF buffer
 */
function injectGifMetadata(gifBuffer: Buffer, comment: string): Buffer {
  if (gifBuffer.length < 13) return gifBuffer;
  const packed = gifBuffer[10];
  const hasGCT = (packed & 0x80) !== 0;
  const gctSize = hasGCT ? 3 * (1 << ((packed & 0x07) + 1)) : 0;
  const insertOffset = 13 + gctSize;

  const commentBytes = Buffer.from(comment, 'utf-8');
  const blocks: Buffer[] = [];
  let pos = 0;
  while (pos < commentBytes.length) {
    const chunkSize = Math.min(255, commentBytes.length - pos);
    const block = Buffer.alloc(1 + chunkSize);
    block[0] = chunkSize;
    commentBytes.copy(block, 1, pos, pos + chunkSize);
    blocks.push(block);
    pos += chunkSize;
  }
  const commentExtension = Buffer.concat([
    Buffer.from([0x21, 0xfe]),
    ...blocks,
    Buffer.from([0x00]),
  ]);

  return Buffer.concat([
    gifBuffer.subarray(0, insertOffset),
    commentExtension,
    gifBuffer.subarray(insertOffset),
  ]);
}

/**
 * creates a PNG tEXt chunk buffer for a given keyword and text
 */
function createPngTextChunk(keyword: string, text: string): Buffer {
  const keywordBuf = Buffer.from(keyword, 'ascii');
  const textBuf = Buffer.from(text, 'utf-8');
  const data = Buffer.concat([keywordBuf, Buffer.from([0]), textBuf]);
  const type = Buffer.from('tEXt', 'ascii');
  const typeAndData = Buffer.concat([type, data]);
  const crc = zlib.crc32(typeAndData);

  const lengthBuf = Buffer.alloc(4);
  lengthBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([lengthBuf, typeAndData, crcBuf]);
}

/**
 * injects PNG tEXt metadata chunks into a PNG/aPNG buffer right after the IHDR chunk
 */
function injectPngMetadata(
  pngBuffer: Buffer,
  metadataMap: Record<string, string>
): Buffer {
  if (pngBuffer.length < 33) return pngBuffer;
  const chunks: Buffer[] = [];
  for (const [key, val] of Object.entries(metadataMap)) {
    if (val) {
      chunks.push(createPngTextChunk(key, val));
    }
  }
  if (chunks.length === 0) return pngBuffer;
  const injected = Buffer.concat(chunks);
  return Buffer.concat([
    pngBuffer.subarray(0, 33),
    injected,
    pngBuffer.subarray(33),
  ]);
}

/**
 * delete the generated frames
 */
function cleanupFrames(
  totalFrames: number,
  padWidth: number,
  outDir: string
): void {
  console.log('🧹 Cleaning up temporary frames...');
  for (let frame = 1; frame <= totalFrames; ++frame) {
    const filename = path.join(outDir, getFrameFilename(frame, padWidth));
    try {
      fs.unlinkSync(filename);
    } catch (error) {
      console.error(`❌ Failed to delete frame: ${filename}`);
      console.error(error);
    }
  }
}

/**
 * Generates a padded filename for a given frame number.
 */
function getFrameFilename(frame: number, padWidth: number): string {
  const prefix = ('' + frame).padStart(padWidth, '0');
  return `${prefix}.${frameFileExtension}`;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
