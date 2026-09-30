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
import {
  analyzeSvgAnimation,
  parseSvgDimensions,
  calculateAspectRatio,
} from '#shared/analyzeSvgAnimation.js';
import { formatRegistry } from './formats/registry.js';
import { isLoggerJsonOutput } from './utils/logger.js';
import { trackEvent } from './utils/analytics.js';
import { pkg } from './utils/packageInfo.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cliJsPath = path.join(__dirname, 'index.js');
const cliTsPath = path.join(__dirname, 'index.ts');
const cliIndexPath = fs.existsSync(cliJsPath) ? cliJsPath : cliTsPath;

const isHosted =
  process.env.MCP_HOSTED === 'true' ||
  process.env.MCP_HOSTED === '1' ||
  process.argv.includes('--hosted');

type McpToolResponseContentBlock =
  | { type: 'text'; text: string }
  | { type: 'image'; data: string; mimeType: string }
  | {
      type: 'resource';
      resource: { uri: string; mimeType: string; blob: string };
    };

function trackSecurityRejection(): void {
  trackEvent(
    'file-load',
    {
      aspectRatio: 'unknown',
      hasAnimation: false,
      isDimensionsDetected: false,
      rejectionReason: 'path-traversal-blocked',
      isHosted: true,
    },
    'mcp'
  );
}

function getMimeType(formatStr: string): string {
  const generator = formatRegistry.get(formatStr);
  if (generator?.mimeType) {
    return generator.mimeType;
  }
  return 'application/octet-stream';
}

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
          'Render an animated SVG (from raw SVG code or file path) into a high-quality video (MP4, WebM, MKV, MOV) or animated image (aPNG, GIF) with in-band Base64 media delivery. Use this tool when you need to convert animated SVG graphics into video or image files. First use inspect_svg_animation to detect duration and dimensions if unknown. Specify svgContent for raw XML input or svgFilePath for local files. Pass transparent: true for WebM/GIF/aPNG transparency.',
        inputSchema: {
          type: 'object',
          properties: {
            svgFilePath: {
              type: 'string',
              description:
                'Absolute or relative path to the input .svg file (forbidden in hosted sandboxed mode).',
            },
            svgContent: {
              type: 'string',
              description:
                'Raw SVG string content to render (required if svgFilePath is not provided).',
            },
            outDir: {
              type: 'string',
              description:
                'Output directory to preserve generated file locally. Omit to deliver purely in-band via ephemeral storage (forbidden in hosted sandboxed mode).',
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
          'Analyze an SVG file or raw SVG content to detect CSS keyframe animations, estimate duration, and extract viewBox dimensions. Call this tool first before rendering to discover animation parameters and calculate optimal resolution.',
        inputSchema: {
          type: 'object',
          properties: {
            svgFilePath: {
              type: 'string',
              description:
                'Path to the .svg file to inspect (forbidden in hosted sandboxed mode).',
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

    if (isHosted && params.svgFilePath) {
      trackSecurityRejection();
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: 'Access to svgFilePath is forbidden when MCP_HOSTED security sandboxing is enabled. Please provide raw svgContent instead.',
          },
        ],
      };
    }

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

    const dom = new JSDOM('');
    const duration = analyzeSvgAnimation(svgContent, dom.window.DOMParser);
    const parsedDim = parseSvgDimensions(svgContent, dom.window.DOMParser);

    const aspectRatio = calculateAspectRatio(
      parsedDim.width,
      parsedDim.height,
      parsedDim.isDimensionsDetected
    );

    trackEvent(
      'file-load',
      {
        detectedDuration: duration ?? 0,
        hasAnimation: duration !== undefined && duration > 0,
        aspectRatio,
        isDimensionsDetected: parsedDim.isDimensionsDetected,
      },
      'mcp'
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              hasAnimation: duration !== undefined && duration > 0,
              estimatedDurationSeconds: duration ?? null,
              dimensions: parsedDim.isDimensionsDetected
                ? { width: parsedDim.width, height: parsedDim.height }
                : null,
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

    if (isHosted && (params.svgFilePath || params.outDir)) {
      trackSecurityRejection();
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: 'Providing svgFilePath or custom outDir is forbidden when MCP_HOSTED security sandboxing is enabled. Use raw svgContent and rely on in-band media delivery.',
          },
        ],
      };
    }

    let tempWorkDir: string | null = null;
    let targetSvgPath = params.svgFilePath;

    try {
      if (!targetSvgPath && params.svgContent) {
        tempWorkDir = fs.mkdtempSync(path.join(os.tmpdir(), 'svg2vid-mcp-'));
        targetSvgPath = path.join(tempWorkDir, 'input.svg');
        fs.writeFileSync(targetSvgPath, params.svgContent, 'utf-8');
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

      const isExplicitOutDir = Boolean(params.outDir);
      let renderOutDir: string;
      if (isExplicitOutDir && params.outDir) {
        renderOutDir = params.outDir;
      } else {
        if (!tempWorkDir) {
          tempWorkDir = fs.mkdtempSync(path.join(os.tmpdir(), 'svg2vid-mcp-'));
        }
        renderOutDir = tempWorkDir;
      }

      const fps = String(params.fps || 60);

      const command = cliIndexPath.endsWith('.ts') ? 'npx' : process.execPath;
      const cliArgs: string[] = cliIndexPath.endsWith('.ts')
        ? [
            'tsx',
            cliIndexPath,
            targetSvgPath,
            fps,
            renderOutDir,
            '--json',
            '--force',
          ]
        : [cliIndexPath, targetSvgPath, fps, renderOutDir, '--json', '--force'];

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

      const rawOutput = execFileSync(command, cliArgs, {
        encoding: 'utf-8',
        cwd: process.cwd(),
        env: {
          ...process.env,
          SVG_TO_VIDEO_INTERFACE: 'mcp',
        },
      });

      const parsed: unknown = JSON.parse(rawOutput.trim());
      if (isLoggerJsonOutput(parsed)) {
        if (parsed.success === true && parsed.outputFile) {
          const generatedFilePath = parsed.outputFile;
          const mediaBuffer = fs.readFileSync(generatedFilePath);
          const base64Data = mediaBuffer.toString('base64');
          const resolvedFormat = parsed.format || params.format || 'webm';
          const mimeType = getMimeType(resolvedFormat);

          const responseTextObject: Record<string, unknown> = { ...parsed };
          if (!isExplicitOutDir) {
            delete responseTextObject['outputFile'];
          }

          const responseContentList: McpToolResponseContentBlock[] = [
            {
              type: 'text',
              text: JSON.stringify(responseTextObject, null, 2),
            },
          ];

          if (mimeType.startsWith('image/')) {
            responseContentList.push({
              type: 'image',
              data: base64Data,
              mimeType,
            });
          } else {
            responseContentList.push({
              type: 'resource',
              resource: {
                uri: `urn:svg-to-video:media`,
                mimeType,
                blob: base64Data,
              },
            });
          }

          return {
            content: responseContentList,
          };
        } else {
          const errorMsg =
            'error' in parsed && typeof parsed.error === 'string'
              ? parsed.error
              : 'Conversion failed';
          return {
            isError: true,
            content: [
              {
                type: 'text',
                text: errorMsg,
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
      return {
        isError: true,
        content: [
          {
            type: 'text',
            text: `Execution failed: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    } finally {
      if (tempWorkDir) {
        try {
          fs.rmSync(tempWorkDir, { recursive: true, force: true });
        } catch {
          // ignore cleanup error
        }
      }
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
