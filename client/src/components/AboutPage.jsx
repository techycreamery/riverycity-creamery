import React from 'react';
import Features from './Features';
import Footer from './Footer';
import SiteHeader from './SiteHeader';

function AboutPage({ openCart, cartCount = 0 }) {
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
            <span className="eyebrow">About Us</span>
            <h1>The story behind the scoops, cakes, and neighborhood rituals.</h1>
            <p>
              Learn what River City Creamery makes, how we show up for events, and why
              Missoula customers keep coming back.
            </p>
          </div>
        </div>
      </section>
      <Features />
      <Footer />
    </>
  );
}

export default AboutPage;
