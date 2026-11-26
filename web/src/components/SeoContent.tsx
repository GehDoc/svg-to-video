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
} from 'react-icons/fa';
import seoData from '../data/seoDocumentation.json';
import pkg from '../../package.json';
import { ECOSYSTEM_LINKS } from '../utils/constants';
import { trackEvent } from '../utils/analytics';
import { DevCard } from './DevCard/DevCard';
import { StickyHeader } from './StickyHeader/StickyHeader';
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
            <h3 id="why-title">Why Use SVG to Video?</h3>
          </StickyHeader>
          <div className="features-grid">
            {seoData.features.map((feat) => (
              <article key={feat.title} className="feature-item">
                <h4>{feat.title}</h4>
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
            <h3 id="how-title">
              How to Convert Animated SVGs (CSS &amp; SMIL)
            </h3>
          </StickyHeader>
          <div className="steps-container">
            {seoData.quickStartSteps.map((stepHtml, index) => (
              <div key={index} className="step-card">
                <span className="step-num">{index + 1}</span>
                <p
                  className="step-text"
                  dangerouslySetInnerHTML={{ __html: stepHtml }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Format Comparison Table */}
        <section
          id="formats"
          className="seo-block"
          aria-labelledby="formats-title"
        >
          <StickyHeader className="block-header">
            <FaLayerGroup className="block-icon" />
            <h3 id="formats-title">
              Supported Output Formats &amp; Specifications
            </h3>
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
            <h3 id="automation-title">
              Developer CLI, Docker &amp; Model Context Protocol (MCP)
            </h3>
          </StickyHeader>

          <div className="automation-sections">
            {/* Sub-section 1: CLI & Docker Automation */}
            <div className="automation-subblock">
              <StickyHeader className="automation-subblock__header">
                <FaTerminal className="subblock-icon" />
                <h4>CLI &amp; Docker Automation</h4>
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
                <h4>AI Agent &amp; MCP Integration</h4>
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
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="seo-block" aria-labelledby="faq-title">
          <StickyHeader className="block-header">
            <FaQuestionCircle className="block-icon" />
            <h3 id="faq-title">Frequently Asked Questions</h3>
          </StickyHeader>
          <div className="faq-sections">
            {seoData.faqCategories && seoData.faqCategories.length > 0 ? (
              seoData.faqCategories.map((group) => (
                <div key={group.category} className="faq-category-block">
                  <StickyHeader as="h4" className="faq-category-title">
                    {group.category}
                  </StickyHeader>
                  <div className="faq-grid">
                    {group.items.map((item) => (
                      <article key={item.question} className="faq-item">
                        <h5>{item.question}</h5>
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

        {/* Support & Sponsorship Section */}
        <section
          id="sponsor"
          className="seo-block sponsor-section"
          aria-labelledby="sponsor-title"
        >
          <StickyHeader className="block-header">
            <FaHeart className="block-icon sponsor-icon" />
            <h3 id="sponsor-title">Support SVG to Video</h3>
          </StickyHeader>
          <div className="sponsor-card">
            <p className="sponsor-text">
              SVG to Video is 100% free, open source, and released under the MIT
              License. It runs entirely in your browser without tracking or data
              collection. Your sponsorship directly fuels development, helps
              maintain cross-browser format support, and keeps this tool
              accessible to creators and developers worldwide.
            </p>
            <a
              href={pkg.funding.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sponsor-action-btn"
              onClick={() => {
                trackEvent('click-sponsor', { location: 'seo-content' });
              }}
            >
              <FaHeart className="icon-heart" /> Sponsor on GitHub ↗
            </a>
          </div>
        </section>
      </div>
    </section>
  );
};
