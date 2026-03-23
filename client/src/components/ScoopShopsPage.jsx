import React from 'react';
import Footer from './Footer';
import SiteHeader from './SiteHeader';

function ScoopShopsPage({ openCart, cartCount = 0 }) {
  return (
    <>
      <section className="order-hero">
        <div className="section">
          <SiteHeader
            openCart={openCart}
            cartCount={cartCount}
            secondaryLink={{ href: '/login', label: 'Rewards' }}
          />
          <div className="order-page-intro">
            <span className="eyebrow">Visit Us</span>
            <h1>Find your nearest River City Creamery scoop shop.</h1>
            <p>
              Start with Missoula, then expand this page as additional scoop shop
              locations open.
            </p>
          </div>
        </div>
      </section>

      <section className="content-block">
        <div className="section">
          <div className="section-title">
            <h2>Missoula, MT</h2>
            <p>Use this page to showcase each shop, the atmosphere, and how customers can get there fast.</p>
          </div>

          <div className="shop-location-card">
            <div className="shop-location-photo" aria-label="Missoula scoop shop image placeholder">
              <span>Add shop photo</span>
            </div>

            <div className="shop-location-details">
              <span className="shop-location-label">Flagship Scoop Shop</span>
              <h3>Missoula, Montana</h3>
              <p>
                Add the full street address here once you want the page to show exact
                storefront directions and business hours.
              </p>
              <a
                className="button button-primary"
                href="https://www.google.com/maps/search/?api=1&query=Missoula%2C+MT"
                target="_blank"
                rel="noreferrer"
              >
                Open in Google Maps
              </a>
            </div>

            <div className="shop-location-map">
              <iframe
                title="River City Creamery Missoula map"
                src="https://www.google.com/maps?q=Missoula,%20MT&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default ScoopShopsPage;
