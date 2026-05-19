import './Header.scss';
import Logo from '../assets/logo.svg?react';
import { HeaderMenu } from './HeaderMenu';

export const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">
        <a
          className="header-title-link"
          onClick={() => window.location.reload()}
        >
          <Logo className="header-logo" width="24" height="24" />
          SVG to Video <small className="header-badge">STUDIO</small>
        </a>
      </h1>

      <HeaderMenu />
    </header>
  );
};
