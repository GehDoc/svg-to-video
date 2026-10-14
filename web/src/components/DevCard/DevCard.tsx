import { useState, type ReactNode } from 'react';
import { FaCheck, FaCopy } from 'react-icons/fa';
import './DevCard.scss';

export interface DevCardProps {
  title: string;
  icon?: ReactNode;
  snippet: string;
  snippetAriaLabel?: string;
  copyAriaLabel?: string;
}

export const DevCard = ({
  title,
  icon,
  snippet,
  snippetAriaLabel,
  copyAriaLabel = `Copy ${title}`,
}: DevCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is not available
    }
  };

  return (
    <div className="dev-card">
      <div className="dev-card-header">
        <div className="dev-title">
          {icon}
          <span>{title}</span>
        </div>
        <button
          type="button"
          className="copy-snippet-btn"
          onClick={handleCopy}
          aria-label={copyAriaLabel}
        >
          {copied ? (
            <>
              <FaCheck size={11} /> Copied
            </>
          ) : (
            <>
              <FaCopy size={11} /> Copy
            </>
          )}
        </button>
      </div>
      <pre
        className="dev-snippet"
        tabIndex={0}
        aria-label={snippetAriaLabel || title}
      >
        <code>{snippet}</code>
      </pre>
    </div>
  );
};
