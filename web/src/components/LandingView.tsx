import { FaLock, FaCheckCircle, FaTerminal, FaRobot } from 'react-icons/fa';
import { SAMPLES, type SamplePreset } from '../utils/samples';
import { DevCard, type DevCardTab } from './DevCard/DevCard';
import { SampleCard } from './SampleCard';
import './LandingView.scss';

interface LandingViewProps {
  onSelectSample?: (sample: SamplePreset) => void;
}

const DEV_TABS: DevCardTab[] = [
  {
    id: 'cli',
    label: 'CLI Automation',
    icon: <FaTerminal size={12} />,
    snippet:
      'npx -y -p @gehdoc/svg-to-video svg-to-video input.svg 60 ./out-dir --format webm --transparent',
    copyAriaLabel: 'Copy CLI command',
  },
  {
    id: 'mcp',
    label: 'AI Agent (MCP)',
    icon: <FaRobot size={12} />,
    snippet: `{\n  "mcpServers": {\n    "svg-to-video": {\n      "command": "npx",\n      "args": ["-y", "-p", "@gehdoc/svg-to-video", "svg-to-video-mcp"]\n    }\n  }\n}`,
    copyAriaLabel: 'Copy MCP config snippet',
  },
];

export const LandingView = ({ onSelectSample }: LandingViewProps) => {
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
              <SampleCard
                key={sample.id}
                sample={sample}
                onSelectSample={onSelectSample}
              />
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
          <DevCard tabs={DEV_TABS} />
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
