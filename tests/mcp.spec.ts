import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const outputDir = path.resolve('out-dir-mcp-test');
const exampleSvg = path.resolve('examples/example.svg');

describe('MCP Server Integration', () => {
  let client: Client;
  let transport: StdioClientTransport;

  before(async () => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    transport = new StdioClientTransport({
      command: 'npx',
      args: ['tsx', 'src/mcp.ts'],
    });

    client = new Client(
      {
        name: 'test-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );

    await client.connect(transport);
  });

  after(async () => {
    if (client) {
      await client.close();
    }
    if (fs.existsSync(outputDir)) {
      fs.rmSync(outputDir, { recursive: true, force: true });
    }
  });

  test('should list MCP tools', async () => {
    const response = await client.listTools();
    const toolNames = response.tools.map((t) => t.name);
    assert.ok(toolNames.includes('render_svg_to_video'));
    assert.ok(toolNames.includes('inspect_svg_animation'));
  });

  test('should inspect SVG animation via inspect_svg_animation', async () => {
    const result = await client.callTool({
      name: 'inspect_svg_animation',
      arguments: {
        svgFilePath: exampleSvg,
      },
    });

    assert.strictEqual(result.isError, undefined);
    assert.ok(Array.isArray(result.content));
    const contentText = result.content[0] as { type: string; text: string };
    assert.strictEqual(contentText.type, 'text');

    const data = JSON.parse(contentText.text);
    assert.strictEqual(typeof data.hasAnimation, 'boolean');
  });

  test('should render SVG via render_svg_to_video tool', async () => {
    const result = await client.callTool({
      name: 'render_svg_to_video',
      arguments: {
        svgFilePath: exampleSvg,
        outDir: outputDir,
        fps: 24,
        duration: 1,
        format: 'gif',
      },
    });

    assert.strictEqual(result.isError, undefined);
    assert.ok(Array.isArray(result.content));
    const contentText = result.content[0] as { type: string; text: string };
    assert.strictEqual(contentText.type, 'text');

    const data = JSON.parse(contentText.text);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.format, 'gif');
    assert.ok(fs.existsSync(data.outputFile));
  });
});
