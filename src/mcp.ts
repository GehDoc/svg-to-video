#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import { analyzeSvgAnimation } from '../shared/analyzeSvgAnimation.js';
import { isLoggerJsonOutput } from './utils/logger.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cliIndexPath = path.join(__dirname, 'index.ts');

const server = new Server(
  {
    name: 'svg-to-video',
    version: pkg.version,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'render_svg_to_video',
        description:
          'Render an animated SVG (from file path or raw SVG code) into a high-quality video (MP4, WebM, MKV, MOV) or animated image (aPNG, GIF) with optional background transparency.',
        inputSchema: {
          type: 'object',
          properties: {
            svgFilePath: {
              type: 'string',
              description: 'Absolute or relative path to the input .svg file.',
            },
            svgContent: {
              type: 'string',
              description:
                'Raw SVG string content to render (if svgFilePath is not provided).',
            },
            outDir: {
              type: 'string',
              description:
                'Output directory for the generated media file. Defaults to current working directory.',
            },
            fps: {
              type: 'number',
              description: 'Frames per second (e.g. 24, 30, 60). Default: 60.',
              default: 60,
            },
            duration: {
              type: 'number',
              description:
                'Desired animation duration in seconds. If omitted, duration is auto-detected.',
            },
            format: {
              type: 'string',
              enum: ['mp4', 'webm', 'gif', 'apng', 'mkv', 'mov'],
              description:
                'Output media format. Defaults to webm if transparent is true, otherwise mp4.',
            },
            transparent: {
              type: 'boolean',
              description:
                'Render with full alpha-channel transparency (supported for webm, gif, apng, mov).',
              default: false,
            },
            resolution: {
              type: 'string',
              enum: ['original', '1080p', '720p'],
              description: 'Resolution preset. Default: original.',
              default: 'original',
            },
            scale: {
              type: 'number',
              description:
                'Scale factor (1-4) when using original resolution. Default: 1.',
              default: 1,
            },
            bgColor: {
              type: 'string',
              description:
                'Background color hex code (e.g. #ffffff). Cannot be used with transparent.',
            },
            hold: {
              type: 'number',
              description:
                'Seconds to freeze the last frame at the end of the video.',
              default: 0,
            },
          },
        },
      },
      {
        name: 'inspect_svg_animation',
        description:
          'Analyze an SVG file or raw SVG content to detect CSS keyframe animations, estimate duration, and extract viewBox dimensions.',
        inputSchema: {
          type: 'object',
          properties: {
            svgFilePath: {
              type: 'string',
              description: 'Path to the .svg file to inspect.',
            },
            svgContent: {
              type: 'string',
              description: 'Raw SVG content to inspect.',
            },
          },
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'inspect_svg_animation') {
    const params = (args || {}) as {
      svgFilePath?: string;
      svgContent?: string;
    };
    let svgContent = params.svgContent;

    if (!svgContent && params.svgFilePath) {
      if (!fs.existsSync(params.svgFilePath)) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `File not found: ${params.svgFilePath}`,
            },
          ],
        };
      }
      svgContent = fs.readFileSync(params.svgFilePath, 'utf-8');
    }

    if (!svgContent) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: 'Either svgFilePath or svgContent must be provided.',
          },
        ],
      };
    }

    const dom = new JSDOM(svgContent);
    const duration = analyzeSvgAnimation(svgContent, dom.window.DOMParser);
    const svgEl = dom.window.document.querySelector('svg');

    let width: number | undefined;
    let height: number | undefined;
    if (svgEl) {
      const viewBox = svgEl.getAttribute('viewBox');
      if (viewBox) {
        const parts = viewBox.trim().split(/[\s,]+/);
        if (parts.length === 4) {
          width = parseFloat(parts[2]);
          height = parseFloat(parts[3]);
        }
      }
      if (!width || !height) {
        width = parseFloat(svgEl.getAttribute('width') || '');
        height = parseFloat(svgEl.getAttribute('height') || '');
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              hasAnimation: duration !== undefined && duration > 0,
              estimatedDurationSeconds: duration ?? null,
              dimensions: width && height ? { width, height } : null,
              hasStyles: svgContent.includes('<style>'),
            },
            null,
            2
          ),
        },
      ],
    };
  }

  if (name === 'render_svg_to_video') {
    const params = (args || {}) as {
      svgFilePath?: string;
      svgContent?: string;
      outDir?: string;
      fps?: number;
      duration?: number;
      format?: string;
      transparent?: boolean;
      resolution?: string;
      scale?: number;
      bgColor?: string;
      hold?: number;
    };

    let targetSvgPath = params.svgFilePath;
    let tempSvgFile = false;

    if (!targetSvgPath && params.svgContent) {
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'svg2vid-mcp-'));
      targetSvgPath = path.join(tempDir, 'input.svg');
      fs.writeFileSync(targetSvgPath, params.svgContent, 'utf-8');
      tempSvgFile = true;
    }

    if (!targetSvgPath || !fs.existsSync(targetSvgPath)) {
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Input SVG not found or not provided: ${targetSvgPath || 'N/A'}`,
          },
        ],
      };
    }

    const outDir = params.outDir || process.cwd();
    const fps = String(params.fps || 60);

    const cliArgs: string[] = [
      'tsx',
      cliIndexPath,
      targetSvgPath,
      fps,
      outDir,
      '--json',
      '--force',
    ];

    if (params.duration) {
      cliArgs.push('-d', String(params.duration));
    }
    if (params.format) {
      cliArgs.push('--format', params.format);
    }
    if (params.transparent) {
      cliArgs.push('--transparent');
    }
    if (params.resolution) {
      cliArgs.push('--resolution', params.resolution);
    }
    if (params.scale) {
      cliArgs.push('--scale', String(params.scale));
    }
    if (params.bgColor) {
      cliArgs.push('--bg-color', params.bgColor);
    }
    if (params.hold) {
      cliArgs.push('-h', String(params.hold));
    }

    try {
      const rawOutput = execFileSync('npx', cliArgs, {
        encoding: 'utf-8',
        cwd: process.cwd(),
      });

      if (tempSvgFile && targetSvgPath) {
        try {
          fs.rmSync(path.dirname(targetSvgPath), {
            recursive: true,
            force: true,
          });
        } catch {
          // ignore cleanup error
        }
      }

      const parsed: unknown = JSON.parse(rawOutput.trim());
      if (isLoggerJsonOutput(parsed)) {
        if (parsed.success) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(parsed, null, 2),
              },
            ],
          };
        } else {
          return {
            isError: true,
            content: [
              {
                type: 'text',
                text: parsed.error || 'Conversion failed',
              },
            ],
          };
        }
      } else {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: 'CLI returned unexpected output format.',
            },
          ],
        };
      }
    } catch (error) {
      if (tempSvgFile && targetSvgPath) {
        try {
          fs.rmSync(path.dirname(targetSvgPath), {
            recursive: true,
            force: true,
          });
        } catch {
          // ignore cleanup error
        }
      }

      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Execution failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }

  return {
    isError: true,
    content: [
      {
        type: 'text',
        text: `Unknown tool: ${name}`,
      },
    ],
  };
});

async function runMcp(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

runMcp().catch((err) => {
  console.error('Fatal MCP Server Error:', err);
  process.exit(1);
});
