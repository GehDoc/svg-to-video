const fs = require('fs');
const child_process = require('child_process');
const puppeteer = require('puppeteer');
const { Command } = require('commander');
const path = require('path');

/** @type {'png'} */
const frameFileExtension = 'png';

async function main() {
  const program = new Command();
  program
    .name('svg-to-video')
    .description('Render a CSS-animated SVG to an MP4 video')
    .usage('<svgPath> <duration> <fps> <outDir> [options]')
    .argument('<svgPath>', 'input animated SVG file')
    .argument('<duration>', 'desired animation duration (seconds)', (v) =>
      parseFloat(v)
    )
    .argument('<fps>', 'frames per second', (v) => parseInt(v, 10))
    .argument('<outDir>', 'output directory')
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
    .action(run);

  program.parse(process.argv);
}

/**
 * main function to run the conversion process
 * @param {string} svgPath
 * @param {number} duration
 * @param {number} fps
 * @param {string} outDir
 * @param {{ keepFrames: boolean; hold: number; force: boolean }} options
 */
async function run(svgPath, duration, fps, outDir, options) {
  const inputBasename = path.basename(svgPath, path.extname(svgPath));
  const outputFileName = `${inputBasename}.mp4`;
  const outputFullPath = path.join(outDir, outputFileName);

  if (fs.existsSync(outputFullPath) && !options.force) {
    console.error(`❌ Error: Output file "${outputFullPath}" already exists.`);
    console.error(`   Use the --force (-f) flag to overwrite it.`);
    process.exit(1);
  }

  const svg = fs.readFileSync(svgPath, 'utf-8');

  const totalFrames = Math.ceil(fps * duration);
  const padWidth = Math.floor(Math.log10(totalFrames)) + 1;

  console.log('🚀 Starting conversion:');
  console.log(`  Source:     ${svgPath}`);
  console.log(`  Target:     ${path.join(outDir, outputFileName)}`);
  console.log(
    `  Settings:   ${duration}s @ ${fps}fps (Hold: ${options.hold}s)`
  );
  console.log(`  Frames:     ${totalFrames} total`);
  console.log('---');

  fs.mkdirSync(outDir, { recursive: true });

  await createFrames(svg, fps, totalFrames, padWidth, outDir);
  convertToMP4(outputFileName, fps, padWidth, options.hold, outDir);

  if (!options.keepFrames) {
    cleanupFrames(totalFrames, padWidth, outDir);
  }

  console.log(`\n✅ Done! Video saved to ${path.join(outDir, outputFileName)}`);
}

/**
 * create frame images by rendering the SVG in a headless browser and advancing the animation to the correct timestamp for each frame
 * @param {string} svg
 * @param {number} fps
 * @param {number} totalFrames
 * @param {number} padWidth
 * @param {string} outDir
 */
async function createFrames(svg, fps, totalFrames, padWidth, outDir) {
  // advance every animation to the desired timestamp. we use the Web
  // Animations API (`document.getAnimations()`) and set `currentTime` on
  // each animation, which works for any SVG regardless of how its
  // animations are defined.
  svg = svg.replace(/--play-state:\s*running\s*;/g, '--play-state: paused;');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      ...(process.env.PUPPETEER_ARGS
        ? process.env.PUPPETEER_ARGS.split(' ')
        : []),
    ],
  });

  const page = await browser.newPage();
  await page.goto('about:blank');
  await page.setContent(svg);

  await page.evaluate(seekAnimations, 0); // ensure all animations are at the start

  const renderSettings = {
    type: frameFileExtension,
    omitBackground: false,
    path: '',
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

    renderSettings.path = path.join(outDir, getFrameFilename(frame, padWidth));
    await svgElement.screenshot(renderSettings);

    if (frame % fps === 0 || frame === totalFrames) {
      console.log(`  [Rendering] Frame ${frame} / ${totalFrames}`);
    }
  }

  await browser.close();
}

/**
 * convert the generated frames to an MP4 video using ffmpeg
 * @param {string} outputFileName
 * @param {number} fps
 * @param {number} padWidth
 * @param {number} hold
 * @param {string} outDir
 */
function convertToMP4(outputFileName, fps, padWidth, hold, outDir) {
  console.log('📦 Encoding video with FFmpeg...');

  const filters = [];
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
  if (filters.length) {
    args.push('-vf', filters.join(','));
  }
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
 * @param {number} totalFrames
 * @param {number} padWidth
 * @param {string} outDir
 */
function cleanupFrames(totalFrames, padWidth, outDir) {
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
 * @param {number} frame
 * @param {number} padWidth
 * @returns {string}
 */
function getFrameFilename(frame, padWidth) {
  const prefix = ('' + frame).padStart(padWidth, '0');
  return `${prefix}.${frameFileExtension}`;
}

/**
 * Browser-side function to seek all animations to a specific time
 * @param {number} timeInMilliseconds
 */
const seekAnimations = (timeInMilliseconds) => {
  for (const animation of document.getAnimations()) {
    try {
      animation.pause();
    } catch (_error) {
      /* ignored */
    }
    animation.currentTime = timeInMilliseconds;
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
