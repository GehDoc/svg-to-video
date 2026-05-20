import { type ReactNode } from 'react';
import './Dropdown.scss';

export interface DropdownSection {
  label?: string;
  items: DropdownItem[];
}

export interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  rightElement?: ReactNode;
  isMeta?: boolean;
}

interface DropdownProps {
  sections: DropdownSection[];
  onClose?: () => void;
}

export const Dropdown = ({ sections, onClose }: DropdownProps) => {
  return (
    <div className="dropdown-card">
      {sections.map((section, sIdx) => (
        <div key={sIdx} className="dropdown-section">
          {section.label && (
            <span className="dropdown-label">{section.label}</span>
          )}
          {section.items.map((item, iIdx) => {
            const content = (
              <>
                <div className="meta-left">
                  {item.icon}
                  {item.label}
                </div>
                {item.rightElement}
              </>
            );

            const handleClick = (e: React.MouseEvent) => {
              if (!item.href) {
                e.preventDefault();
              }
              if (item.onClick) item.onClick();
              if (onClose) onClose();
            };

            return (
              <a
                key={iIdx}
                href={item.href || '#'}
                target={item.target}
                rel={item.rel}
                className={item.isMeta ? 'dropdown-meta-link' : 'dropdown-item'}
                onClick={handleClick}
              >
                {content}
              </a>
            );
          })}
        </div>
      ))}
    </div>
  );
};
