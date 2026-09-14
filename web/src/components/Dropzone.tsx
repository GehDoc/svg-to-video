import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type MouseEvent,
} from 'react';
import { ErrorView } from './ErrorView';
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
    // Prevent double trigger if clicking directly on label or file input element
    if (
      e.target === fileInputRef.current ||
      (e.target as HTMLElement).tagName === 'LABEL'
    ) {
      return;
    }
    fileInputRef.current?.click();
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
    <>
      <div
        className={`dropzone ${isDragging ? 'dragging' : ''} ${svgContent ? 'has-content' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleInternalDrop}
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
            />
          </div>
        </div>
      </div>
      {errorMessage && (
        <ErrorView
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
    </>
  );
};
