import fs from 'fs';
import child_process from 'child_process';
import { createRequire } from 'module';
import { Logger } from './logger.js';

const require = createRequire(import.meta.url);

/**
 * Checks if system FFmpeg is available on PATH.
 */
export function findSystemFfmpeg(): boolean {
  try {
    const result = child_process.spawnSync('ffmpeg', ['-version'], {
      stdio: 'ignore',
    });
    return result.status === 0;
  } catch {
    return false;
  }
}

/**
 * Resolves static binary path from optionalDependency ffmpeg-static if installed and available.
 */
export function getBundledFfmpeg(): string | null {
  try {
    const ffmpegStatic = require('ffmpeg-static');
    if (typeof ffmpegStatic === 'string' && fs.existsSync(ffmpegStatic)) {
      return ffmpegStatic;
    }
  } catch {
    // optionalDependency not installed or unavailable
  }
  return null;
}

/**
 * Resolves FFmpeg executable path with priority:
 * 1. Explicit path parameter or FFMPEG_PATH / FFMPEG_EXECUTABLE_PATH environment variable
 * 2. System FFmpeg executable found on PATH
 * 3. Bundled static binary via ffmpeg-static optionalDependency
 */
export function resolveFfmpegPath(
  explicitPath?: string,
  logger?: Logger
): string {
  // 1. Explicit path or ENV
  const candidate =
    explicitPath ||
    process.env.FFMPEG_PATH ||
    process.env.FFMPEG_EXECUTABLE_PATH;

  if (candidate) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    throw new Error(
      `Configured FFmpeg path not found or not executable: ${candidate}`
    );
  }

  // 2. System PATH
  if (findSystemFfmpeg()) {
    return 'ffmpeg';
  }

  // 3. Bundled ffmpeg-static fallback
  const bundled = getBundledFfmpeg();
  if (bundled) {
    logger?.info('🔍 System FFmpeg not found, using bundled static FFmpeg...');
    return bundled;
  }

  // 4. Failure with actionable instructions
  throw new Error(
    'FFmpeg is required to convert SVG animations to video, but was not found on your system.\n' +
      'Please install FFmpeg (e.g. via brew, apt, or winget) or set the FFMPEG_PATH environment variable.'
  );
}
