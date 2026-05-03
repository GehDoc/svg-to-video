import './Header.scss';

export const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">
        <img
          src="favicon.svg"
          alt=""
          className="header-logo"
          width="24"
          height="24"
        />
        SVG to Video <small className="header-badge">STUDIO</small>
      </h1>
      <p className="header-description">Zero-server high-fidelity rendering</p>
    </header>
  );
};
