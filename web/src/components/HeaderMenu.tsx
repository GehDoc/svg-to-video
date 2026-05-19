import { useState, useRef, useEffect } from 'react';
import { FaBars, FaHeart } from 'react-icons/fa';
import pkg from '../../package.json';
import { HeaderDropdown } from './HeaderDropdown';
import './HeaderMenu.scss';

export const HeaderMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="header-menu-container" ref={menuRef}>
      <a
        href={pkg.funding.url}
        target="_blank"
        rel="noopener noreferrer"
        className="header-sponsor-btn"
      >
        <FaHeart className="icon-heart" /> Sponsor
      </a>

      <button
        type="button"
        className="header-burger-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <FaBars size={20} />
      </button>

      {isOpen && <HeaderDropdown />}
    </div>
  );
};
