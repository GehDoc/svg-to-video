import { FaLock, FaCheckCircle } from 'react-icons/fa';
import { SAMPLES, type SamplePreset } from '../utils/samples';
import { SampleCard } from './SampleCard';
import './LandingView.scss';

interface LandingViewProps {
  onSelectSample?: (sample: SamplePreset) => void;
}

export const LandingView = ({ onSelectSample }: LandingViewProps) => {
  return (
    <div className="landing-view">
      <div className="landing-scroll-content">
        {/* Welcome Prompt */}
        <header className="landing-hero">
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
                <h4>100% Local &amp; Private</h4>
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
      </div>

      {/* Repurposed bottom bar acting as a scroll & jump cue */}
      <div className="studio-scroll-cue">
        <span>More guides, format specs &amp; automation below</span>
        <nav
          className="studio-scroll-cue__links"
          aria-label="Quick documentation links"
        >
          <a href="#how-to-convert">How to Convert &darr;</a>
          <a href="#formats">Formats &amp; Specs &darr;</a>
          <a href="#automation">CLI, Docker &amp; MCP &darr;</a>
          <a href="#faq">FAQ &darr;</a>
        </nav>
      </div>
    </div>
  );
};
