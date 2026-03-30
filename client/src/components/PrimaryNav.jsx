import React, { useRef, useState } from 'react';
import exploreImage from '../assets/chocolate_top_home.jpg';

function orderFilterHref(filter) {
  return `/order?filter=${encodeURIComponent(filter)}`;
}

function exploreSectionHref(sectionId) {
  return `/#${sectionId}`;
}

const mobileNavSections = [
  {
    key: 'explore',
    label: 'Explore',
    href: '/#explore-flavors',
    links: [
      { label: 'Flavors', href: exploreSectionHref('explore-flavors') },
      { label: 'Bundles', href: exploreSectionHref('explore-bundles') },
      { label: 'New Arrivals', href: exploreSectionHref('explore-new-arrivals') },
      { label: 'Gluten Free', href: exploreSectionHref('explore-gluten-free') },
      { label: 'Fat Free', href: exploreSectionHref('explore-fat-free') },
      { label: 'Dairy Free', href: exploreSectionHref('explore-dairy-free') },
      { label: 'Online Exclusives', href: exploreSectionHref('explore-online-exclusives') }
    ]
  },
  {
    key: 'order',
    label: 'Order',
    href: '/order',
    links: [
      { label: 'Prepackaged Ice Cream', href: orderFilterHref('Prepackaged') },
      { label: 'Bundles', href: orderFilterHref('Bundles') },
      { label: 'Ice Cream Sandwiches', href: orderFilterHref('Ice Cream Sandwiches') },
      { label: 'Ice Cream Cakes', href: orderFilterHref('Cakes') },
      { label: 'Cones and Toppings', href: orderFilterHref('Cones and Toppings') },
      { label: 'Party Boxes', href: orderFilterHref('Party Boxes') },
      { label: 'Affogato', href: orderFilterHref('Affogato') }
    ]
  },
  {
    key: 'shops',
    label: 'Scoop Shops',
    href: '/scoop-shops',
    links: [
      { label: 'Missoula, MT', href: '/scoop-shops' },
      { label: 'Hours & Location', href: '/scoop-shops' },
      { label: 'Maps & Directions', href: '/scoop-shops' }
    ]
  },
  {
    key: 'story',
    label: 'Our Story',
    href: '/about',
    links: [
      { label: 'About River City', href: '/about' },
      { label: 'Events & Catering', href: '/about' },
      { label: 'What We Make', href: '/about' },
      { label: 'Missoula Roots', href: '/about' }
    ]
  }
];

function PrimaryNav({ exploreHref = '/#explore-flavors', mobile = false, onNavigate }) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileOpenSection, setMobileOpenSection] = useState(null);
  const closeTimeoutRef = useRef(null);

  if (mobile) {
    return (
      <nav className="mobile-nav-list" aria-label="Primary">
        {mobileNavSections.map((section) => (
          <div className="mobile-nav-group" key={section.key}>
            <button
              type="button"
              className={`mobile-nav-trigger${mobileOpenSection === section.key ? ' mobile-nav-trigger-open' : ''}`}
              aria-expanded={mobileOpenSection === section.key}
              onClick={() =>
                setMobileOpenSection((current) => (current === section.key ? null : section.key))
              }
            >
              <span>{section.label}</span>
              <span aria-hidden="true">{mobileOpenSection === section.key ? '−' : '+'}</span>
            </button>
            <div
              className={`mobile-nav-links${mobileOpenSection === section.key ? ' mobile-nav-links-open' : ''}`}
            >
              <a href={section.href} onClick={onNavigate}>
                View All
              </a>
              {section.links.map((link) => (
                <a key={link.label} href={link.href} onClick={onNavigate}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
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
              <a href={exploreSectionHref('explore-flavors')}>Flavors</a>
              <a href={exploreSectionHref('explore-bundles')}>Bundles</a>
              <a href={exploreSectionHref('explore-new-arrivals')}>New Arrivals</a>
              <a href={exploreSectionHref('explore-gluten-free')}>Gluten Free</a>
              <a href={exploreSectionHref('explore-fat-free')}>Fat Free</a>
              <a href={exploreSectionHref('explore-dairy-free')}>Dairy Free</a>
              <a href={exploreSectionHref('explore-online-exclusives')}>Online Exclusives</a>
            </div>
            <a className="nav-mega-feature" href={exploreSectionHref('explore-flavors')}>
              <img src={exploreImage} alt="River City Creamery flavors" />
              <div>
                <span className="nav-mega-label">Featured</span>
                <p>Jump into the homepage explore sections and then move into checkout.</p>
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
              <a href={orderFilterHref('Prepackaged')}>Prepackaged Ice Cream</a>
              <a href={orderFilterHref('Bundles')}>Bundles</a>
              <a href={orderFilterHref('Ice Cream Sandwiches')}>Ice Cream Sandwiches</a>
              <a href={orderFilterHref('Cakes')}>Ice Cream Cakes</a>
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
