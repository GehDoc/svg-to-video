import { useState, useRef, useEffect } from 'react';
import { Button } from './Button/Button';
import { FaHeart, FaChevronDown, FaCopy, FaFile } from 'react-icons/fa';
import pkg from '../../package.json';
import { copyDataUrl, copyBinaryFile } from '../utils/clipboard';
import { Dropdown } from './Dropdown/Dropdown';
import './SuccessView.scss';

interface SuccessViewProps {
  fileName: string;
  fileSize: string | null;
  renderedUrl: string;
  onDownload: () => void;
  onBack: () => void;
}

export const SuccessView = ({
  fileName,
  fileSize,
  renderedUrl,
  onDownload,
  onBack,
}: SuccessViewProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>(
    'idle'
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async (type: 'data-url' | 'file') => {
    setIsDropdownOpen(false);
    setCopyStatus('idle');

    let success = false;
    if (type === 'data-url') {
      success = await copyDataUrl(renderedUrl);
    } else {
      success = await copyBinaryFile(renderedUrl, 'video/mp4');
    }

    if (typeof umami !== 'undefined') {
      umami.track(type === 'data-url' ? 'copy-data-url' : 'copy-file', {
        success,
      });
    }

    if (success) {
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } else {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  return (
    <div className="success-card">
      <div className="success-icon">✓</div>
      <h3>Render Complete</h3>
      <p className="success-meta">
        {fileName} • {fileSize}
      </p>
      <div className="success-preview">
        <video src={renderedUrl} controls autoPlay loop />
      </div>
      <div className="success-actions">
        <Button variant="primary" onClick={onDownload}>
          Download
        </Button>
        <div className="copy-dropdown-wrapper" ref={dropdownRef}>
          <Button
            variant="secondary"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="copy-toggle"
          >
            {copyStatus === 'success'
              ? 'Copied!'
              : copyStatus === 'error'
                ? 'Error'
                : 'Copy'}
            <FaChevronDown className="chevron" />
          </Button>
          {isDropdownOpen && (
            <Dropdown
              align="left"
              onClose={() => setIsDropdownOpen(false)}
              sections={[
                {
                  items: [
                    {
                      label: 'Copy as Data URL',
                      onClick: () => handleCopy('data-url'),
                      icon: <FaCopy />,
                    },
                    {
                      label: 'Copy as Video File',
                      onClick: () => handleCopy('file'),
                      icon: <FaFile />,
                    },
                  ],
                },
              ]}
            />
          )}
        </div>
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
