import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { HandCoins, Mail, Menu, Settings, X } from 'lucide-react';
import { CookieConsent } from './CookieConsent';
import { ElectionHub } from './ElectionHub';
import { NewsletterSignup } from './NewsletterSignup';
import { Seo } from './Seo';
import { SocialIcon } from './SocialIcon';
import { siteSource } from '../lib/med-data';
import { openCookieSettings } from '../lib/cookie-settings';
import { socialLinks } from '../lib/site-meta';

const navItems = [
  { label: 'Val 2026', to: '/val-2026' },
  { label: 'Politik', to: '/politik' },
  { label: 'Politiker', to: '/politiker' },
  { label: 'Distrikt', to: '/distrikt' },
  { label: 'Evenemang', to: '/evenemang' },
  { label: 'Aktuellt', to: '/aktuellt' },
  { label: 'Om MED', to: '/om' },
];

export function SiteLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  const exportedDate = siteSource.exportedAt
    ? new Intl.DateTimeFormat('sv-SE', { dateStyle: 'medium' }).format(new Date(siteSource.exportedAt))
    : '';

  return (
    <div className="site-shell">
      <Seo />
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Medborgerlig Samling">
          <img src="https://www.med.se/logo.png" alt="" />
        </Link>

        <nav className="desktop-nav" aria-label="Huvudmeny">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/donera" className="icon-link" title="Donera">
            <HandCoins size={18} />
            <span>Donera</span>
          </Link>
          <Link to="/medlemskap" className="primary-link">
            Bli medlem
          </Link>
          <button
            type="button"
            className="menu-button"
            aria-label={isOpen ? 'Stäng meny' : 'Öppna meny'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen ? (
          <nav className="mobile-nav" aria-label="Mobil meny" onClick={() => setIsOpen(false)}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/donera">Donera</Link>
            <Link to="/medlemskap">Bli medlem</Link>
          </nav>
        ) : null}
      </header>

      <main>
        <Outlet />
      </main>

      <NewsletterSignup compact className="footer-newsletter" />
      <ElectionHub compact className="footer-election-hub" />

      <footer className="site-footer" translate="no">
        <div className="footer-about">
          <Link to="/" className="footer-brand">
            Medborgerlig Samling
          </Link>
          <p>Frihet, trygghet och framtidstro.</p>
          {exportedDate ? <p className="source-note">Innehållssnapshot från med.se: {exportedDate}.</p> : null}
        </div>
        <div className="footer-links">
          <Link to="/press">Press</Link>
          <Link to="/alla-ska-med">Alla ska MED</Link>
          <Link to="/granskningsgruppen">Granskningsgruppen</Link>
          <Link to="/integritetspolicy">Integritet</Link>
          <Link to="/cookiepolicy">Cookiepolicy</Link>
          <button type="button" className="footer-link-button" onClick={openCookieSettings}>
            <Settings size={16} />
            Cookieinställningar
          </button>
          <a href="mailto:info@med.se">
            <Mail size={16} />
            info@med.se
          </a>
        </div>
        <div className="footer-social" aria-label="Sociala kanaler">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              title={link.label}
            >
              <SocialIcon label={link.label} />
              <span className="visually-hidden">{link.label}</span>
            </a>
          ))}
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
}
