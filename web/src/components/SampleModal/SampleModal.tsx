import { useEffect, useRef, type MouseEvent } from 'react';
import { FaTimes } from 'react-icons/fa';
import { SAMPLES, type SamplePreset } from '../../utils/samples';
import { SampleCard } from '../SampleCard';
import './SampleModal.scss';

export interface SampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SamplePreset) => void;
}

export const SampleModal = ({
  isOpen,
  onClose,
  onSelectSample,
}: SampleModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="sample-modal-backdrop"
      onClick={handleBackdropClick}
      data-testid="sample-modal-backdrop"
    >
      <div
        className="sample-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sample-modal-title"
        ref={modalRef}
      >
        <header className="sample-modal-header">
          <div className="sample-modal-heading">
            <h2 id="sample-modal-title" className="sample-modal-title">
              Sample Animations
            </h2>
            <p className="sample-modal-subtitle">
              Select a sample SVG animation to test the rendering engine and
              presets.
            </p>
          </div>
          <button
            type="button"
            className="sample-modal-close"
            onClick={onClose}
            aria-label="Close sample modal"
          >
            <FaTimes size={18} />
          </button>
        </header>

        <div className="sample-modal-body">
          <div className="sample-grid">
            {SAMPLES.map((sample) => (
              <SampleCard
                key={sample.id}
                sample={sample}
                onSelectSample={(s) => {
                  onSelectSample(s);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
