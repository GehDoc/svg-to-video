#!/usr/bin/env node
import fs from 'fs';
import child_process from 'child_process';
import { Writable } from 'stream';
import puppeteer, { Page, Browser, ScreenshotOptions } from 'puppeteer';
import { Command } from 'commander';
import path from 'path';
import { seekAnimations } from '#shared/animation-engine.js';
import { compositeFrame } from '#shared/canvasCompositing.js';
import { validateOptions } from './utils/validateOptions.js';
import {
  analyzeSvgAnimation,
  parseSvgDimensions,
  calculateAspectRatio,
  ParsedSvgDimensions,
} from '#shared/analyzeSvgAnimation.js';
import { formatRegistry } from './formats/registry.js';
import { CLIFormatGenerator, CLIFormatOptions } from './formats/types.js';
import { pkg } from './utils/packageInfo.js';
import { JSDOM } from 'jsdom'; // For duration detection in Node environment
import { Logger } from './utils/logger.js';
import { trackEvent, flushAnalytics } from './utils/analytics.js';
import { ConversionTracker } from '#shared/rendererTracking.js';

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
  bgColor?: string;
  metadata?: string[];
  format?: string;
  quiet: boolean;
  silent: boolean;
  json: boolean;
}

function writeFrameToStdin(stdin: Writable, buffer: Buffer): Promise<void> {
  return new Promise((resolve, reject) => {
    const canWrite = stdin.write(buffer, (err) => {
      if (err) return reject(err);
      if (canWrite) {
        resolve();
      }
    });
    if (!canWrite) {
      stdin.once('drain', resolve);
    }
  });
}

