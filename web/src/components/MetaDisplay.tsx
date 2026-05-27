import './MetaDisplay.scss';

interface MetaDisplayProps {
  meta?: {
    originalSize: string;
    finalSize: string;
    codec: string;
    eta: number;
  };
  dimensions?: {
    width: number;
    height: number;
    targetWidth: number;
    targetHeight: number;
  };
}

export const MetaDisplay = ({ meta, dimensions }: MetaDisplayProps) => {
  const source =
    meta?.originalSize ||
    (dimensions ? `${dimensions.width}x${dimensions.height}` : '---');
  const export_ =
    meta?.finalSize ||
    (dimensions
      ? `${dimensions.targetWidth}x${dimensions.targetHeight}`
      : '---');
  const codec = meta?.codec || '---';
  const eta = meta?.eta !== undefined ? `${meta.eta}s` : '---';

  return (
    <div className="meta-grid">
      <div className="meta-item">
        <strong>Source:</strong> {source}
      </div>
      <div className="meta-item">
        <strong>Export:</strong> {export_}
      </div>
      <div className="meta-item">
        <strong>Codec:</strong> {codec}
      </div>
      <div className="meta-item">
        <strong>ETA:</strong> {eta}
      </div>
    </div>
  );
};
