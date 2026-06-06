import path from 'path';
import { spawnSync, execFileSync } from 'child_process';
import fs from 'node:fs';
import { PNG } from 'pngjs';
import ffprobeStatic from 'ffprobe-static';

export const FIXTURE_DIR_RELATIVE = './tests/fixtures';
export const OUTPUT_DIR_RELATIVE = './out-dir-test';
export const SUCCESS_TIMEOUT = 30000;

export const ensureOutputDir = () => {
  if (!fs.existsSync(OUTPUT_DIR_RELATIVE)) {
    fs.mkdirSync(OUTPUT_DIR_RELATIVE, { recursive: true });
  }
};

export const getTestPaths = (fixtureName: string, extension = '.mp4') => {
  return {
    inputFile: path.join(FIXTURE_DIR_RELATIVE, `${fixtureName}.svg`),
    outputFile: path.join(OUTPUT_DIR_RELATIVE, `${fixtureName}${extension}`),
  };
};

export const getProbeMetadata = (filePath: string): Record<string, string> => {
  const output = execFileSync(
    ffprobeStatic.path,
    [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=width,height,pix_fmt:format=duration:format_tags:stream_tags',
      '-of',
      'default=noprint_wrappers=1:nokey=0',
      filePath,
    ],
    { encoding: 'utf-8' }
  );

  const data: Record<string, string> = {};
  output.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value !== undefined) data[key] = value;
  });
  return data;
};

export const getFrameCount = (filePath: string): number => {
  const output = execFileSync(
    ffprobeStatic.path,
    [
      '-v',
      'error',
      '-select_streams',
      'v:0',
      '-show_entries',
      'stream=nb_frames',
      '-of',
      'default=nokey=1:noprint_wrappers=1',
      filePath,
    ],
    { encoding: 'utf-8' }
  );
  return parseInt(output.trim(), 10);
};

export const extractFrame = (videoPath: string, framePath: string): boolean => {
  const args = ['-y'];
  if (videoPath.endsWith('.webm')) {
    // Explicitly use libvpx-vp9 to preserve the alpha channel during decoding,
    // as the default decoder may flatten transparent backgrounds to black.
    args.push('-c:v', 'libvpx-vp9');
  }
  args.push('-i', videoPath, '-vframes', '1', '-pix_fmt', 'rgba', framePath);

  spawnSync('ffmpeg', args, {
    stdio: 'pipe',
  });
  return fs.existsSync(framePath);
};

export const getPixelRGBA = (
  imagePath: string,
  x = 0,
  y = 0
): { r: number; g: number; b: number; a: number } => {
  const data = fs.readFileSync(imagePath);
  const png = PNG.sync.read(data);
  const idx = (png.width * y + x) << 2;
  return {
    r: png.data[idx],
    g: png.data[idx + 1],
    b: png.data[idx + 2],
    a: png.data[idx + 3],
  };
};

export const isPixelTransparent = (
  imagePath: string,
  x = 0,
  y = 0
): boolean => {
  const data = fs.readFileSync(imagePath);
  const png = PNG.sync.read(data);
  const idx = (png.width * y + x) << 2;
  const alpha = png.data[idx + 3];
  return alpha === 0;
};

export const hasAlphaStream = (filePath: string): boolean => {
  const data = getProbeMetadata(filePath);
  // WebM uses alpha_mode tag
  if (data['TAG:alpha_mode'] === '1') return true;
  // PNG, GIF report alpha in pix_fmt (rgba, bgra, yuva420p, etc.)
  if (data['pix_fmt'] && data['pix_fmt'].includes('a')) return true;
  return false;
};
