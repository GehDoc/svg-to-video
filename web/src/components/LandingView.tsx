import { useState } from 'react';
import {
  FaLock,
  FaCheckCircle,
  FaTerminal,
  FaRobot,
  FaCopy,
  FaCheck,
  FaPlay,
} from 'react-icons/fa';
import { SAMPLES, type SamplePreset } from '../utils/samples';
import { Button } from './Button/Button';
import './LandingView.scss';

interface LandingViewProps {
  onSelectSample?: (sample: SamplePreset) => void;
}

export const LandingView = ({ onSelectSample }: LandingViewProps) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'cli' | 'mcp'>('cli');

  const cliCommand =
    'npx -y -p @gehdoc/svg-to-video svg-to-video input.svg 60 ./out-dir --format webm --transparent';
  const mcpCommand = `{\n  "mcpServers": {\n    "svg-to-video": {\n      "command": "npx",\n      "args": ["-y", "-p", "@gehdoc/svg-to-video", "svg-to-video-mcp"]\n    }\n  }\n}`;

  const handleCopy = async (text: string, tab: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch {
      // Fallback if clipboard API is not available
    }
  };

  return (
    <div className="landing-view">
      <div className="landing-scroll-content">
        {/* Welcome Header */}
        <header className="landing-hero">
          <h2 className="landing-title">Welcome to SVG to Video Studio</h2>
          <p className="landing-subtitle">
            Upload your animated SVG on the left, or test the engine instantly
            with one of our sample animations.
          </p>
        </header>

        {/* 1-Click Interactive Sample Cards */}
        <section className="landing-section" aria-label="Interactive Samples">
          <div className="sample-grid">
            {SAMPLES.map((sample) => (
              <div key={sample.id} className="sample-card">
                <div
                  className="sample-preview"
                  dangerouslySetInnerHTML={{ __html: sample.svgContent }}
                  aria-hidden="true"
                />
                <div className="sample-info">
                  <div className="sample-header">
                    <h3 className="sample-name">{sample.name}</h3>
                    <span className="sample-tag">
                      {sample.format.toUpperCase()}
                    </span>
                  </div>
                  <p className="sample-desc">{sample.description}</p>
                  <Button
                    variant="outline"
                    className="sample-btn"
                    onClick={() => onSelectSample?.(sample)}
                    aria-label={`Test ${sample.name} sample`}
                  >
                    <FaPlay size={10} className="btn-icon" /> Try This Sample
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Value Differentiators */}
        <section className="landing-section" aria-label="Key Capabilities">
          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-icon privacy-icon">
                <FaLock size={20} />
              </div>
              <div className="highlight-text">
                <h4>100% Local & Private</h4>
                <p>
                  Rendered client-side via WebCodecs. Your SVGs never leave your
                  browser.
                </p>
              </div>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon alpha-icon">
                <FaCheckCircle size={20} />
              </div>
              <div className="highlight-text">
                <h4>Alpha Channel Transparency</h4>
                <p>
                  Full 8-bit alpha support for WebM and aPNG, plus indexed GIF
                  transparency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Supported Export Formats */}
        <section
          className="landing-section formats-section"
          aria-label="Supported Export Formats"
        >
          <span className="formats-label">Supported Export Formats</span>
          <div className="format-badges">
            <span className="format-pill pill-mp4">
              <strong>MP4</strong>
              <small>H.264</small>
            </span>
            <span className="format-pill pill-webm">
              <strong>WEBM</strong>
              <small>VP9 / Alpha</small>
            </span>
            <span className="format-pill pill-apng">
              <strong>APNG</strong>
              <small>RGBA PNG</small>
            </span>
            <span className="format-pill pill-gif">
              <strong>GIF</strong>
              <small>GIF89a</small>
            </span>
          </div>
        </section>

        {/* CLI & MCP Developer Integration */}
        <section
          className="landing-section integration-section"
          aria-label="Developer Tools"
        >
          <div className="integration-card">
            <div className="integration-header">
              <div className="integration-tabs">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'cli' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('cli')}
                >
                  <FaTerminal size={12} /> CLI Automation
                </button>
                <button
                  type="button"
                  className={`tab-btn ${activeTab === 'mcp' ? 'is-active' : ''}`}
                  onClick={() => setActiveTab('mcp')}
                >
                  <FaRobot size={12} /> AI Agent (MCP)
                </button>
              </div>
              <button
                type="button"
                className="copy-btn"
                onClick={() =>
                  handleCopy(
                    activeTab === 'cli' ? cliCommand : mcpCommand,
                    activeTab
                  )
                }
                title="Copy snippet"
                aria-label="Copy code snippet"
              >
                {copiedTab === activeTab ? (
                  <>
                    <FaCheck size={12} /> Copied!
                  </>
                ) : (
                  <>
                    <FaCopy size={12} /> Copy
                  </>
                )}
              </button>
            </div>
            <pre className="code-box" tabIndex={0} aria-label="Code snippet">
              <code>{activeTab === 'cli' ? cliCommand : mcpCommand}</code>
            </pre>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="studio-footer">
        <p>
          <FaLock size={12} className="footer-icon" /> Local processing only —
          files never leave your browser. Released under the MIT License.
        </p>
      </footer>
    </div>
  );
};
