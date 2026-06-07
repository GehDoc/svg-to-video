import { useState } from 'react';
import { Button } from './Button/Button';
import { FaHeart, FaCopy, FaCheck, FaTimes } from 'react-icons/fa';
import pkg from '../../package.json';
import { copyDataUrl } from '../utils/clipboard';
import { isImageMimeType } from '../utils/discoverFormats';
import './SuccessView.scss';

interface SuccessViewProps {
  fileName: string;
  fileSize: string | null;
  renderedUrl: string;
  mimeType: string;
  onDownload: () => void;
  onBack: () => void;
  onCopyOverride?: (url: string) => Promise<boolean>;
}

export const SuccessView = ({
  fileName,
  fileSize,
  renderedUrl,
  mimeType,
  onDownload,
  onBack,
  onCopyOverride,
}: SuccessViewProps) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );

  const handleCopy = async () => {
    setCopyStatus('idle');

    const copyFn = onCopyOverride || copyDataUrl;
    const success = await copyFn(renderedUrl);

    if (typeof umami !== 'undefined') {
      umami.track('copy-data-url', { success });
    }

    if (success) {
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } else {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const getCopyIcon = () => {
    if (copyStatus === 'success') return <FaCheck className="icon-success" />;
    if (copyStatus === 'error') return <FaTimes className="icon-error" />;
    return <FaCopy />;
  };

  const isImage = isImageMimeType(mimeType);

  return (
    <div className="success-card">
      <header className="success-header">
        <div className="success-icon" aria-hidden="true">
          <FaCheck />
        </div>
        <h3>Render Complete</h3>
        <p className="success-meta">
          {fileName} • {fileSize}
        </p>
      </header>
      <div className="success-preview">
        {isImage ? (
          <img src={renderedUrl} alt="Rendered animation preview" />
        ) : (
          <video
            src={renderedUrl}
            controls
            autoPlay
            loop
            data-testid="video-preview"
          >
            <track kind="captions" srcLang="en" label="English" default />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className="success-actions">
        <Button variant="primary" onClick={onDownload}>
          Download
        </Button>
        <Button
          variant="outline"
          onClick={handleCopy}
          className={`copy-button copy-button--${copyStatus}`}
        >
          {getCopyIcon()}
          Copy Data URL
        </Button>
        <Button variant="secondary" onClick={onBack}>
          Back to Studio
        </Button>
      </div>
      <div className="success-support">
        <span>
          <FaHeart className="icon-heart" /> Love this tool?{' '}
        </span>
        <a href={pkg.funding.url} target="_blank" rel="noopener noreferrer">
          Support its development on GitHub ↗
        </a>
      </div>
    </div>
  );
};
