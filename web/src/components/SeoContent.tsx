import { useState } from 'react';
import {
  FaCheck,
  FaCopy,
  FaTerminal,
  FaRobot,
  FaQuestionCircle,
  FaLayerGroup,
  FaCogs,
  FaShieldAlt,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import seoData from '../data/seoDocumentation.json';
import { ECOSYSTEM_LINKS } from '../utils/constants';
import './SeoContent.scss';

export const SeoContent = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Fallback if clipboard API is not available
    }
  };

  return (
    <section
      className="seo-content"
      aria-label="Comprehensive Documentation and Format Guide"
    >
      <div className="seo-container">
        {/* Header / Intro */}
        <header className="seo-header">
          <span className="seo-badge">Open Source Studio</span>
          <h2>{seoData.headline}</h2>
          <p className="seo-lead">{seoData.tagline}</p>
        </header>

        {/* Key Features Grid */}
        <div className="seo-block">
          <div className="block-header">
            <FaShieldAlt className="block-icon" />
            <h3>Why Use SVG to Video?</h3>
          </div>
          <div className="features-grid">
            {seoData.features.map((feat) => (
              <article key={feat.title} className="feature-item">
                <h4>{feat.title}</h4>
                <p>{feat.description}</p>
              </article>
            ))}
          </div>
        </div>

        {/* How It Works / 3-Step Guide */}
        <div className="seo-block">
          <div className="block-header">
            <FaCogs className="block-icon" />
            <h3>How to Convert CSS-Animated SVGs</h3>
          </div>
          <div className="steps-container">
            {seoData.quickStartSteps.map((step, index) => (
              <div key={step} className="step-card">
                <span className="step-num">{index + 1}</span>
                <p className="step-text">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Format Comparison Table */}
        <div className="seo-block">
          <div className="block-header">
            <FaLayerGroup className="block-icon" />
            <h3>Supported Output Formats & Specifications</h3>
          </div>
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
        </div>

        {/* CLI & MCP Developer Integration */}
        <div className="seo-block">
          <div className="block-header">
            <FaTerminal className="block-icon" />
            <h3>Developer CLI, Docker & Model Context Protocol (MCP)</h3>
          </div>
          <div className="developer-grid">
            <div className="dev-card">
              <div className="dev-card-header">
                <div className="dev-title">
                  <FaTerminal /> CLI & Docker Automation
                </div>
                <button
                  type="button"
                  className="copy-snippet-btn"
                  onClick={() => handleCopy(seoData.cliSnippet, 'cli')}
                  aria-label="Copy CLI snippet"
                >
                  {copiedKey === 'cli' ? (
                    <>
                      <FaCheck size={11} /> Copied
                    </>
                  ) : (
                    <>
                      <FaCopy size={11} /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre
                className="dev-snippet"
                tabIndex={0}
                aria-label="CLI & Docker automation commands"
              >
                <code>{seoData.cliSnippet}</code>
              </pre>
            </div>

            <div className="dev-card">
              <div className="dev-card-header">
                <div className="dev-title">
                  <FaRobot /> AI Agent & MCP Integration
                </div>
                <button
                  type="button"
                  className="copy-snippet-btn"
                  onClick={() => handleCopy(seoData.mcpSnippet, 'mcp')}
                  aria-label="Copy MCP config"
                >
                  {copiedKey === 'mcp' ? (
                    <>
                      <FaCheck size={11} /> Copied
                    </>
                  ) : (
                    <>
                      <FaCopy size={11} /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre
                className="dev-snippet"
                tabIndex={0}
                aria-label="MCP server configuration JSON"
              >
                <code>{seoData.mcpSnippet}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="seo-block">
          <div className="block-header">
            <FaQuestionCircle className="block-icon" />
            <h3>Frequently Asked Questions</h3>
          </div>
          <div className="faq-grid">
            {seoData.faq.map((item) => (
              <article key={item.question} className="faq-item">
                <h4>{item.question}</h4>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Ecosystem Footer Links */}
        <div className="seo-ecosystem">
          <h4>Explore the SVG to Video Ecosystem</h4>
          <div className="ecosystem-links">
            <a
              href={ECOSYSTEM_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository <FaExternalLinkAlt size={10} />
            </a>
            <a
              href={ECOSYSTEM_LINKS.npm}
              target="_blank"
              rel="noopener noreferrer"
            >
              npm Package <FaExternalLinkAlt size={10} />
            </a>
            <a
              href={ECOSYSTEM_LINKS.docker}
              target="_blank"
              rel="noopener noreferrer"
            >
              Docker Hub <FaExternalLinkAlt size={10} />
            </a>
            <a
              href={ECOSYSTEM_LINKS.mcpDocs}
              target="_blank"
              rel="noopener noreferrer"
            >
              MCP Registry <FaExternalLinkAlt size={10} />
            </a>
            <a
              href={ECOSYSTEM_LINKS.huggingface}
              target="_blank"
              rel="noopener noreferrer"
            >
              HuggingFace Space <FaExternalLinkAlt size={10} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
