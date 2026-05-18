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
}

async function main(): Promise<void> {
  const program = new Command();
  program
    .name('svg-to-video')
    .version(pkg.version)
    .description(
      `svg-to-video v${pkg.version} - Render a CSS-animated SVG to a high-quality video (MP4, WebM, MKV, MOV)`
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
  const inputBasename = path.basename(svgPath, path.extname(svgPath));
  const outputFileName = `${inputBasename}${options.transparent ? '.webm' : '.mp4'}`;
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
    `  Settings:   ${duration}s @ ${fps}fps (Hold: ${options.hold}s, Resolution: ${options.resolution}, Scale: ${options.scale}x, Transparent: ${options.transparent}, BGColor: ${options.bgColor || 'default'})`
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

  convertToMP4(
    outputFileName,
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

  console.log(`\n✅ Done! Video saved to ${path.join(outDir, outputFileName)}`);
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
  resolution: string,
  scale: number,
  transparent: boolean,
  bgColor: string
): Promise<void> {
  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', ...puppeteerArgs],
  });

  const page: Page = await browser.newPage();

  await page.goto('about:blank');
  await page.setContent(svg);

  // Set resolution
  let width = 1920;
  let height = 1080;
  if (resolution === '720p') {
    width = 1280;
    height = 720;
  } else if (resolution === '1080p') {
    width = 1920;
    height = 1080;
  } else if (resolution === 'original') {
    const dimensions = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return { width: 1920, height: 1080 };
      return {
        width: svg.width.baseVal.value,
        height: svg.height.baseVal.value,
      };
    });
    width = dimensions.width * scale;
    height = dimensions.height * scale;
  }

  if (resolution !== 'original') {
    await page.setViewport({ width, height });
    const { width: svgW, height: svgH } = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      if (!svg) return { width: 1920, height: 1080 };
      return {
        width: svg.width.baseVal.value,
        height: svg.height.baseVal.value,
      };
    });
    const scaleX = width / svgW;
    const scaleY = height / svgH;
    await page.addStyleTag({
      content: `
        svg {
          transform: scale(${scaleX}, ${scaleY});
          transform-origin: top left;
          width: ${svgW}px;
          height: ${svgH}px;
        }
      `,
    });
  } else {
    // For original size, we need to inject the scale via CSS transform
    await page.setViewport({ width, height });
    await page.addStyleTag({
      content: `
            svg {
              transform: scale(${scale});
              transform-origin: top left;
            }
          `,
    });
  }

  if (transparent) {
    await page.addStyleTag({
      content: `
        svg {
          background: transparent !important;
        }
      `,
    });
  } else if (bgColor) {
    await page.addStyleTag({
      content: `
        svg {
          background-color: ${bgColor} !important;
        }
      `,
    });
  }

  const renderSettings: ScreenshotOptions = {
    type: frameFileExtension,
    omitBackground: transparent,
  };
  console.log('🎨 Creating frames...');
  for (let frame = 1; frame <= totalFrames; ++frame) {
    const animationTimeInSeconds = (frame - 1) / fps; // seconds from start

    // update all animations via the Web Animations API; this is
    // sufficient for correct scrubbing regardless of the SVG's internal
    // structure.
    await page.evaluate(seekAnimations, animationTimeInSeconds * 1000);

    await page.evaluate(() => new Promise((r) => requestAnimationFrame(r)));

    const svgElement = await page.$('svg');
    if (svgElement === null) {
      console.error('❌ No SVG element found');
      process.exit(1);
    }

    const framePath = path.join(outDir, getFrameFilename(frame, padWidth));
    await svgElement.screenshot({ ...renderSettings, path: framePath });

    if (frame % fps === 0 || frame === totalFrames) {
      console.log(`  [Rendering] Frame ${frame} / ${totalFrames}`);
    }
  }

  await browser.close();
}

/**
 * convert the generated frames to an MP4 video using ffmpeg
 */
function convertToMP4(
  outputFileName: string,
  fps: number,
  padWidth: number,
  hold: number,
  outDir: string,
  transparent: boolean,
  metadata?: string[]
): void {
  console.log('📦 Encoding video with FFmpeg...');

  const filters: string[] = [];
  if (hold && hold > 0) {
    filters.push(`tpad=stop_mode=clone:stop_duration=${hold}`);
  }

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
  if (metadata) {
    metadata.forEach((m) => {
      if (m.startsWith('comment=')) {
        userComment = m.split('=')[1];
      } else {
        args.push('-metadata', m);
      }
    });
  }

  args.push(
    '-metadata',
    `comment=${mergeMetadataComments(userComment, pkg.version)}`
  );

  if (filters.length) {
    args.push('-vf', filters.join(','));
  }

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

  try {
    const output = child_process.execFileSync('ffmpeg', args, {
      encoding: 'utf8',
    });
    console.log(output);
  } catch (error) {
    console.error('❌ FFmpeg execution failed:');
    console.error(error);
    process.exit(1);
  }
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
