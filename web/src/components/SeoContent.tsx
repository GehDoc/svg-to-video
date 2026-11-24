import {
  FaTerminal,
  FaRobot,
  FaQuestionCircle,
  FaLayerGroup,
  FaCogs,
  FaShieldAlt,
  FaHeart,
} from 'react-icons/fa';
import seoData from '../data/seoDocumentation.json';
import pkg from '../../package.json';
import { trackEvent } from '../utils/analytics';
import { DevCard } from './DevCard/DevCard';
import './SeoContent.scss';

export const SeoContent = () => {
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
          <div className="block-header">
            <FaShieldAlt className="block-icon" />
            <h3 id="why-title">Why Use SVG to Video?</h3>
          </div>
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
          <div className="block-header">
            <FaCogs className="block-icon" />
            <h3 id="how-title">
              How to Convert Animated SVGs (CSS &amp; SMIL)
            </h3>
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
        </section>

        {/* Format Comparison Table */}
        <section
          id="formats"
          className="seo-block"
          aria-labelledby="formats-title"
        >
          <div className="block-header">
            <FaLayerGroup className="block-icon" />
            <h3 id="formats-title">
              Supported Output Formats &amp; Specifications
            </h3>
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
        </section>

        {/* CLI & MCP Developer Integration */}
        <section
          id="automation"
          className="seo-block"
          aria-labelledby="automation-title"
        >
          <div className="block-header">
            <FaTerminal className="block-icon" />
            <h3 id="automation-title">
              Developer CLI, Docker &amp; Model Context Protocol (MCP)
            </h3>
          </div>
          <div className="developer-grid">
            <DevCard
              title="CLI &amp; Docker Automation"
              icon={<FaTerminal />}
              snippet={seoData.cliSnippet}
              snippetAriaLabel="CLI & Docker automation commands"
              copyAriaLabel="Copy CLI snippet"
            />
            <DevCard
              title="AI Agent &amp; MCP Integration"
              icon={<FaRobot />}
              snippet={seoData.mcpSnippet}
              snippetAriaLabel="MCP server configuration JSON"
              copyAriaLabel="Copy MCP config"
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="seo-block" aria-labelledby="faq-title">
          <div className="block-header">
            <FaQuestionCircle className="block-icon" />
            <h3 id="faq-title">Frequently Asked Questions</h3>
          </div>
          <div className="faq-grid">
            {seoData.faq.map((item) => (
              <article key={item.question} className="faq-item">
                <h4>{item.question}</h4>
                <p dangerouslySetInnerHTML={{ __html: item.answerHtml }} />
              </article>
            ))}
          </div>
        </section>

        {/* Support & Sponsorship Section */}
        <section
          id="sponsor"
          className="seo-block sponsor-section"
          aria-labelledby="sponsor-title"
        >
          <div className="block-header">
            <FaHeart className="block-icon sponsor-icon" />
            <h3 id="sponsor-title">Support SVG to Video</h3>
          </div>
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
