import './Header.scss';
import Logo from '../assets/logo.svg?react';

export const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">
        <Logo className="header-logo" width="24" height="24" />
        SVG to Video <small className="header-badge">STUDIO</small>
      </h1>
      <p className="header-description">Zero-server high-fidelity rendering</p>
    </header>
  );
};
