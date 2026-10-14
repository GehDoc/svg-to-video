import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '../..');
const webDir = path.resolve(__dirname, '..');

const readmePath = path.resolve(rootDir, 'README.md');
const faqPath = path.resolve(rootDir, 'docs/FAQ.md');
const rootPkgPath = path.resolve(rootDir, 'package.json');
const webPkgPath = path.resolve(webDir, 'package.json');
const outputPath = path.resolve(webDir, 'src/data/seoDocumentation.json');

interface PackageJson {
  description: string;
  [key: string]: unknown;
}

interface FaqEntry {
  question: string;
  answerHtml: string;
}

interface WhyItem {
  title: string;
  descriptionHtml: string;
}

function extractSection(
  markdown: string,
  startHeading: string,
  endHeadingPattern: RegExp
): string {
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

function parseWhySection(whyText: string): WhyItem[] {
  const items: WhyItem[] = [];
  const lines = whyText.split('\n');
  for (const line of lines) {
    const match = line.match(/^-\s+\*\*([^*]+)\*\*:\s+(.+)$/);
    if (match) {
      items.push({
        title: match[1].trim(),
        descriptionHtml: marked.parseInline(match[2].trim()) as string,
      });
    }
  }
  return items;
}

function parseQuickStart(webStudioText: string): string[] {
  const steps: string[] = [];
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
        steps.push(marked.parseInline(match[1].trim()) as string);
      } else if (line.startsWith('---') || line.startsWith('##')) {
        break;
      }
    }
  }
  return steps;
}

function parseCliCommands(cliText: string): string {
  const codeBlockMatch = cliText.match(/```bash([\s\S]*?)```/);
  if (!codeBlockMatch) return '';
  return codeBlockMatch[1].trim();
}

function parseMcpConfig(mcpText: string): string {
  const jsonBlockMatch = mcpText.match(/```json([\s\S]*?)```/);
  return jsonBlockMatch ? jsonBlockMatch[1].trim() : '';
}

/**
 * Parses docs/FAQ.md, which uses the convention:
 *   ## Q: <question text>
 *   <blank line>
 *   <answer paragraph(s)>
 */
function parseFaq(faqMarkdown: string): FaqEntry[] {
  const entries: FaqEntry[] = [];
  // Split on level-2 headings that start with "Q:"
  const blocks = faqMarkdown.split(/\n(?=## Q:)/);
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    const headingLine = lines[0];
    const questionMatch = headingLine.match(/^## Q:\s+(.+)$/);
    if (!questionMatch) continue;
    const question = questionMatch[1].trim();
    const answerRaw = lines.slice(1).join('\n').trim();
    entries.push({
      question,
      answerHtml: marked.parseInline(answerRaw) as string,
    });
  }
  return entries;
}

try {
  const readme = fs.readFileSync(readmePath, 'utf8');
  const faqMarkdown = fs.readFileSync(faqPath, 'utf8');
  const rootPkg = JSON.parse(
    fs.readFileSync(rootPkgPath, 'utf8')
  ) as PackageJson;
  const webPkg = JSON.parse(fs.readFileSync(webPkgPath, 'utf8')) as PackageJson;

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
  const faq = parseFaq(faqMarkdown);

  const seoData = {
    // Sourced from web/package.json description (web-studio-scoped copy)
    headline: webPkg.description,
    // Sourced from root package.json description (full-project copy)
    tagline: rootPkg.description,
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
    faq,
    lastUpdated: new Date().toISOString(),
  };

  fs.writeFileSync(outputPath, JSON.stringify(seoData, null, 2) + '\n', 'utf8');
  console.log(`[SEO Data Extractor] Successfully generated ${outputPath}`);
} catch (error) {
  console.error('[SEO Data Extractor] Error generating SEO data:', error);
  process.exit(1);
}
