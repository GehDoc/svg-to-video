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

describe('mcp.json Manifest Contract Verification', () => {
  const mcpPath = path.resolve('mcp.json');
  const pkgPath = path.resolve('package.json');

  test('mcp.json should exist and be valid JSON compliant with MCP registry contract', () => {
    assert.ok(fs.existsSync(mcpPath), 'mcp.json manifest file must exist');
    assert.ok(fs.existsSync(pkgPath), 'package.json file must exist');

    const mcpContent = fs.readFileSync(mcpPath, 'utf-8');
    const pkgContent = fs.readFileSync(pkgPath, 'utf-8');

    const mcp = JSON.parse(mcpContent);
    const pkg = JSON.parse(pkgContent);

    // 1. Schema & Name
    assert.ok(
      typeof mcp.$schema === 'string' && mcp.$schema.startsWith('https://'),
      '$schema must be a valid HTTPS URI'
    );
    assert.strictEqual(
      mcp.name,
      pkg.mcpName,
      'mcp.json name must match package.json mcpName'
    );
    assert.match(
      mcp.name,
      /^[a-zA-Z0-9.-]+\/[a-zA-Z0-9._-]+$/,
      'mcp.json name must be in reverse-DNS format'
    );

    // 2. Title & Description
    assert.ok(
      typeof mcp.title === 'string' && mcp.title.length > 0,
      'title must be a non-empty string'
    );
    assert.ok(
      typeof mcp.description === 'string' && mcp.description.length > 0,
      'description must be a non-empty string'
    );
    assert.ok(
      mcp.description.length <= 100,
      `description must be strictly <= 100 characters according to MCP registry rules (current: ${mcp.description.length})`
    );

    // 3. Versioning sync
    assert.strictEqual(
      mcp.version,
      pkg.version,
      'mcp.version must match root package.json version'
    );

    // 4. Website & Repository Metadata
    assert.strictEqual(
      mcp.websiteUrl,
      pkg.homepage,
      'mcp.websiteUrl must match package.json homepage'
    );
    assert.ok(
      mcp.repository && typeof mcp.repository === 'object',
      'repository metadata object is required'
    );
    assert.strictEqual(mcp.repository.type, 'git');
    assert.strictEqual(mcp.repository.source, 'github');
    assert.ok(
      typeof mcp.repository.id === 'string' && mcp.repository.id.length > 0,
      'repository.id must be a non-empty string'
    );

    // 5. Icons configuration
    assert.ok(
      Array.isArray(mcp.icons) && mcp.icons.length > 0,
      'icons array must contain at least one icon'
    );
    const allowedMimeTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/svg+xml',
      'image/webp',
    ];
    for (const icon of mcp.icons) {
      assert.ok(
        typeof icon.src === 'string' && icon.src.startsWith('https://'),
        'icon src must be an HTTPS URL'
      );
      assert.ok(
        allowedMimeTypes.includes(icon.mimeType),
        `icon mimeType must be one of: ${allowedMimeTypes.join(', ')}`
      );
      assert.ok(Array.isArray(icon.sizes), 'icon sizes must be an array');
      for (const size of icon.sizes) {
        assert.match(
          size,
          /^(\d+x\d+|any)$/,
          'icon size must follow WxH or "any" format'
        );
      }
    }

    // 6. Package entries & Environment Variables
    assert.ok(
      Array.isArray(mcp.packages) && mcp.packages.length >= 2,
      'packages must define npm and OCI distributions'
    );

    const npmPkg = mcp.packages.find(
      (p: { registryType: string }) => p.registryType === 'npm'
    );
    assert.ok(npmPkg, 'npm package entry must be present');
    assert.strictEqual(npmPkg.identifier, pkg.name);
    assert.strictEqual(
      npmPkg.version,
      pkg.version,
      'npm package version must match package.json version'
    );
    assert.strictEqual(npmPkg.registryBaseUrl, 'https://registry.npmjs.org');
    assert.strictEqual(npmPkg.transport?.type, 'stdio');
    assert.strictEqual(npmPkg.runtimeHint, 'npx');

    const ociPkg = mcp.packages.find(
      (p: { registryType: string }) => p.registryType === 'oci'
    );
    assert.ok(ociPkg, 'oci package entry must be present');
    assert.strictEqual(ociPkg.registryBaseUrl, 'https://docker.io');
    assert.strictEqual(ociPkg.transport?.type, 'stdio');
    assert.strictEqual(ociPkg.runtimeHint, 'docker');

    // Environment variables checks
    const expectedEnvs = [
      'DO_NOT_TRACK',
      'PUPPETEER_EXECUTABLE_PATH',
      'PUPPETEER_ARGS',
    ];
    for (const packageEntry of [npmPkg, ociPkg]) {
      assert.ok(
        Array.isArray(packageEntry.environmentVariables),
        'environmentVariables array must be present'
      );
      const envNames = packageEntry.environmentVariables.map(
        (e: { name: string }) => e.name
      );
      for (const expectedEnv of expectedEnvs) {
        assert.ok(
          envNames.includes(expectedEnv),
          `Package must document environment variable ${expectedEnv}`
        );
      }
      for (const envObj of packageEntry.environmentVariables) {
        assert.ok(
          typeof envObj.name === 'string',
          'env var name must be string'
        );
        assert.ok(
          typeof envObj.description === 'string' &&
            envObj.description.length > 0,
          'env var description must be non-empty'
        );
        assert.ok(
          typeof envObj.isRequired === 'boolean',
          'env var isRequired must be boolean'
        );
        assert.ok(
          ['string', 'number', 'boolean', 'filepath'].includes(envObj.format),
          'env var format must be valid enum'
        );
      }
    }
  });
});
