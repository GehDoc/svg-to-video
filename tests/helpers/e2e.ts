import path from 'path';
import { spawnSync, execFileSync } from 'child_process';
import fs from 'node:fs';
import { PNG } from 'pngjs';
import ffprobeStatic from 'ffprobe-static';

export const FIXTURE_DIR_RELATIVE = './tests/fixtures';
export const OUTPUT_DIR_RELATIVE = './out-dir-test';

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
      'stream=width,height:format=duration:format_tags:stream_tags',
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

export const extractFrame = (videoPath: string, framePath: string): boolean => {
  spawnSync('ffmpeg', ['-y', '-i', videoPath, '-vframes', '1', framePath], {
    stdio: 'pipe',
  });
  return fs.existsSync(framePath);
};

export const getPixelColor = (imagePath: string): string => {
  const data = fs.readFileSync(imagePath);
  const png = PNG.sync.read(data);
  const idx = 0;
  const r = png.data[idx];
  const g = png.data[idx + 1];
  const b = png.data[idx + 2];
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
};
