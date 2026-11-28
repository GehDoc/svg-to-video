import { useState, useRef, useEffect } from 'react';
import {
  FaTerminal,
  FaRobot,
  FaQuestionCircle,
  FaLayerGroup,
  FaCogs,
  FaShieldAlt,
  FaHeart,
  FaCheck,
  FaCopy,
  FaCompass,
} from 'react-icons/fa';
import seoData from '../data/seoDocumentation.json';
import pkg from '../../package.json';
import { ECOSYSTEM_LINKS } from '../utils/constants';
import { trackEvent } from '../utils/analytics';
import { DevCard } from './DevCard/DevCard';
import { StickyHeader } from './StickyHeader/StickyHeader';
import { StarButton } from './StarButton';
import './SeoContent.scss';

export const SeoContent = () => {
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const promptTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyPrompt = async (promptText: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      setIsPromptCopied(true);
      if (promptTimeoutRef.current) {
        clearTimeout(promptTimeoutRef.current);
      }
      promptTimeoutRef.current = setTimeout(() => {
        setIsPromptCopied(false);
      }, 2000);
    } catch {
      // fallback
    }
  };
  return (
    <section
      className="seo-content"
      aria-label="Comprehensive Documentation and Format Guide"
    >
      <div className="seo-container">
        {/* Key Features Grid */}
        <section
          id="why-svg-to-video"
          className="seo-block"
          aria-labelledby="why-title"
        >
          <StickyHeader className="block-header">
            <FaShieldAlt className="block-icon" />
            <h2 id="why-title">Why Use SVG to Video?</h2>
          </StickyHeader>
          <div className="features-grid">
            {seoData.features.map((feat) => (
              <article key={feat.title} className="feature-item">
                <h3>{feat.title}</h3>
                <p dangerouslySetInnerHTML={{ __html: feat.descriptionHtml }} />
              </article>
            ))}
          </div>
        </section>

        {/* How It Works / 3-Step Guide */}
        <section
          id="how-to-convert"
          className="seo-block"
          aria-labelledby="how-title"
        >
          <StickyHeader className="block-header">
            <FaCogs className="block-icon" />
            <h2 id="how-title">
              How to Convert Animated SVGs (CSS &amp; SMIL)
            </h2>
          </StickyHeader>
          <ol className="steps-container">
            {seoData.quickStartSteps.map((stepHtml, index) => (
              <li key={index} className="step-card">
                <span className="step-num" aria-hidden="true">
                  {index + 1}
                </span>
                <p
                  className="step-text"
                  dangerouslySetInnerHTML={{ __html: stepHtml }}
                />
              </li>
            ))}
          </ol>
        </section>

        {/* Format Comparison Table */}
        <section
          id="formats"
          className="seo-block"
          aria-labelledby="formats-title"
        >
          <StickyHeader className="block-header">
            <FaLayerGroup className="block-icon" />
            <h2 id="formats-title">
              Supported Output Formats &amp; Specifications
            </h2>
          </StickyHeader>
          <div className="table-responsive">
            <table className="format-table">
              <thead>
                <tr>
                  <th>Format</th>
                  <th>Codec / Standard</th>
                  <th>Alpha Transparency</th>
                  <th>Best Used For</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {seoData.formatComparisons.map((item) => (
                  <tr key={item.format}>
                    <td>
                      <span
                        className={`format-badge format-${item.format.toLowerCase()}`}
                      >
                        {item.format}
                      </span>
                    </td>
                    <td>
                      <code>{item.codec}</code>
                    </td>
                    <td>
                      <span
                        className={
                          item.transparency.startsWith('Yes')
                            ? 'status-yes'
                            : 'status-no'
                        }
                      >
                        {item.transparency}
                      </span>
                    </td>
                    <td>{item.bestFor}</td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CLI & MCP Developer Integration */}
        <section
          id="automation"
          className="seo-block"
          aria-labelledby="automation-title"
        >
          <StickyHeader className="block-header">
            <FaTerminal className="block-icon" />
            <h2 id="automation-title">
              Developer CLI, Docker &amp; Model Context Protocol (MCP)
            </h2>
          </StickyHeader>

          <div className="automation-sections">
            {/* Sub-section 1: CLI & Docker Automation */}
            <div className="automation-subblock">
              <StickyHeader className="automation-subblock__header">
                <FaTerminal className="subblock-icon" />
                <h3>CLI &amp; Docker Automation</h3>
              </StickyHeader>

              {seoData.cliSection?.descriptionHtml && (
                <div
                  className="automation-description"
                  dangerouslySetInnerHTML={{
                    __html: seoData.cliSection.descriptionHtml,
                  }}
                />
              )}

              {seoData.cliSection?.prerequisitesHtml && (
                <div
                  className="automation-prereq"
                  dangerouslySetInnerHTML={{
                    __html: seoData.cliSection.prerequisitesHtml,
                  }}
                />
              )}

              {seoData.cliSection?.commands &&
              seoData.cliSection.commands.length > 0 ? (
                <DevCard
                  tabs={seoData.cliSection.commands.map((cmd) => ({
                    id: cmd.id,
                    label: cmd.label,
                    snippet: cmd.command,
                    language: 'bash',
                    snippetAriaLabel: `${cmd.label}: ${cmd.comment}`,
                    copyAriaLabel: `Copy ${cmd.label} command`,
                  }))}
                />
              ) : (
                <DevCard
                  title="CLI &amp; Docker Automation"
                  icon={<FaTerminal />}
                  snippet={seoData.cliSnippet}
                  snippetAriaLabel="CLI & Docker automation commands"
                  copyAriaLabel="Copy CLI snippet"
                />
              )}

              <div className="automation-docs-link">
                <a
                  href={ECOSYSTEM_LINKS.cliDocs}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View full CLI reference (all flags &amp; options) &rarr;
                </a>
              </div>
            </div>

            {/* Sub-section 2: AI Agent & MCP Integration */}
            <div className="automation-subblock">
              <StickyHeader className="automation-subblock__header">
                <FaRobot className="subblock-icon" />
                <h3>AI Agent &amp; MCP Integration</h3>
              </StickyHeader>

              {seoData.mcpSection?.descriptionHtml && (
                <div
                  className="automation-description"
                  dangerouslySetInnerHTML={{
                    __html: seoData.mcpSection.descriptionHtml,
                  }}
                />
              )}

              <div className="mcp-steps">
                <div className="mcp-step">
                  <span className="mcp-step__label">
                    1. Add to MCP Server Configuration
                  </span>
                  <DevCard
                    title="MCP Server Configuration"
                    icon={<FaRobot />}
                    snippet={
                      seoData.mcpSection?.configSnippet || seoData.mcpSnippet
                    }
                    language="json"
                    snippetAriaLabel="MCP server configuration JSON"
                    copyAriaLabel="Copy MCP configuration"
                  />
                </div>

                {seoData.mcpSection?.promptQuery && (
                  <div className="mcp-step">
                    <span className="mcp-step__label">
                      2. Prompt your AI Assistant
                    </span>
                    <div className="agent-query-box">
                      <blockquote className="agent-query-text">
                        &ldquo;{seoData.mcpSection.promptQuery}&rdquo;
                      </blockquote>
                      <button
                        type="button"
                        className="copy-prompt-btn"
                        onClick={() =>
                          handleCopyPrompt(seoData.mcpSection.promptQuery)
                        }
                        aria-label="Copy prompt"
                        title="Copy prompt"
                      >
                        {isPromptCopied ? (
                          <>
                            <FaCheck size={11} /> Copied!
                          </>
                        ) : (
                          <>
                            <FaCopy size={11} /> Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="automation-docs-link">
                <a
                  href={ECOSYSTEM_LINKS.mcpGuide}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View full MCP setup &amp; schema guide &rarr;
                </a>
              </div>
            </div>

            {/* Sub-section 3: Interactive MCP Playgrounds */}
            <div className="automation-subblock">
              <StickyHeader className="automation-subblock__header">
                <FaCompass className="subblock-icon" />
                <h3>Interactive MCP Playgrounds</h3>
              </StickyHeader>

              {seoData.mcpPlaygroundsSection?.descriptionHtml && (
                <div
                  className="automation-description"
                  dangerouslySetInnerHTML={{
                    __html: seoData.mcpPlaygroundsSection.descriptionHtml,
                  }}
                />
              )}

              {seoData.mcpPlaygroundsSection?.playgrounds && (
                <div className="playgrounds-grid">
                  {seoData.mcpPlaygroundsSection.playgrounds.map((item) => (
                    <div key={item.id} className="playground-card">
                      <div className="playground-card__header">
                        <span className="playground-card__badge">
                          {item.badge}
                        </span>
                        <h4>{item.name}</h4>
                      </div>
                      <p className="playground-card__desc">
                        {item.description}
                      </p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="playground-card__link"
                      >
                        Open {item.name} &rarr;
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="seo-block" aria-labelledby="faq-title">
          <StickyHeader className="block-header">
            <FaQuestionCircle className="block-icon" />
            <h2 id="faq-title">Frequently Asked Questions</h2>
          </StickyHeader>
          <div className="faq-sections">
            {seoData.faqCategories && seoData.faqCategories.length > 0 ? (
              seoData.faqCategories.map((group) => (
                <div key={group.category} className="faq-category-block">
                  <StickyHeader as="h3" className="faq-category-title">
                    {group.category}
                  </StickyHeader>
                  <div className="faq-grid">
                    {group.items.map((item) => (
                      <article key={item.question} className="faq-item">
                        <h4>{item.question}</h4>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: item.answerHtml,
                          }}
                        />
                      </article>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="faq-grid">
                {seoData.faq.map((item) => (
                  <article key={item.question} className="faq-item">
                    <h4>{item.question}</h4>
                    <p dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Support & Community Section */}
        <section
          id="support"
          className="seo-block support-section"
          aria-labelledby="support-title"
        >
          {/* Backward compatibility anchor for existing #sponsor links */}
          <span id="sponsor" className="anchor-alias" aria-hidden="true" />
          <StickyHeader className="block-header">
            <FaHeart className="block-icon support-icon" />
            <h2 id="support-title">
              Support SVG to Video &amp; Star on GitHub
            </h2>
          </StickyHeader>
          <div className="support-cards-grid">
            <div className="support-card star-card">
              <h3>Star on GitHub</h3>
              <p className="support-text">
                If you find SVG to Video helpful, give it a star on GitHub! It
                helps other developers discover the tool and motivates continued
                development.
              </p>
              <div className="support-action">
                <StarButton size="medium" location="seo-content" />
              </div>
            </div>

            <div className="support-card sponsor-card">
              <h3>Sponsor Development</h3>
              <p className="support-text">
                SVG to Video is 100% free, open source, and released under the
                MIT License. It runs entirely in your browser without tracking
                or data collection. Your sponsorship directly fuels development,
                helps maintain cross-browser format support, and keeps this tool
                accessible to creators worldwide.
              </p>
              <div className="support-action">
                <a
                  href={pkg.funding.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sponsor-action-btn"
                  onClick={() => {
                    trackEvent('click-sponsor', { location: 'seo-content' });
                  }}
                >
                  <FaHeart className="icon-heart" /> Sponsor me on GitHub ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};
