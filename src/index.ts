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
import { formatRegistry } from './formats/registry.js';
import { CLIFormatOptions } from './formats/types.js';
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
      `output format: ${formatRegistry.getSupportedFormatNames().join(', ')}`
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
  // Resolve format generator and output file extension via format registry
  const { format, extension } = formatRegistry.resolveFormatAndExtension(
    options.format,
    options.transparent
  );
  const inputBasename = path.basename(svgPath, path.extname(svgPath));
  const ext = extension.startsWith('.') ? extension : `.${extension}`;
  const outputFileName = `${inputBasename}${ext}`;
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

  console.log('🚀 Preparing Puppeteer browser...');

  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', ...puppeteerArgs],
  });

  const page: Page = await browser.newPage();
  await page.setViewport({ width, height });

  await page.setContent(svg, { waitUntil: 'domcontentloaded' });

  const bgStyle = transparent
    ? 'html, body { background: transparent !important; }'
    : bgColor
      ? `html, body { background-color: ${bgColor} !important; }`
      : '';

  await page.addStyleTag({
    content: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      svg { width: 100%; height: 100%; display: block; }
      ${bgStyle}
    `.trim(),
  });

  const screenshotOptions: ScreenshotOptions = {
    omitBackground: transparent,
  };

  console.log('📸 Rendering frames with Puppeteer...');
  for (let frame = 1; frame <= totalFrames; ++frame) {
    process.stdout.write(`\r📸 Rendering frame ${frame}/${totalFrames}`);
    const timeMs = ((frame - 1) / fps) * 1000;
    await page.evaluate(seekAnimations, timeMs);

    const filename = path.join(outDir, getFrameFilename(frame, padWidth));
    await page.screenshot({
      path: filename,
      ...screenshotOptions,
    });
  }
  console.log('');

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

  const normalizedFormat = format.toLowerCase();
  const generator = formatRegistry.get(normalizedFormat);
  if (!generator) {
    throw new Error(`Unsupported format: ${format}`);
  }

  const inputPattern = path.join(
    outDir,
    `%0${padWidth}d.${frameFileExtension}`
  );

  const formatOptions: CLIFormatOptions = {
    outputFileName,
    fps,
    padWidth,
    hold: hold || 0,
    outDir,
    transparent: !!transparent,
    metadata,
    inputPattern,
    pkgVersion: pkg.version,
  };

  const args = generator.buildFfmpegArgs(formatOptions);

  try {
    const output = child_process.execFileSync('ffmpeg', args, {
      encoding: 'utf8',
    });
    if (output) console.log(output);

    const outputFullPath = path.join(outDir, outputFileName);
    if (generator.postProcess) {
      generator.postProcess(outputFullPath, formatOptions);
    }
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
