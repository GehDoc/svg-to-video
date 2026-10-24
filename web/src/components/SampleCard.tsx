import { useRef, useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import type { SamplePreset } from '../utils/samples';
import { Button } from './Button/Button';

export interface SampleCardProps {
  sample: SamplePreset;
  onSelectSample?: (sample: SamplePreset) => void;
}

export const SampleCard = ({ sample, onSelectSample }: SampleCardProps) => {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = previewRef.current?.querySelector('svg');
    if (svg && typeof svg.pauseAnimations === 'function') {
      try {
        svg.pauseAnimations();
      } catch {
        /* ignored */
      }
    }
  }, [sample.svgContent]);

  const handleStart = () => {
    const svg = previewRef.current?.querySelector('svg');
    if (svg && typeof svg.unpauseAnimations === 'function') {
      try {
        svg.unpauseAnimations();
      } catch {
        /* ignored */
      }
    }
  };

  const handleStop = () => {
    const svg = previewRef.current?.querySelector('svg');
    if (svg && typeof svg.pauseAnimations === 'function') {
      try {
        svg.pauseAnimations();
      } catch {
        /* ignored */
      }
    }
  };

  return (
    <div
      className="sample-card"
      onMouseEnter={handleStart}
      onMouseLeave={handleStop}
      onFocus={handleStart}
      onBlur={handleStop}
    >
      <div
        ref={previewRef}
        className="sample-preview"
        dangerouslySetInnerHTML={{ __html: sample.svgContent }}
        aria-hidden="true"
      />
      <div className="sample-info">
        <div className="sample-header">
          <h3 className="sample-name">{sample.name}</h3>
          <span className="sample-tag">{sample.format.toUpperCase()}</span>
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
  );
};
