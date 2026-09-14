import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import './Dropzone.scss';

interface DropzoneProps {
  svgContent: string | null;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: DragEvent) => void;
  disabled?: boolean;
}

export const Dropzone = ({
  svgContent,
  isDragging,
  setIsDragging,
  onFileChange,
  onDrop,
  disabled,
}: DropzoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSvgFile = (file: File): boolean => {
    return (
      file.type === 'image/svg+xml' || file.name.toLowerCase().endsWith('.svg')
    );
  };

  const handleDrag = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    // Prevent double trigger if clicking directly on the file input element
    if (e.target === fileInputRef.current) return;
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleInternalFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (file) {
      if (!isSvgFile(file)) {
        setErrorMessage('Only SVG files are supported.');
        e.target.value = '';
        return;
      }
      onFileChange(e);
    }
  };

  const handleInternalDrop = (e: DragEvent) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setErrorMessage(null);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!isSvgFile(file)) {
        setErrorMessage('Only SVG files are supported.');
        return;
      }
      onDrop(e);
    }
  };

  return (
    <div
      className={`dropzone ${isDragging ? 'dragging' : ''} ${svgContent ? 'has-content' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleInternalDrop}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload SVG dropzone"
      aria-disabled={disabled}
    >
      <div className="input-group" style={{ marginBottom: 0 }}>
        <label htmlFor="svg-upload">
          {svgContent ? 'Change SVG' : 'Drop SVG here or click to upload'}
        </label>
        <div className="file-input-wrapper">
          <input
            type="file"
            id="svg-upload"
            ref={fileInputRef}
            accept=".svg,image/svg+xml"
            onChange={handleInternalFileChange}
            disabled={disabled}
            aria-hidden="true"
          />
        </div>
      </div>
      {errorMessage && (
        <div className="dropzone-error-toast" role="alert">
          <span>{errorMessage}</span>
          <button
            type="button"
            className="dropzone-error-close"
            onClick={(e) => {
              e.stopPropagation();
              setErrorMessage(null);
            }}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