async function main(): Promise<void> {
  const program = new Command();
  program
    .name('svg-to-video')
    .version(pkg.version)
    .description(
      `svg-to-video v${pkg.version} - Render an animated SVG (CSS & SMIL) to a high-quality video or animated image (MP4, WebM, MKV, MOV, GIF, aPNG)`
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
      'resolution preset (720p, 1080p, original) or custom dimensions (e.g. 1080x1080, 1080x1920)',
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
      'background color for the video (e.g., #FFFFFF)'
    )
    .option(
      '--metadata <items...>',
      'metadata tags (e.g., --metadata title="My Video" author="Me")'
    )
    .option(
      '--format <format>',
      `output format: ${formatRegistry.getSupportedFormatNames().join(', ')}`
    )
    .option('-q, --quiet', 'suppress interactive progress output', false)
    .option('--silent', 'alias for --quiet', false)
    .option(
      '--json',
      'output final conversion result as JSON (implies quiet mode)',
      false
    )
    .action(run);

  program
    .command('mcp')
    .description('Start Model Context Protocol (MCP) server over stdio')
    .action(async () => {
      await import('./mcp.js');
    });

  await program.parseAsync(process.argv);
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
  const logger = new Logger({
    quiet: options.quiet || options.silent,
    json: options.json,
    homepage: pkg.homepage,
  });

  // Resolve format generator and output file extension via format registry
  const { generator, format, extension } =
    formatRegistry.resolveFormatAndExtension(
      options.format,
      options.transparent
    );
  const inputBasename = path.basename(svgPath, path.extname(svgPath));
  const ext = extension.startsWith('.') ? extension : `.${extension}`;
  const outputFileName = `${inputBasename}${ext}`;
  const outputFullPath = path.join(outDir, outputFileName);

  if (fs.existsSync(outputFullPath) && !options.force) {
    await logger.fatal(
      `Output file "${outputFullPath}" already exists. Use the --force (-f) flag to overwrite it.`
    );
    return;
  }

  try {
    validateOptions(options);
  } catch (error) {
    await logger.fatal(error instanceof Error ? error.message : String(error));
    return;
  }

  if (!fs.existsSync(svgPath)) {
    await logger.fatal(`Input SVG file "${svgPath}" does not exist.`);
    return;
  }

  const svg = fs.readFileSync(svgPath, 'utf-8');

  const dom = new JSDOM('');
  const parsedDim = parseSvgDimensions(svg, dom.window.DOMParser);
  const detectedDuration = analyzeSvgAnimation(svg, dom.window.DOMParser);

  let duration = options.duration;
  if (duration === undefined) {
    logger.info('🔍 Duration not provided, attempting to auto-detect...');

    duration = detectedDuration;
    if (duration === undefined) {
      await logger.fatal(
        'Could not detect duration. Please provide a duration using -d or --duration.'
      );
      return;
    }
    logger.info(`✅ Auto-detected duration: ${duration}s`);
  }

  const aspectRatio = calculateAspectRatio(
    parsedDim.width,
    parsedDim.height,
    parsedDim.isDimensionsDetected
  );

  trackEvent('file-load', {
    detectedDuration: detectedDuration ?? 0,
    hasAnimation: detectedDuration !== undefined && detectedDuration > 0,
    aspectRatio,
    isDimensionsDetected: parsedDim.isDimensionsDetected,
  });

  const puppeteerArgs = (process.env.PUPPETEER_ARGS || '')
    .split(' ')
    .filter((arg) => arg.trim().length > 0);

  const totalFrames = Math.ceil(fps * duration);
  const padWidth = Math.floor(Math.log10(totalFrames)) + 1;

  logger.info('🚀 Starting conversion:');
  logger.info(`  Source:     ${svgPath}`);
  logger.info(`  Target:     ${path.join(outDir, outputFileName)}`);

  logger.info(
    `  Settings:   ${duration}s @ ${fps}fps (Format: ${format}, Hold: ${options.hold}s, Resolution: ${options.resolution}, Scale: ${options.scale}x, Transparent: ${options.transparent}, BGColor: ${options.bgColor || 'default'})`
  );
  if (puppeteerArgs.length > 0) {
    logger.info(`  Puppeteer:  ${puppeteerArgs.join(' ')}`);
  }
  logger.info(`  Frames:     ${totalFrames} total`);
  logger.info('---');

  const tracker = new ConversionTracker(
    {
      format,
      isTransparent: options.transparent,
      captureMethod: 'puppeteer',
      fps,
      videoDurationSec: duration,
    },
    trackEvent
  );
  tracker.start();

  let activeBrowser: Browser | null = null;
  let activeFfmpeg: child_process.ChildProcess | null = null;

  let isCancelled = false;
  const handleSignal = async (signal: string) => {
    if (isCancelled) return;
    isCancelled = true;
    logger.info(`\n⚠️ Received ${signal}. Cancelling conversion...`);
    tracker.cancel();
    if (activeFfmpeg && !activeFfmpeg.killed) {
      activeFfmpeg.kill('SIGKILL');
    }
    if (activeBrowser) {
      await activeBrowser.close().catch(() => {});
    }
    await flushAnalytics();
    process.exit(130);
  };

  const sigintListener = () => void handleSignal('SIGINT');
  const sigtermListener = () => void handleSignal('SIGTERM');

  process.once('SIGINT', sigintListener);
  process.once('SIGTERM', sigtermListener);

  try {
    fs.mkdirSync(outDir, { recursive: true });

    await renderAndEncodeFrames({
      svg,
      parsedDim,
      fps,
      totalFrames,
      padWidth,
      outDir,
      outputFileName,
      puppeteerArgs,
      resolutionPreset: options.resolution,
      scaleFactor: options.scale,
      transparent: options.transparent,
      bgColor: options.bgColor,
      needsColorKeying: generator.needsColorKeying,
      keepFrames: options.keepFrames,
      hold: options.hold,
      metadata: options.metadata,
      generator,
      logger,
      onBrowserCreated: (b) => {
        activeBrowser = b;
      },
      onFfmpegCreated: (f) => {
        activeFfmpeg = f;
      },
    });

    tracker.success(totalFrames);
    await flushAnalytics();

    logger.done(outputFullPath, {
      duration,
      fps,
      format,
      totalFrames,
      resolution: options.resolution,
      transparent: options.transparent,
    });
  } catch (error) {
    if (!isCancelled) {
      tracker.failed(error instanceof Error ? error : String(error));
      await flushAnalytics();
      await logger.fatal(
        'Conversion failed',
        error instanceof Error ? error.message : String(error)
      );
    }
  } finally {
    process.removeListener('SIGINT', sigintListener);
    process.removeListener('SIGTERM', sigtermListener);
  }
}

