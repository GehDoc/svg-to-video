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
  return (
    <div className="meta-grid">
      {meta ? (
        <>
          <div className="meta-item">
            <strong>Source</strong> {meta.originalSize}
          </div>
          <div className="meta-item">
            <strong>Export</strong> {meta.finalSize}
          </div>
          <div className="meta-item">
            <strong>Codec</strong> {meta.codec}
          </div>
          <div className="meta-item">
            <strong>ETA</strong> {meta.eta}s
          </div>
        </>
      ) : dimensions ? (
        <>
          <div className="meta-item">
            <strong>Source</strong> {dimensions.width}x{dimensions.height}
          </div>
          <div className="meta-item">
            <strong>Export</strong> {dimensions.targetWidth}x
            {dimensions.targetHeight}
          </div>
        </>
      ) : null}
    </div>
  );
};
