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
const outputPath = path.resolve(webDir, 'src/data/seoDocumentation.json');
interface FaqEntry {
  category?: string;
  question: string;
  answerHtml: string;
}

interface FaqCategory {
  category: string;
  items: FaqEntry[];
}

interface CliCommandItem {
  id: string;
  label: string;
  comment: string;
  command: string;
}

interface CliSectionData {
  descriptionHtml: string;
  prerequisitesHtml: string;
  commands: CliCommandItem[];
  rawSnippet: string;
}

interface McpSectionData {
  descriptionHtml: string;
  configSnippet: string;
  promptQuery: string;
}

interface McpPlaygroundItem {
  id: string;
  name: string;
  badge: string;
  url: string;
  description: string;
}

interface McpPlaygroundsSectionData {
  title: string;
  descriptionHtml: string;
  playgrounds: McpPlaygroundItem[];
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

function parseCliSection(cliText: string): CliSectionData {
  const quickStartIdx = cliText.indexOf('### Quick Start');
  let descriptionHtml = '';
  let prereqHtml = '';

  if (quickStartIdx !== -1) {
    descriptionHtml = marked.parse(
      cliText.slice(0, quickStartIdx).trim()
    ) as string;
    const afterQuickStart = cliText.slice(
      quickStartIdx + '### Quick Start'.length
    );
    const codeBlockIdx = afterQuickStart.indexOf('```bash');
    if (codeBlockIdx !== -1) {
      prereqHtml = marked.parse(
        afterQuickStart.slice(0, codeBlockIdx).trim()
      ) as string;
    }
  }

  const rawSnippet = parseCliCommands(cliText);
  const commands: CliCommandItem[] = [];

  const pairs = rawSnippet.split(/\n\s*\n/);
  for (let i = 0; i < pairs.length; i++) {
    const block = pairs[i].trim();
    if (!block) continue;
    const lines = block.split('\n').map((l) => l.trim());
    const commentLines = lines
      .filter((l) => l.startsWith('#'))
      .map((l) => l.replace(/^#\s*/, ''));
    const commandLines = lines.filter(
      (l) => !l.startsWith('#') && l.length > 0
    );
    const comment = commentLines.join(' ');
    const command = commandLines.join(' ');

    if (command) {
      let label = comment;
      if (label.toLowerCase().includes('auto-detected')) {
        label = 'Auto-detect Duration';
      } else if (label.toLowerCase().includes('gif output')) {
        label = 'Transparent GIF';
      } else if (label.toLowerCase().includes('custom resolution')) {
        label = 'Custom Resolution';
      } else if (label.toLowerCase().includes('custom bitrate')) {
        label = 'Quality & Bitrate';
      } else if (label.toLowerCase().includes('animated png')) {
        label = 'Animated PNG';
      } else if (label.toLowerCase().includes('docker')) {
        label = 'Docker (Zero Deps)';
      } else if (comment) {
        label = comment.slice(0, 24);
      } else {
        label = `Command ${i + 1}`;
      }

      commands.push({
        id: `cli-cmd-${i + 1}`,
        label,
        comment,
        command,
      });
    }
  }

  return {
    descriptionHtml,
    prerequisitesHtml: prereqHtml,
    commands,
    rawSnippet,
  };
}

function parseMcpSection(mcpText: string): McpSectionData {
  const step1Idx = mcpText.indexOf('1. **Add to');
  const descriptionRaw =
    step1Idx !== -1
      ? mcpText.slice(0, step1Idx).trim()
      : mcpText.split('```')[0].trim();
  const descriptionHtml = marked.parse(descriptionRaw) as string;

  const configSnippet = parseMcpConfig(mcpText);

  const promptMatch = mcpText.match(/>\s*_?["“]([^"”]+)["”]_?/);
  const promptQuery = promptMatch
    ? promptMatch[1].trim()
    : 'Convert examples/example.svg into a 60fps transparent WebM video.';

  return {
    descriptionHtml,
    configSnippet,
    promptQuery,
  };
}

function parseMcpPlaygroundsSection(
  _mcpText: string
): McpPlaygroundsSectionData {
  const playgrounds: McpPlaygroundItem[] = [
    {
      id: 'huggingface',
      name: 'HuggingFace Space Playground',
      badge: 'Interactive Demo',
      url: 'https://huggingface.co/spaces/GehDoc/svg-to-video-mcp',
      description:
        'Test SVG conversions live in an interactive web client with zero local installation.',
    },
    {
      id: 'glama',
      name: 'Glama.ai MCP Playground',
      badge: 'Container Sandbox & Deployment',
      url: 'https://glama.ai/mcp/servers/GehDoc/svg-to-video',
      description:
        'Test, inspect tool schemas, and deploy containerized MCP endpoints directly in your browser.',
    },
  ];

  return {
    title: 'Interactive MCP Playgrounds',
    descriptionHtml:
      '<p>Test and explore the Model Context Protocol (MCP) server directly in your browser without local installation before configuring local agents or Docker containers.</p>',
    playgrounds,
  };
}

/**
 * Parses docs/FAQ.md, supporting categorized sections (## Category)
 * with questions (### Q: or ## Q:) beneath them.
 */
function parseFaq(faqMarkdown: string): {
  faq: FaqEntry[];
  faqCategories: FaqCategory[];
} {
  const faq: FaqEntry[] = [];
  const faqCategories: FaqCategory[] = [];

  const lines = faqMarkdown.split('\n');
  let currentCategory = 'General';
  let currentCategoryItems: FaqEntry[] = [];
  let currentQuestion = '';
  let currentAnswerLines: string[] = [];

  const flushQuestion = () => {
    if (currentQuestion && currentAnswerLines.length > 0) {
      const entry: FaqEntry = {
        category: currentCategory,
        question: currentQuestion,
        answerHtml: marked.parseInline(
          currentAnswerLines.join('\n').trim()
        ) as string,
      };
      faq.push(entry);
      currentCategoryItems.push(entry);
    }
    currentQuestion = '';
    currentAnswerLines = [];
  };

  const flushCategory = () => {
    flushQuestion();
    if (currentCategoryItems.length > 0) {
      faqCategories.push({
        category: currentCategory,
        items: [...currentCategoryItems],
      });
      currentCategoryItems = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // Match Category header: ## Category Name (not ## Q:)
    const categoryMatch = line.match(/^##\s+(?!Q:)(.+)$/);
    if (categoryMatch) {
      flushCategory();
      currentCategory = categoryMatch[1].trim();
      continue;
    }

    // Match Question: ### Q: ... or ## Q: ...
    const questionMatch = line.match(/^#{2,3}\s+Q:\s+(.+)$/);
    if (questionMatch) {
      flushQuestion();
      currentQuestion = questionMatch[1].trim();
      continue;
    }

    // Skip top-level # Frequently Asked Questions header
    if (line.match(/^#\s+/)) {
      continue;
    }

    if (currentQuestion) {
      currentAnswerLines.push(rawLine);
    }
  }

  flushCategory();

  return { faq, faqCategories };
}

try {
  const readme = fs.readFileSync(readmePath, 'utf8');
  const faqMarkdown = fs.readFileSync(faqPath, 'utf8');

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
  const cliSection = parseCliSection(cliText);
  const mcpSection = parseMcpSection(mcpText);
  const mcpPlaygroundsSection = parseMcpPlaygroundsSection(mcpText);
  const { faq, faqCategories } = parseFaq(faqMarkdown);

  const seoData = {
    // UI headline: concise, display-friendly — intentionally NOT sourced from
    // package.json (which contains technical npm descriptions, not UI copy).
    headline: 'High-Fidelity SVG Animation to Video & Animated Image Studio',
    // UI tagline: single sentence, no parenthetical format lists.
    tagline:
      'Transform animated SVGs (CSS & SMIL) into MP4, WebM, MKV, MOV, aPNG, or GIF with full alpha-channel transparency — directly in your browser or via CLI/MCP.',
    features,
    quickStartSteps,
    cliSnippet,
    mcpSnippet,
    cliSection,
    mcpSection,
    mcpPlaygroundsSection,
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
    faqCategories,
    lastUpdated: new Date().toISOString(),
  };

  if (fs.existsSync(outputPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
      const { lastUpdated: _currentDate, ...currentData } = seoData;
      const { lastUpdated: _existingDate, ...existingData } = existing;
      if (JSON.stringify(currentData) === JSON.stringify(existingData)) {
        console.log(
          `[SEO Data Extractor] Content unchanged; skipping write for ${outputPath}`
        );
        process.exit(0);
      }
    } catch {
      // If reading/parsing fails, proceed to rewrite below
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(seoData, null, 2) + '\n', 'utf8');
  console.log(`[SEO Data Extractor] Successfully generated ${outputPath}`);
} catch (error) {
  console.error('[SEO Data Extractor] Error generating SEO data:', error);
  process.exit(1);
}
