import React, { useRef, useState } from 'react';
import exploreImage from '../assets/chocolate_top_home.jpg';

function orderFilterHref(filter) {
  return `/order?filter=${encodeURIComponent(filter)}`;
}

function PrimaryNav({ exploreHref = '/#featured', mobile = false, onNavigate }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const closeTimeoutRef = useRef(null);

  if (mobile) {
    return (
      <nav className="mobile-nav-list" aria-label="Primary">
        <a href={exploreHref} onClick={onNavigate}>
          Explore
        </a>
        <a href="/order" onClick={onNavigate}>
          Order
        </a>
        <a href="/scoop-shops" onClick={onNavigate}>
          Scoop Shops
        </a>
        <a href="/about" onClick={onNavigate}>
          Our Story
        </a>
      </nav>
    );
  }

  const closeMenu = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMenu(null);
  };

  const openMenu = (menuKey) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveMenu(menuKey);
  };

  const scheduleCloseMenu = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveMenu(null);
      closeTimeoutRef.current = null;
    }, 180);
  };

  return (
    <nav
      className="nav nav-primary"
      aria-label="Primary"
      onMouseLeave={scheduleCloseMenu}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          closeMenu();
        }
      }}
    >
      <div
        className={`nav-dropdown ${activeMenu === 'explore' ? 'is-open' : ''}`}
        onMouseEnter={() => openMenu('explore')}
        onMouseLeave={scheduleCloseMenu}
      >
        <a href={exploreHref} onFocus={() => openMenu('explore')}>
          Explore
        </a>
        <div className="nav-mega-panel" onMouseEnter={() => openMenu('explore')} onMouseLeave={scheduleCloseMenu}>
          <div className="nav-mega-grid">
            <div className="nav-mega-column">
              <span className="nav-mega-label">Explore</span>
              <a href="/order">Flavors</a>
              <a href="/about">Bundles</a>
              <a href="/about">New Arrivals</a>
              <a href="/about">Gluten Free</a>
              <a href="/about">Fat Free</a>
              <a href="/about">Dairy Free</a>
              <a href="/about">Online Exclusives</a>
            </div>
            <a className="nav-mega-feature" href="/order">
              <img src={exploreImage} alt="River City Creamery flavors" />
              <div>
                <span className="nav-mega-label">Featured</span>
                <p>Build a take-home order with pickup or local delivery.</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div
        className={`nav-dropdown ${activeMenu === 'order' ? 'is-open' : ''}`}
        onMouseEnter={() => openMenu('order')}
        onMouseLeave={scheduleCloseMenu}
      >
        <a href="/order" onFocus={() => openMenu('order')}>
          Order
        </a>
        <div className="nav-mega-panel" onMouseEnter={() => openMenu('order')} onMouseLeave={scheduleCloseMenu}>
          <div className="nav-mega-grid">
            <div className="nav-mega-column">
              <span className="nav-mega-label">Order</span>
              <a href={orderFilterHref('Prepackaged')}>Prepackaged</a>
              <a href={orderFilterHref('Bundles')}>Bundles</a>
              <a href={orderFilterHref('Ice Cream Sandwiches')}>Ice Cream Sandwiches</a>
              <a href={orderFilterHref('Cakes')}>Cakes</a>
              <a href={orderFilterHref('Cones and Toppings')}>Cones and Toppings</a>
              <a href={orderFilterHref('Party Boxes')}>Party Boxes</a>
              <a href={orderFilterHref('Affogato')}>Affogato</a>
              <a href={orderFilterHref('Containers and Extras')}>Containers and Extras</a>
              <a href={orderFilterHref('Subscription')}>Subscription</a>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`nav-dropdown ${activeMenu === 'shops' ? 'is-open' : ''}`}
        onMouseEnter={() => openMenu('shops')}
        onMouseLeave={scheduleCloseMenu}
      >
        <a href="/scoop-shops" onFocus={() => openMenu('shops')}>
          Scoop Shops
        </a>
        <div className="nav-mega-panel" onMouseEnter={() => openMenu('shops')} onMouseLeave={scheduleCloseMenu}>
          <div className="nav-mega-grid">
            <div className="nav-mega-column">
              <span className="nav-mega-label">Scoop Shops</span>
              <a href="/scoop-shops">Missoula, MT</a>
              <a href="/scoop-shops">Hours & Location</a>
              <a href="/scoop-shops">Maps & Directions</a>
              <span className="nav-mega-note">More locations can be added here as they open.</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`nav-dropdown ${activeMenu === 'story' ? 'is-open' : ''}`}
        onMouseEnter={() => openMenu('story')}
        onMouseLeave={scheduleCloseMenu}
      >
        <a href="/about" onFocus={() => openMenu('story')}>
          Our Story
        </a>
        <div className="nav-mega-panel" onMouseEnter={() => openMenu('story')} onMouseLeave={scheduleCloseMenu}>
          <div className="nav-mega-grid">
            <div className="nav-mega-column">
              <span className="nav-mega-label">Our Story</span>
              <a href="/about">About River City</a>
              <a href="/about">Events & Catering</a>
              <a href="/about">What We Make</a>
              <a href="/about">Missoula Roots</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default PrimaryNav;
