import { useState, useRef, useEffect, type ReactNode } from 'react';
import { FaCheck, FaCopy } from 'react-icons/fa';
import './DevCard.scss';

export interface DevCardTab {
  id: string;
  label: string;
  icon?: ReactNode;
  snippet: string;
  snippetAriaLabel?: string;
  copyAriaLabel?: string;
}

export interface DevCardProps {
  title?: string;
  icon?: ReactNode;
  snippet?: string;
  snippetAriaLabel?: string;
  copyAriaLabel?: string;
  tabs?: DevCardTab[];
  defaultTabId?: string;
}

export const DevCard = ({
  title,
  icon,
  snippet,
  snippetAriaLabel,
  copyAriaLabel,
  tabs,
  defaultTabId,
}: DevCardProps) => {
  const [activeTabId, setActiveTabId] = useState<string>(
    () => defaultTabId || (tabs && tabs.length > 0 ? tabs[0].id : '')
  );
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const activeTab = tabs?.find((tab) => tab.id === activeTabId) ?? tabs?.[0];
  const currentSnippet = activeTab ? activeTab.snippet : (snippet ?? '');
  const currentSnippetAriaLabel =
    activeTab?.snippetAriaLabel ||
    snippetAriaLabel ||
    (activeTab ? `${activeTab.label} code snippet` : title || 'Code snippet');
  const currentCopyAriaLabel =
    activeTab?.copyAriaLabel ||
    (activeTab
      ? `Copy ${activeTab.label}`
      : copyAriaLabel || `Copy ${title || 'snippet'}`);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentSnippet);
      setCopied(true);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Fallback if clipboard API is not available
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    setCopied(false);
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
  };

  return (
    <div className="dev-card">
      <div className="dev-card-header">
        {tabs && tabs.length > 0 ? (
          <div className="dev-card-tabs" role="tablist">
            {tabs.map((tab) => {
              const isSelected = tab.id === activeTab?.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  className={`dev-tab-btn ${isSelected ? 'is-active' : ''}`}
                  onClick={() => handleTabClick(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="dev-title">
            {icon}
            {title && <span>{title}</span>}
          </div>
        )}
        <button
          type="button"
          className="copy-snippet-btn"
          onClick={handleCopy}
          aria-label={currentCopyAriaLabel}
          title={currentCopyAriaLabel}
        >
          {copied ? (
            <>
              <FaCheck size={11} /> Copied!
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
        aria-label={currentSnippetAriaLabel}
      >
        <code>{currentSnippet}</code>
      </pre>
    </div>
  );
};
