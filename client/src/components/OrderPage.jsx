import React from 'react';
import OrderSection from './OrderSection';
import OrderSupportChat from './OrderSupportChat';
import Footer from './Footer';
import SiteHeader from './SiteHeader';

function OrderPage({ openCart, openCakeBuilder, cartCount = 0 }) {
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
            <h1>Build your order and send it straight to the creamery.</h1>
            <p>
              Choose pickup or local delivery in Missoula, add notes for cakes or
              party packs, and submit everything in one place.
            </p>
          </div>
        </div>
      </section>
      <OrderSection openCart={openCart} openCakeBuilder={openCakeBuilder} />
      <OrderSupportChat />
      <section className="content-block" id="delivery">
        <div className="section">
          <div className="section-title">
            <h2>Need dessert fast?</h2>
            <p>
              Scoops, soft serve, toppings, and affogato are fulfilled through our
              delivery partners for on-demand ordering around Missoula.
            </p>
          </div>

          <div className="partner-grid">
            <article className="partner-card">
              <span>Delivery partner</span>
              <h3>Uber Eats</h3>
              <p>Use Uber Eats for quick delivery of ready-to-enjoy treats.</p>
              <a className="button button-primary" href="/" onClick={(event) => event.preventDefault()}>
                Add Uber Eats Link
              </a>
            </article>
            <article className="partner-card">
              <span>Delivery partner</span>
              <h3>DoorDash</h3>
              <p>Direct customers here for immediate delivery around Missoula.</p>
              <a className="button button-primary" href="/" onClick={(event) => event.preventDefault()}>
                Add DoorDash Link
              </a>
            </article>
            <article className="partner-card">
              <span>Delivery partner</span>
              <h3>More Apps</h3>
              <p>
                Add Grubhub or any additional ordering platform once those links are
                ready to publish.
              </p>
              <a className="button button-secondary" href="/" onClick={(event) => event.preventDefault()}>
                Add Another Link
              </a>
            </article>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default OrderPage;
