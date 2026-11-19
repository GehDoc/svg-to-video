import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type MouseEvent,
} from 'react';
import { Button } from './Button/Button';
import { FaUpload, FaFolderOpen } from 'react-icons/fa';
import { ErrorView } from './ErrorView';
import { isSvgFile } from '../utils/isSvgFile';
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
    // Prevent double trigger if clicking directly on label, native input, or custom button
    if (
      e.target === fileInputRef.current ||
      (e.target as HTMLElement).tagName === 'LABEL' ||
      (e.target as HTMLElement).closest('button')
    ) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (disabled) return;
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
        <div className="dropzone__content">
          <FaUpload className="dropzone__icon" aria-hidden="true" />
          <label htmlFor="svg-upload" className="dropzone__label">
            {svgContent ? 'Change SVG' : 'Drop SVG here or click to upload'}
          </label>
          <div className="dropzone__action">
            <Button
              variant="secondary"
              className="dropzone__btn"
              disabled={disabled}
              type="button"
              onClick={handleButtonClick}
              aria-label={
                svgContent
                  ? 'Choose another SVG file'
                  : 'Browse SVG file to upload'
              }
            >
              <FaFolderOpen className="btn-icon" aria-hidden="true" />
              {svgContent ? 'Choose Another File' : 'Browse Files'}
            </Button>
          </div>
          <input
            type="file"
            id="svg-upload"
            ref={fileInputRef}
            accept=".svg,image/svg+xml"
            onChange={handleInternalFileChange}
            disabled={disabled}
            className="dropzone__native-input"
          />
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
