import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { api } from '../lib/api';
import NewsletterForm from './NewsletterForm';

export default function Layout({ children }) {
  const [config, setConfig] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api('/api/config').then(setConfig).catch(() => {});
  }, []);

  return (
    <div className="site">
      <header className="site-header">
        <div className="header-top">
          <div className="container header-top-inner">
            <button
              type="button"
              className="nav-toggle"
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
            <span className="brand-sign">Radhika Khandelwal</span>
          </Link>
          </div>
        </div>

        <div className={`header-nav ${menuOpen ? 'open' : ''}`}>
          <nav className="container site-nav">
            <NavLink to="/shop" onClick={() => setMenuOpen(false)}>
              Shop
            </NavLink>
            <NavLink to="/workshops" onClick={() => setMenuOpen(false)}>
              Workshops
            </NavLink>
            <NavLink to="/journal" onClick={() => setMenuOpen(false)}>
              Journal
            </NavLink>
            <NavLink to="/about" onClick={() => setMenuOpen(false)}>
              About
            </NavLink>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <p className="footer-brand">Radhika Khandelwal</p>
            <p className="muted">Art & stationery</p>
            {config?.instagram && (
              <a href={config.instagram} target="_blank" rel="noreferrer" className="text-link">
                Instagram
              </a>
            )}
          </div>
          <div>
            <p className="footer-heading">Quick links</p>
            <div className="footer-links">
              <Link to="/shop">Shop</Link>
              <Link to="/workshops">Workshops</Link>
              <Link to="/journal">Journal</Link>
              <Link to="/about">About</Link>
            </div>
          </div>
          <div>
            <p className="footer-heading">Newsletter</p>
            <NewsletterForm compact />
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} Radhika Khandelwal</span>
        </div>
      </footer>
    </div>
  );
}
