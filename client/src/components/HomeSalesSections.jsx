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

const exploreSections = [
  {
    id: 'explore-flavors',
    label: 'Flavors',
    title: 'Signature scoops and take-home flavors.',
    copy: 'Point customers to the classics, seasonal rotations, and freezer-ready favorites that move fastest online.',
    image: strawberryTop,
    ctaHref: '/order',
    ctaLabel: 'Shop Flavors',
    secondaryHref: '/order?filter=Prepackaged',
    secondaryLabel: 'Take Home Menu',
    highlights: ['Seasonal favorites', 'Classic scoops', 'Take-home pints']
  },
  {
    id: 'explore-bundles',
    label: 'Bundles',
    title: 'Bundled dessert drops for faster checkout.',
    copy: 'Show customers the easiest way to order for a family night, office treat, or freezer restock in one click.',
    image: coconutTop,
    ctaHref: '/order?filter=Bundles',
    ctaLabel: 'Browse Bundles',
    secondaryHref: '/order?filter=Party Boxes',
    secondaryLabel: 'Party Boxes',
    highlights: ['Family night kits', 'Group orders', 'Party-ready extras']
  },
  {
    id: 'explore-new-arrivals',
    label: 'New Arrivals',
    title: 'Spotlight what just hit the menu.',
    copy: 'Use the homepage to surface fresh flavor drops, limited-run builds, and anything customers should grab before it rotates out.',
    image: cottonCandyTop,
    ctaHref: '/order',
    ctaLabel: 'See New Arrivals',
    secondaryHref: '/order?filter=Subscription',
    secondaryLabel: 'Keep Me Updated',
    highlights: ['Limited runs', 'Seasonal builds', 'Fresh drops']
  },
  {
    id: 'explore-gluten-free',
    label: 'Gluten Free',
    title: 'Make gluten-free options easy to find.',
    copy: 'Give shoppers a direct section to start from when they need a simpler ingredient path and quick confidence.',
    image: lemonTop,
    ctaHref: '/order',
    ctaLabel: 'Explore Gluten Free',
    secondaryHref: '/about',
    secondaryLabel: 'Ingredient Questions',
    highlights: ['Simpler ingredient path', 'Quick filter destination', 'Confidence-first shopping']
  },
  {
    id: 'explore-fat-free',
    label: 'Fat Free',
    title: 'Feature lighter picks without burying them.',
    copy: 'This section can call out leaner menu options, rotating sorbet-style offerings, and faster paths for preference-led shoppers.',
    image: mintTop,
    ctaHref: '/order',
    ctaLabel: 'See Fat Free Options',
    secondaryHref: '/scoop-shops',
    secondaryLabel: 'Ask In Shop',
    highlights: ['Lighter choices', 'Sorbet-style options', 'Preference-led browsing']
  },
  {
    id: 'explore-dairy-free',
    label: 'Dairy Free',
    title: 'Give dairy-free guests their own starting point.',
    copy: 'Make it obvious where non-dairy shoppers should begin, with a section that promotes alternative bases and current availability.',
    image: chocolateTop,
    ctaHref: '/order',
    ctaLabel: 'Shop Dairy Free',
    secondaryHref: '/about',
    secondaryLabel: 'Learn More',
    highlights: ['Non-dairy bases', 'Current availability', 'Alternative treats']
  },
  {
    id: 'explore-online-exclusives',
    label: 'Online Exclusives',
    title: 'Reserve digital-only offers for homepage discovery.',
    copy: 'Use this section for preorder drops, web-only bundles, and special checkout incentives that reward customers for ordering direct.',
    image: cottonCandyTop,
    ctaHref: '/order',
    ctaLabel: 'See Exclusives',
    secondaryHref: '/checkout',
    secondaryLabel: 'Start Checkout',
    highlights: ['Web-only drops', 'Preorder exclusives', 'Direct-order perks']
  }
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

      {exploreSections.map((section, index) => (
        <section
          key={section.id}
          className={`content-block home-explore-block${index % 2 === 1 ? ' home-explore-block-alt' : ''}`}
          id={section.id}
        >
          <div className="section">
            <div className="home-explore-layout">
              <div className="home-explore-copy">
                <span className="eyebrow">{section.label}</span>
                <h2>{section.title}</h2>
                <p>{section.copy}</p>
                <div className="feature-pills">
                  {section.highlights.map((highlight) => (
                    <span key={highlight}>{highlight}</span>
                  ))}
                </div>
                <div className="hero-actions">
                  <a className="button button-primary" href={section.ctaHref}>
                    {section.ctaLabel}
                  </a>
                  <a className="button button-secondary" href={section.secondaryHref}>
                    {section.secondaryLabel}
                  </a>
                </div>
              </div>

              <article className="sales-card home-explore-card">
                <img className="sales-image" src={section.image} alt={section.label} />
                <div className="sales-copy">
                  <h3>{section.label}</h3>
                  <p>{section.copy}</p>
                  <a className="button button-secondary" href={section.ctaHref}>
                    Jump In
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>
      ))}

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
