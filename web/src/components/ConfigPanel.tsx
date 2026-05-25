import { useEffect, useState, type ChangeEvent, useCallback } from 'react';
import type { ResolutionPreset, RenderState } from '../hooks/useRenderer';
import { isTransparencySupported } from '../utils/isTransparencySupported';
import {
  discoverFormats,
  type VideoFormat,
  getFormatById,
} from '../utils/discoverFormats';
import { Dropzone } from './Dropzone';
import type { VideoMetadata } from '../../../shared/metadata';
import { Button } from './Button/Button';
import { FormatSelector } from './FormatSelector/FormatSelector';
import './ConfigPanel.scss';

interface ConfigPanelProps {
  svgContent: string | null;
  onSvgContentChange: (content: string, fileName: string) => void;
  fileName: string;
  onFileNameChange: (name: string) => void;
  duration: number;
  onDurationChange: (d: number) => void;
  hold: number;
  onHoldChange: (h: number) => void;
  fps: number;
  onFpsChange: (f: number) => void;
  preset: ResolutionPreset;
  onPresetChange: (p: ResolutionPreset) => void;
  scale: number;
  onScaleChange: (s: number) => void;
  backgroundColor: string;
  onBackgroundColorChange: (c: string) => void;
  format: string;
  onFormatChange: (f: string) => void;
  isTransparent: boolean;
  onIsTransparentChange: (t: boolean) => void;
  captureMethod: 'optimal' | 'high-fidelity';
  onCaptureMethodChange: (m: 'optimal' | 'high-fidelity') => void;
  isDragging: boolean;
  onIsDraggingChange: (d: boolean) => void;
  state: RenderState;
  onStartRender: () => void;
  originalDim: { isDimensionsDetected: boolean };
  renderedUrl: string | null;
  metadata: VideoMetadata;
  onMetadataChange: (m: VideoMetadata) => void;
}

