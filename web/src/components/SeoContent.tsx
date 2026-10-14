import {
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
import { DevCard } from './DevCard/DevCard';
import './SeoContent.scss';

export const SeoContent = () => {
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
                <p dangerouslySetInnerHTML={{ __html: feat.descriptionHtml }} />
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
            <DevCard
              title="CLI & Docker Automation"
              icon={<FaTerminal />}
              snippet={seoData.cliSnippet}
              snippetAriaLabel="CLI & Docker automation commands"
              copyAriaLabel="Copy CLI snippet"
            />
            <DevCard
              title="AI Agent & MCP Integration"
              icon={<FaRobot />}
              snippet={seoData.mcpSnippet}
              snippetAriaLabel="MCP server configuration JSON"
              copyAriaLabel="Copy MCP config"
            />
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
                <p dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
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
