import { type ChangeEvent } from 'react';
import './Dropzone.scss';

interface DropzoneProps {
  svgContent: string | null;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDrop: (e: React.DragEvent) => void;
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
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  };

  return (
    <div
      className={`dropzone ${isDragging ? 'dragging' : ''} ${svgContent ? 'has-content' : ''}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={onDrop}
    >
      <div className="input-group" style={{ marginBottom: 0 }}>
        <label htmlFor="svg-upload">
          {svgContent ? 'Change SVG' : 'Drop SVG here or click to upload'}
        </label>
        <div className="file-input-wrapper">
          <input
            type="file"
            id="svg-upload"
            accept=".svg"
            onChange={onFileChange}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};
