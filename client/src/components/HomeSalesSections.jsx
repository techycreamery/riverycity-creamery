import React from 'react';
import chocolateTop from '../assets/chocolate_top_home.jpg';
import coconutTop from '../assets/coconut_top_home.jpg';
import lemonTop from '../assets/lemon_top_home.jpg';
import strawberryTop from '../assets/strawberry_top.jpg';
import mintTop from '../assets/mint_chocolate_top_home.jpg';
import cottonCandyTop from '../assets/cotton_candy_top_home.jpg';

const featuredProducts = [
  {
    title: 'Take Home Favorites',
    copy: 'Stock the freezer with pints, quarts, and half gallons in crowd favorites and rotating seasonal flavors.',
    image: strawberryTop,
    cta: '/order'
  },
  {
    title: 'Custom Ice Cream Cakes',
    copy: 'Build round cakes with layered flavors, crunchy middles, and a message on top for birthdays and celebrations.',
    image: chocolateTop,
    cta: '/order'
  },
  {
    title: 'Party in a Box',
    copy: 'Bring home a full dessert setup with cups, toppings, and enough scoop energy for the whole group.',
    image: coconutTop,
    cta: '/order'
  }
];

const flavorHighlights = [
  { name: 'Lemon', image: lemonTop },
  { name: 'Mint Chocolate Chip', image: mintTop },
  { name: 'Cotton Candy', image: cottonCandyTop }
];

function HomeSalesSections() {
  return (
    <>
      <section className="content-block" id="featured">
        <div className="section">
          <div className="section-title">
            <h2>Order-first favorites built to sell.</h2>
            <p>
              The fastest path on this site should be simple: pick what you want, choose
              a size or build, and place the order.
            </p>
          </div>

          <div className="sales-grid">
            {featuredProducts.map((product) => (
              <article className="sales-card" key={product.title}>
                <img className="sales-image" src={product.image} alt={product.title} />
                <div className="sales-copy">
                  <h3>{product.title}</h3>
                  <p>{product.copy}</p>
                  <a className="button button-primary" href={product.cta}>
                    Buy Now
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-block">
        <div className="section">
          <div className="section-title">
            <h2>Featured flavors customers can take home today.</h2>
            <p>
              Build urgency with recognizable, craveable flavors and quick paths into the
              order flow.
            </p>
          </div>

          <div className="flavor-highlight-grid">
            {flavorHighlights.map((item) => (
              <article className="flavor-highlight-card" key={item.name}>
                <img className="flavor-highlight-image" src={item.image} alt={item.name} />
                <div className="flavor-highlight-copy">
                  <h3>{item.name}</h3>
                  <a className="button button-secondary" href="/order">
                    Order This Flavor
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-block">
        <div className="section promo-band">
          <div>
            <span className="promo-label">Fastest Conversion Path</span>
            <h2>Ready to order?</h2>
            <p>Go straight to take-home pints, custom cakes, and party packs.</p>
          </div>
          <div className="promo-actions">
            <a className="button button-primary" href="/order">
              Start Order
            </a>
            <a className="button button-secondary" href="/order#delivery">
              Delivery Partners
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomeSalesSections;
