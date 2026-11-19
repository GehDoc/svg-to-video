import type { KeyboardEvent, MouseEvent } from 'react';
import './Header.scss';
import Logo from '../assets/logo.svg?react';
import { HeaderMenu } from './HeaderMenu';

export interface HeaderProps {
  onHome?: () => void;
}

export const Header = ({ onHome }: HeaderProps) => {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onHome) {
      onHome();
    } else {
      window.location.reload();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onHome) {
        onHome();
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <header className="header">
      <h1 className="header-title">
        <a
          role="button"
          tabIndex={0}
          aria-label="SVG to Video Home"
          className="header-title-link"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          <Logo className="header-logo" width="24" height="24" />
          SVG to Video <small className="header-badge">STUDIO</small>
        </a>
      </h1>

      <HeaderMenu />
    </header>
  );
};