/**
 * Render frames with Puppeteer and stream PNG buffers into FFmpeg stdin.
 */
async function renderAndEncodeFrames(params: {
  svg: string;
  parsedDim: ParsedSvgDimensions;
  fps: number;
  totalFrames: number;
  padWidth: number;
  outDir: string;
  outputFileName: string;
  puppeteerArgs: string[];
  resolutionPreset: string;
  scaleFactor: number;
  transparent: boolean;
  bgColor?: string;
  needsColorKeying: boolean;
  keepFrames: boolean;
  hold: number;
  metadata?: string[];
  generator: CLIFormatGenerator;
  logger: Logger;
  onBrowserCreated: (browser: Browser) => void;
  onFfmpegCreated: (ffmpeg: child_process.ChildProcess) => void;
}): Promise<void> {
  let width: number;
  let height: number;

  if (/^\d+x\d+$/i.test(params.resolutionPreset)) {
    const [wStr, hStr] = params.resolutionPreset.toLowerCase().split('x');
    width = parseInt(wStr, 10);
    height = parseInt(hStr, 10);
  } else if (params.resolutionPreset === '1080p') {
    width = 1920;
    height = 1080;
  } else if (params.resolutionPreset === '720p') {
    width = 1280;
    height = 720;
  } else if (params.resolutionPreset === 'original') {
    if (!params.parsedDim.isDimensionsDetected) {
      params.logger.warn(
        '⚠️ Warning: Could not detect SVG dimensions. Defaulting to 1920x1080.'
      );
    }

    width = Math.round(params.parsedDim.width * params.scaleFactor);
    height = Math.round(params.parsedDim.height * params.scaleFactor);
  } else {
    throw new Error(
      `Invalid resolution preset: ${params.resolutionPreset}. Expected '1080p', '720p', 'original', or custom dimensions (e.g. 1080x1080).`
    );
  }

  params.logger.info(`  Viewport:   ${width}x${height}`);

  const formatOptions: CLIFormatOptions = {
    outputFileName: params.outputFileName,
    fps: params.fps,
    padWidth: params.padWidth,
    hold: params.hold || 0,
    outDir: params.outDir,
    transparent: !!params.transparent,
    metadata: params.metadata,
    inputPattern: 'pipe:0',
    pkgVersion: pkg.version,
  };

  const args = params.generator.buildFfmpegArgs(formatOptions);

  params.logger.info('📦 Encoding output with FFmpeg...');
  const ffmpegProcess = child_process.spawn('ffmpeg', args, {
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  params.onFfmpegCreated(ffmpegProcess);

  let ffmpegStderr = '';
  ffmpegProcess.stderr.on('data', (chunk) => {
    ffmpegStderr += chunk.toString();
  });

  const ffmpegExitPromise = new Promise<{
    code: number | null;
    signal: NodeJS.Signals | null;
  }>((resolve, reject) => {
    ffmpegProcess.on('error', (err) => reject(err));
    ffmpegProcess.on('close', (code, signal) => resolve({ code, signal }));
  });

  params.logger.info('🚀 Preparing Puppeteer browser...');

  const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', ...params.puppeteerArgs],
  };

  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  let browser: Browser;
  try {
    browser = await puppeteer.launch(launchOptions);
  } catch (initialError) {
    if (launchOptions.executablePath) {
      throw initialError;
    }
    params.logger.info(
      '🔍 Bundled Chrome not found, attempting system Chrome...'
    );
    try {
      browser = await puppeteer.launch({ ...launchOptions, channel: 'chrome' });
    } catch {
      throw initialError;
    }
  }
  params.onBrowserCreated(browser);

  try {
    const page: Page = await browser.newPage();
    await page.setViewport({ width, height });

    await page.setContent(params.svg, { waitUntil: 'domcontentloaded' });

    const bgStyle = params.transparent
      ? 'html, body { background: transparent !important; }'
      : params.bgColor
        ? `html, body { background-color: ${params.bgColor} !important; }`
        : '';

    await page.addStyleTag({
      content: `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        svg { width: 100%; height: 100%; display: block; }
        ${bgStyle}
      `.trim(),
    });

    const screenshotOptions: ScreenshotOptions = {
      omitBackground: params.transparent,
    };

    const shouldKey = Boolean(
      params.transparent && params.bgColor && params.needsColorKeying
    );

    params.logger.info('📸 Rendering frames with Puppeteer...');
    for (let frame = 1; frame <= params.totalFrames; ++frame) {
      params.logger.writeProgress(
        `\r📸 Rendering frame ${frame}/${params.totalFrames}`
      );
      const timeMs = ((frame - 1) / params.fps) * 1000;
      await page.evaluate(seekAnimations, timeMs);

      let frameBuffer: Buffer;
      if (shouldKey) {
        const rawScreenshotBuffer = await page.screenshot(screenshotOptions);
        const b64Input = Buffer.from(rawScreenshotBuffer).toString('base64');
        const keyedBase64 = await page.evaluate(
          async (compositeFnStr, b64, bg, w, h) => {
            let canvas = document.getElementById(
              'matte-canvas'
            ) as HTMLCanvasElement;
            if (!canvas) {
              canvas = document.createElement('canvas');
              canvas.id = 'matte-canvas';
              canvas.width = w;
              canvas.height = h;
              canvas.style.display = 'none';
              document.body.appendChild(canvas);
            }
            const ctx = canvas.getContext('2d')!;
            const img = new Image();
            img.src = 'data:image/png;base64,' + b64;
            await img.decode();
            const compositeFn = new Function('return ' + compositeFnStr)();
            compositeFn(ctx, img, w, h, bg, true);
            return canvas.toDataURL('image/png').split(',')[1];
          },
          compositeFrame.toString(),
          b64Input,
          params.bgColor,
          width,
          height
        );
        frameBuffer = Buffer.from(keyedBase64, 'base64');
      } else {
        frameBuffer = (await page.screenshot(screenshotOptions)) as Buffer;
      }

      if (params.keepFrames) {
        const filename = path.join(
          params.outDir,
          getFrameFilename(frame, params.padWidth)
        );
        fs.writeFileSync(filename, frameBuffer);
      }

      await writeFrameToStdin(ffmpegProcess.stdin, frameBuffer);
    }
    params.logger.info('');

    ffmpegProcess.stdin.end();

    const { code } = await ffmpegExitPromise;
    if (code !== 0) {
      throw new Error(
        `FFmpeg execution failed (exit code ${code}): ${ffmpegStderr}`
      );
    }

    const outputFullPath = path.join(params.outDir, params.outputFileName);
    if (params.generator.postProcess) {
      params.generator.postProcess(outputFullPath, formatOptions);
    }
  } finally {
    await browser.close().catch(() => {});
  }
}

/**
 * Generates a padded filename for a given frame number.
 */
function getFrameFilename(frame: number, padWidth: number): string {
  const prefix = ('' + frame).padStart(padWidth, '0');
  return `${prefix}.${frameFileExtension}`;
}

main().catch(async (err) => {
  await flushAnalytics();
  console.error(err);
  process.exit(1);
});
