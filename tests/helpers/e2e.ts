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
  const data: Record<string, string> = {};

  if (filePath.endsWith('.png')) {
    const buffer = fs.readFileSync(filePath);
    // Parse PNG tEXt chunks (signature is 8 bytes)
    let offset = 8;
    while (offset < buffer.length - 4) {
      const length = buffer.readUInt32BE(offset);
      const type = buffer.toString('ascii', offset + 4, offset + 8);
      if (type === 'tEXt') {
        const chunkData = buffer.subarray(offset + 8, offset + 8 + length);
        const nullIdx = chunkData.indexOf(0);
        if (nullIdx !== -1) {
          const keyword = chunkData.toString('ascii', 0, nullIdx);
          const text = chunkData.toString('utf-8', nullIdx + 1);
          data[`TAG:${keyword.toLowerCase()}`] = text;
        }
      }
      offset += 12 + length;
    }
    return data;
  }

  if (filePath.endsWith('.gif')) {
    const buffer = fs.readFileSync(filePath);
    // Look for Comment Extension: 0x21 0xFE
    for (let i = 0; i < buffer.length - 2; i++) {
      if (buffer[i] === 0x21 && buffer[i + 1] === 0xfe) {
        let offset = i + 2;
        let commentText = '';
        while (offset < buffer.length) {
          const blockSize = buffer[offset];
          if (blockSize === 0) break;
          commentText += buffer.toString(
            'utf-8',
            offset + 1,
            offset + 1 + blockSize
          );
          offset += 1 + blockSize;
        }
        if (commentText) {
          const sepIdx = commentText.indexOf(' - ');
          if (sepIdx !== -1) {
            data['TAG:title'] = commentText.substring(0, sepIdx);
            data['TAG:comment'] = commentText.substring(sepIdx + 3);
          } else {
            data['TAG:comment'] = commentText;
          }
        }
        break;
      }
    }
    return data;
  }

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

  console.log(`Probe output for ${filePath}:`, output);

  output.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value !== undefined) data[key] = value;
  });
  return data;
};

export const getFrameCount = (filePath: string): number => {
  // Try nb_frames first (fast, from metadata)
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
  ).trim();

  let count = parseInt(output, 10);

  // If nb_frames is missing (e.g. GIF, aPNG), count them manually
  if (isNaN(count)) {
    const manualOutput = execFileSync(
      ffprobeStatic.path,
      [
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-count_frames',
        '-show_entries',
        'stream=nb_read_frames',
        '-of',
        'default=nokey=1:noprint_wrappers=1',
        filePath,
      ],
      { encoding: 'utf-8' }
    ).trim();
    count = parseInt(manualOutput, 10);
  }

  return count;
};

export const extractFrame = (videoPath: string, framePath: string): boolean => {
  const args = ['-y'];
  if (videoPath.endsWith('.webm')) {
    // Explicitly use libvpx-vp9 to preserve the alpha channel during decoding,
    // as the default decoder may flatten transparent backgrounds to black.
    args.push('-c:v', 'libvpx-vp9');
  }
  args.push('-i', videoPath, '-vframes', '1', '-pix_fmt', 'rgba', framePath);

  const result = spawnSync('ffmpeg', args, { stdio: 'pipe' });

  if (result.status !== 0) {
    throw new Error(
      `ffmpeg failed to extract frame: ${result.stderr.toString()}`
    );
  }

  if (!fs.existsSync(framePath)) {
    throw new Error(`ffmpeg failed to create frame at ${framePath}`);
  }

  return true;
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
  const pixel = getPixelRGBA(imagePath, x, y);
  return pixel.a === 0;
};

export const hasAlphaStream = (filePath: string): boolean => {
  const data = getProbeMetadata(filePath);
  // WebM uses alpha_mode tag
  if (data['TAG:alpha_mode'] === '1') return true;
  // PNG, GIF report alpha in pix_fmt (rgba, bgra, yuva420p, etc.)
  if (data['pix_fmt'] && data['pix_fmt'].includes('a')) return true;
  return false;
};
