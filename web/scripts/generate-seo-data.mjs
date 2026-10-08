import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readmePath = path.resolve(__dirname, '../../README.md');
const outputPath = path.resolve(__dirname, '../src/data/seoDocumentation.json');

function extractSection(markdown, startHeading, endHeadingPattern) {
  const startIndex = markdown.indexOf(startHeading);
  if (startIndex === -1) return '';
  const contentStart = startIndex + startHeading.length;
  const remaining = markdown.slice(contentStart);
  const match = remaining.match(endHeadingPattern);
  if (match && match.index !== undefined) {
    return remaining.slice(0, match.index).trim();
  }
  return remaining.trim();
}

function parseWhySection(whyText) {
  const items = [];
  const lines = whyText.split('\n');
  for (const line of lines) {
    const match = line.match(/^-\s+\*\*([^*]+)\*\*:\s+(.+)$/);
    if (match) {
      items.push({
        title: match[1].trim(),
        description: match[2].trim(),
      });
    }
  }
  return items;
}

function parseQuickStart(webStudioText) {
  const steps = [];
  const lines = webStudioText.split('\n');
  let inSteps = false;
  for (const line of lines) {
    if (line.includes('### Quick Start')) {
      inSteps = true;
      continue;
    }
    if (inSteps) {
      const match = line.match(/^\d+\.\s+(.+)$/);
      if (match) {
        steps.push(match[1].trim());
      } else if (line.startsWith('---') || line.startsWith('##')) {
        break;
      }
    }
  }
  return steps;
}

function parseCliCommands(cliText) {
  const codeBlockMatch = cliText.match(/```bash([\s\S]*?)```/);
  if (!codeBlockMatch) return '';
  return codeBlockMatch[1].trim();
}

function parseMcpConfig(mcpText) {
  const jsonBlockMatch = mcpText.match(/```json([\s\S]*?)```/);
  return jsonBlockMatch ? jsonBlockMatch[1].trim() : '';
}

try {
  const readme = fs.readFileSync(readmePath, 'utf8');

  const whyText = extractSection(readme, '## 🌟 Why SVG to Video?', /\n##\s+/);
  const webStudioText = extractSection(readme, '## 🌐 Web Studio', /\n##\s+/);
  const cliText = extractSection(readme, '## 🚀 CLI / Docker Tool', /\n##\s+/);
  const mcpText = extractSection(
    readme,
    '## 🤖 AI Agent & MCP Integration',
    /\n##\s+/
  );

  const features = parseWhySection(whyText);
  const quickStartSteps = parseQuickStart(webStudioText);
  const cliSnippet = parseCliCommands(cliText);
  const mcpSnippet = parseMcpConfig(mcpText);

  const seoData = {
    headline: 'High-Fidelity SVG Animation to Video & Animated Image Studio',
    tagline:
      'Transform CSS-animated SVGs into MP4, WebM, MKV, MOV, aPNG, or GIF with full alpha-channel transparency directly in your browser or via CLI/MCP.',
    features,
    quickStartSteps,
    cliSnippet,
    mcpSnippet,
    formatComparisons: [
      {
        format: 'MP4',
        codec: 'H.264 / AAC',
        transparency: 'No (Opaque)',
        bestFor:
          'Universal web playback, social media, video editors (Premiere, Final Cut)',
        description:
          'Standard baseline container compatible with all browsers and video players.',
      },
      {
        format: 'WebM',
        codec: 'VP9 / AV1',
        transparency: 'Yes (Full Alpha Channel)',
        bestFor: 'Web overlays, OBS streaming, transparent video backgrounds',
        description:
          'Modern open web format with native 8-bit alpha transparency and high compression efficiency.',
      },
      {
        format: 'aPNG',
        codec: 'RGBA PNG',
        transparency: 'Yes (Full Alpha Channel)',
        bestFor:
          'Documentation, GitHub READMEs, high-color animations, crisp text rendering',
        description:
          'Animated PNG with 24-bit color depth and full 8-bit alpha blending without color quantization.',
      },
      {
        format: 'GIF',
        codec: 'GIF89a',
        transparency: 'Yes (Indexed 1-bit)',
        bestFor:
          'Slack, Discord, legacy documentation, universal messaging apps',
        description:
          'Standard animated GIF with palette quantization and optional transparent color index.',
      },
    ],
    faq: [
      {
        question: 'Are my SVG files uploaded to any external server?',
        answer:
          'No. The Web Studio runs 100% client-side inside your browser using WebCodecs and the Web Animations API. Your SVG source code and exported video frames never leave your local device.',
      },
      {
        question: 'How does the Web Animations API frame scrubbing work?',
        answer:
          'The engine mounts your SVG in an isolated offscreen canvas, programmatically pauses all CSS and SMIL animations, and advances the animation timeline frame by frame (e.g. at 24, 30, or 60 FPS) to guarantee 100% frame accuracy without skipped frames.',
      },
      {
        question: 'Can I automate conversions in CI/CD pipelines or AI agents?',
        answer:
          'Yes! You can use the official CLI tool (npx -y @gehdoc/svg-to-video), the Docker image (gehdoc/svg-to-video), or connect to the Model Context Protocol (MCP) server for Claude Desktop, Cursor, and Antigravity.',
      },
      {
        question:
          'How do I preserve transparent backgrounds in exported videos?',
        answer:
          'Select WebM, aPNG, or GIF as your output format, check the "Transparent Background" toggle, and ensure your SVG root element does not declare an opaque background rect.',
      },
    ],
    lastUpdated: new Date().toISOString(),
  };

  fs.writeFileSync(outputPath, JSON.stringify(seoData, null, 2), 'utf8');
  console.log(`[SEO Data Extractor] Successfully generated ${outputPath}`);
} catch (error) {
  console.error('[SEO Data Extractor] Error generating SEO data:', error);
  process.exit(1);
}