export const ConfigPanel = ({
  svgContent,
  onSvgContentChange,
  fileName,
  onFileNameChange,
  duration,
  onDurationChange,
  hold,
  onHoldChange,
  fps,
  onFpsChange,
  preset,
  onPresetChange,
  scale,
  onScaleChange,
  backgroundColor,
  onBackgroundColorChange,
  format,
  onFormatChange,
  isTransparent,
  onIsTransparentChange,
  captureMethod,
  onCaptureMethodChange,
  isDragging,
  onIsDraggingChange,
  state,
  onStartRender,
  originalDim,
  renderedUrl,
  metadata,
  onMetadataChange,
}: ConfigPanelProps) => {
  const [formats, setFormats] = useState<VideoFormat[]>([]);

  useEffect(() => {
    discoverFormats().then(setFormats);
  }, []);

  const isRenderingOrSuccess = state.isRendering || !!renderedUrl;
  const isOptionsDisabled = isRenderingOrSuccess || !svgContent;

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const baseName = file.name.replace(/\.svg$/i, '');
      onSvgContentChange(content, `${baseName}.mp4`);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onIsDraggingChange(false);
    if (
      e.dataTransfer.files?.[0] &&
      e.dataTransfer.files[0].type === 'image/svg+xml'
    ) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFormatChange = useCallback(
    (newFormatId: string) => {
      const formatInfo = getFormatById(newFormatId);
      onFormatChange(newFormatId);
      if (formatInfo) {
        const newName = fileName.replace(/\.[^/.]+$/, formatInfo.extension);
        onFileNameChange(newName);
        if (!formatInfo.supportsAlpha) {
          onIsTransparentChange(false);
        }
      }
    },
    [fileName, onFileNameChange, onFormatChange, onIsTransparentChange]
  );

  return (
    <aside className="config-panel" tabIndex={0}>
      <section
        className={`config-section ${isRenderingOrSuccess ? 'is-locked' : ''}`}
        aria-disabled={isRenderingOrSuccess}
      >
        <h2 aria-disabled={isRenderingOrSuccess}>1. Source</h2>
        <Dropzone
          svgContent={svgContent}
          isDragging={isDragging}
          setIsDragging={onIsDraggingChange}
          onFileChange={handleFileChange}
          onDrop={handleDrop}
          disabled={isRenderingOrSuccess}
        />
      </section>

      <section
        className={`config-section ${isOptionsDisabled ? 'is-locked' : ''}`}
        aria-disabled={isOptionsDisabled}
      >
        <h2 aria-disabled={isOptionsDisabled}>2. Format</h2>
        <FormatSelector
          formats={formats}
          value={format}
          onChange={handleFormatChange}
          disabled={isOptionsDisabled}
        />

        <div className="input-group">
          <label htmlFor="resolution">Resolution</label>
          <select
            id="resolution"
            value={!originalDim.isDimensionsDetected ? '1080p' : preset}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onPresetChange(e.target.value as ResolutionPreset)
            }
            disabled={isOptionsDisabled || !originalDim.isDimensionsDetected}
          >
            <option value="original">Original Size</option>
            <option value="720p">720p (Fit)</option>
            <option value="1080p">1080p (Fit)</option>
          </select>
          {svgContent && !originalDim.isDimensionsDetected && (
            <p
              className="hint-text"
              aria-disabled={
                isOptionsDisabled || !originalDim.isDimensionsDetected
              }
            >
              Warning: Could not detect SVG dimensions. Defaulting to 1080p.
            </p>
          )}
        </div>

        {preset === 'original' && (
          <div className="input-group">
            <label htmlFor="scale">Scale ({scale}x)</label>
            <input
              type="range"
              id="scale"
              min="1"
              max="4"
              step="0.5"
              value={scale}
              onChange={(e) => onScaleChange(parseFloat(e.target.value))}
              disabled={isOptionsDisabled}
            />
          </div>
        )}

        <div className="grid-3">
          <div className="input-group">
            <label htmlFor="duration">Dur. (s)</label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => onDurationChange(parseFloat(e.target.value))}
              min={1}
              disabled={isOptionsDisabled}
            />
          </div>
          <div className="input-group">
            <label htmlFor="hold">Hold (s)</label>
            <input
              type="number"
              id="hold"
              value={hold}
              onChange={(e) => onHoldChange(parseFloat(e.target.value))}
              min={0}
              step={0.5}
              disabled={isOptionsDisabled}
            />
          </div>
          <div className="input-group">
            <label htmlFor="fps">FPS</label>
            <input
              type="number"
              id="fps"
              value={fps}
              onChange={(e) => onFpsChange(parseInt(e.target.value))}
              min={1}
              max={60}
              disabled={isOptionsDisabled}
            />
          </div>
        </div>
      </section>

      <section
        className={`config-section ${isOptionsDisabled ? 'is-locked' : ''}`}
        aria-disabled={isOptionsDisabled}
      >
        <h2 aria-disabled={isOptionsDisabled}>3. Canvas</h2>
        <div className="input-group">
          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              id="transparent"
              checked={isTransparent}
              onChange={(e) => onIsTransparentChange(e.target.checked)}
              disabled={isOptionsDisabled || !isTransparencySupported(format)}
            />
            <label htmlFor="transparent">Transparent Background</label>
          </div>
          {!isTransparencySupported(format) && (
            <p
              className="hint-text hint-text--info"
              aria-disabled={isOptionsDisabled}
            >
              Transparency only supported for formats with alpha channel
              support.
            </p>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="bg-color">Background</label>
          <div className="color-picker-wrapper">
            <input
              type="color"
              id="bg-color"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              disabled={isOptionsDisabled || isTransparent}
            />
            <input
              type="text"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              disabled={isOptionsDisabled || isTransparent}
              className="color-text-input"
              aria-label="Background color hex code"
            />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="capture-method">Capture Method</label>
          <select
            id="capture-method"
            value={captureMethod}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onCaptureMethodChange(
                e.target.value as 'optimal' | 'high-fidelity'
              )
            }
            disabled={isOptionsDisabled}
          >
            <option value="optimal">Optimal (Fast)</option>
            <option value="high-fidelity">High Fidelity (Slow)</option>
          </select>
        </div>
      </section>

      <section
        className={`config-section ${isOptionsDisabled ? 'is-locked' : ''}`}
        aria-disabled={isOptionsDisabled}
      >
        <h2 aria-disabled={isOptionsDisabled}>4. Metadata</h2>
        <div className="input-group">
          <label htmlFor="meta-title">Title</label>
          <input
            type="text"
            id="meta-title"
            value={metadata.title || ''}
            onChange={(e) =>
              onMetadataChange({ ...metadata, title: e.target.value })
            }
            disabled={
              isOptionsDisabled || !getFormatById(format)?.supportsMetadata
            }
            placeholder="Video title"
          />
        </div>
        <div className="input-group">
          <label htmlFor="meta-comment">Comment</label>
          <textarea
            id="meta-comment"
            value={metadata.comment || ''}
            onChange={(e) =>
              onMetadataChange({ ...metadata, comment: e.target.value })
            }
            disabled={
              isOptionsDisabled || !getFormatById(format)?.supportsMetadata
            }
            placeholder="Additional notes"
            rows={2}
            className="textarea-input"
          />
        </div>
      </section>

      <div className="render-actions">
        <Button
          variant="primary"
          onClick={onStartRender}
          disabled={!svgContent || isRenderingOrSuccess}
        >
          {state.isRendering
            ? 'Processing...'
            : `Export ${format.toUpperCase()}`}
        </Button>
      </div>
    </aside>
  );
};
