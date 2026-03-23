import React, { useEffect, useState } from 'react';
import cartIcon from '../assets/cart_icon.png';
import textLogo from '../assets/Text Logo.png';
import PrimaryNav from './PrimaryNav';

function SiteHeader({
  openCart,
  cartCount = 0,
  brandHref = '/',
  exploreHref,
  secondaryLink,
  secondaryAction
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return undefined;
    }

    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className={`topbar${mobileMenuOpen ? ' topbar-mobile-open' : ''}`}>
      <a className="brand" href={brandHref} onClick={closeMobileMenu}>
        <img className="brand-wordmark" src={textLogo} alt="River City Creamery" />
      </a>

      <div className="topbar-desktop-nav">
        <PrimaryNav exploreHref={exploreHref} />
      </div>

      <nav className="nav nav-secondary topbar-desktop-actions">
        {secondaryLink ? <a href={secondaryLink.href}>{secondaryLink.label}</a> : null}
        {secondaryAction ? (
          <button type="button" className="account-nav-button" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </button>
        ) : null}
        <button type="button" className="cart-nav-button" onClick={openCart} aria-label="Open cart">
          <img className="cart-nav-icon" src={cartIcon} alt="" aria-hidden="true" />
          {cartCount > 0 ? <span className="cart-count-badge">{cartCount}</span> : null}
        </button>
      </nav>

      <div className="topbar-mobile-actions">
        <button
          type="button"
          className="cart-nav-button"
          onClick={openCart}
          aria-label="Open cart"
        >
          <img className="cart-nav-icon" src={cartIcon} alt="" aria-hidden="true" />
          {cartCount > 0 ? <span className="cart-count-badge">{cartCount}</span> : null}
        </button>
        <button
          type="button"
          className="mobile-menu-button"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-nav-panel${mobileMenuOpen ? ' mobile-nav-panel-open' : ''}`}>
        <PrimaryNav exploreHref={exploreHref} mobile onNavigate={closeMobileMenu} />
        <div className="mobile-nav-secondary">
          {secondaryLink ? (
            <a href={secondaryLink.href} onClick={closeMobileMenu}>
              {secondaryLink.label}
            </a>
          ) : null}
          {secondaryAction ? (
            <button type="button" className="account-nav-button" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SiteHeader;
