#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import express, { Request, Response } from 'express';
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
import { isLoggerJsonOutput } from './utils/logger.js';
import { trackEvent } from './utils/analytics.js';
import { pkg } from './utils/packageInfo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cliJsPath = path.join(__dirname, 'index.js');
const cliTsPath = path.join(__dirname, 'index.ts');
const cliIndexPath = fs.existsSync(cliJsPath) ? cliJsPath : cliTsPath;

export function createMcpServer(): Server {
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
                description:
                  'Absolute or relative path to the input .svg file.',
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
                description:
                  'Frames per second (e.g. 24, 30, 60). Default: 60.',
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

      const command = cliIndexPath.endsWith('.ts') ? 'npx' : process.execPath;
      const cliArgs: string[] = cliIndexPath.endsWith('.ts')
        ? ['tsx', cliIndexPath, targetSvgPath, fps, outDir, '--json', '--force']
        : [cliIndexPath, targetSvgPath, fps, outDir, '--json', '--force'];

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
        const rawOutput = execFileSync(command, cliArgs, {
          encoding: 'utf-8',
          cwd: process.cwd(),
          env: {
            ...process.env,
            SVG_TO_VIDEO_INTERFACE: 'mcp',
          },
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
          if (parsed.success === true) {
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

  return server;
}

export interface McpConfigOptions {
  transport: 'stdio' | 'http' | 'streamable-http' | 'sse';
  port: number;
  host: string;
}

export function parseMcpOptions(
  args: string[] = process.argv.slice(2)
): McpConfigOptions {
  let transport: 'stdio' | 'http' | 'streamable-http' | 'sse' = 'stdio';

  const envTransport = (process.env.MCP_TRANSPORT || '').toLowerCase();
  if (['http', 'streamable-http', 'sse'].includes(envTransport)) {
    transport = envTransport as 'http' | 'streamable-http' | 'sse';
  }

  let port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  let host = process.env.HOST || '0.0.0.0';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--transport' && args[i + 1]) {
      const val = args[i + 1].toLowerCase();
      if (['stdio', 'http', 'streamable-http', 'sse'].includes(val)) {
        transport = val as 'stdio' | 'http' | 'streamable-http' | 'sse';
      }
      i++;
    } else if (arg.startsWith('--transport=')) {
      const val = arg.split('=')[1]?.toLowerCase();
      if (val && ['stdio', 'http', 'streamable-http', 'sse'].includes(val)) {
        transport = val as 'stdio' | 'http' | 'streamable-http' | 'sse';
      }
    } else if (arg === '--port' && args[i + 1]) {
      port = parseInt(args[i + 1], 10);
      i++;
    } else if (arg.startsWith('--port=')) {
      port = parseInt(arg.split('=')[1], 10);
    } else if (arg === '--host' && args[i + 1]) {
      host = args[i + 1];
      i++;
    } else if (arg.startsWith('--host=')) {
      host = arg.split('=')[1];
    }
  }

  if (isNaN(port)) port = 3000;

  return { transport, port, host };
}

async function startHttpServer(port: number, host: string): Promise<void> {
  const app = express();

  // Health check endpoint for cloud platforms (Glama, Railway, Render, Docker)
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      name: 'svg-to-video',
      version: pkg.version,
    });
  });

  app.get('/', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      name: 'svg-to-video',
      version: pkg.version,
      mcpEndpoint: '/mcp',
      sseEndpoint: '/sse',
    });
  });

  // Streamable HTTP transport endpoint
  app.all('/mcp', async (req: Request, res: Response) => {
    const mcpServer = createMcpServer();
    const streamableTransport = new StreamableHTTPServerTransport();
    await mcpServer.connect(streamableTransport);
    await streamableTransport.handleRequest(req, res);
  });

  // SSE Transport setup
  const sseTransports = new Map<string, SSEServerTransport>();

  app.get('/sse', async (req: Request, res: Response) => {
    const sseTransport = new SSEServerTransport('/messages', res);
    sseTransports.set(sseTransport.sessionId, sseTransport);
    sseTransport.onclose = () => {
      sseTransports.delete(sseTransport.sessionId);
    };
    const sseServer = createMcpServer();
    await sseServer.connect(sseTransport);
  });

  app.post('/messages', express.json(), async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport = sseTransports.get(sessionId);
    if (!transport) {
      res.status(400).send(`Session not found: ${sessionId}`);
      return;
    }
    await transport.handlePostMessage(req, res, req.body);
  });

  return new Promise((resolve) => {
    app.listen(port, host, () => {
      console.error(
        `MCP Server listening on http://${host}:${port} (Streamable HTTP: /mcp, SSE: /sse)`
      );
      resolve();
    });
  });
}

export async function runMcp(): Promise<void> {
  const config = parseMcpOptions();

  if (config.transport === 'stdio') {
    const server = createMcpServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } else {
    await startHttpServer(config.port, config.host);
  }
}

const entryFile = process.argv[1] ? path.resolve(process.argv[1]) : '';
const currentFile = fileURLToPath(import.meta.url);

const isDirectExecution =
  entryFile &&
  (entryFile === currentFile ||
    entryFile.endsWith('/mcp.ts') ||
    entryFile.endsWith('/mcp.js') ||
    entryFile.endsWith('svg-to-video-mcp'));

if (isDirectExecution) {
  runMcp().catch((err) => {
    console.error('Fatal MCP Server Error:', err);
    process.exit(1);
  });
}
