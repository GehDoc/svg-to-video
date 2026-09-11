import puppeteer, { Browser } from 'puppeteer';
import fs from 'fs';

type LaunchOptions = Parameters<typeof puppeteer.launch>[0];

/**
 * Common system binary candidates across Linux, macOS, and Windows.
 */
const COMMON_BROWSER_PATHS: string[] = [
  // Linux
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
  // macOS
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  // Windows
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
];

/**
 * Find the first existing system browser executable binary path.
 */
export function findSystemBrowserExecutable(): string | undefined {
  if (
    process.env.PUPPETEER_EXECUTABLE_PATH &&
    fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)
  ) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  for (const candidate of COMMON_BROWSER_PATHS) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

export interface LaunchBrowserOptions {
  puppeteerArgs?: string[];
}

/**
 * Launch Puppeteer browser with fallback system binary auto-detection and friendly diagnostics.
 */
export async function launchBrowser(
  options: LaunchBrowserOptions = {}
): Promise<Browser> {
  const customArgs = options.puppeteerArgs || [];
  const baseArgs = ['--no-sandbox', '--disable-setuid-sandbox', ...customArgs];

  const defaultLaunchOptions: LaunchOptions = {
    headless: true,
    args: baseArgs,
  };

  const envExecutable = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (envExecutable && fs.existsSync(envExecutable)) {
    defaultLaunchOptions.executablePath = envExecutable;
  }

  // 1. Try launching with default options / PUPPETEER_EXECUTABLE_PATH
  try {
    return await puppeteer.launch(defaultLaunchOptions);
  } catch (err: unknown) {
    const originalErrorMsg = err instanceof Error ? err.message : String(err);

    // 2. Try auto-detecting system installed Chrome / Chromium executable
    const systemExecutable = findSystemBrowserExecutable();
    if (systemExecutable && systemExecutable !== envExecutable) {
      try {
        return await puppeteer.launch({
          ...defaultLaunchOptions,
          executablePath: systemExecutable,
        });
      } catch {
        // Fall back to throwing diagnostic error below
      }
    }

    // 3. Throw user-friendly diagnostic error if no browser can be launched
    throw new Error(
      `Failed to launch Chrome/Chromium browser for SVG rendering.\n\n` +
        `Troubleshooting Fixes:\n` +
        `  1. Set PUPPETEER_EXECUTABLE_PATH=/path/to/chrome in your environment\n` +
        `  2. Download standalone Chrome: npx puppeteer browsers install chrome\n` +
        `  3. Install Chromium via package manager (e.g. sudo apt-get install chromium-browser)\n\n` +
        `Original launch error: ${originalErrorMsg}`
    );
  }
}
