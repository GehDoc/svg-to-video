import {
  useRef,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import { FaLock } from 'react-icons/fa';
import './LandingView.scss';

export interface LandingViewProps {
  isDragging?: boolean;
  onIsDraggingChange?: (dragging: boolean) => void;
  onFileChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onDrop?: (e: DragEvent) => void;
}

export const LandingView = ({
  isDragging = false,
  onIsDraggingChange,
  onFileChange,
  onDrop,
}: LandingViewProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      onIsDraggingChange?.(true);
    } else if (e.type === 'dragleave') {
      onIsDraggingChange?.(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click target is the file input itself (or inside it), avoid calling click() again
    if (e.target === fileInputRef.current) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="monitor-content">
      <div
        className={`upload-placeholder ${isDragging ? 'dragging' : ''}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload an SVG to begin preview"
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".svg"
          onChange={onFileChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <h2>Upload an SVG to begin preview</h2>
        <p className="upload-hint">Drop SVG file here or click to browse</p>
      </div>

      <footer className="studio-footer">
        <p>
          <FaLock size={12} className="footer-icon" /> Local processing only —
          files never leave your browser. Released under the MIT License.
        </p>
      </footer>
    </div>
  );
};
