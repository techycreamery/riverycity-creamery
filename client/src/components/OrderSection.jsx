import React, { useEffect, useMemo, useState } from 'react';
import cookiesCreamImage from '../assets/cookes_cream_top_order.jpg';
import cookiesCreamHoverImage from '../assets/cc_order.jpg';
import chocolateTopImage from '../assets/chocolate_top_home.jpg';
import chocolateSideImage from '../assets/chocolate_side.PNG';
import strawberryTopImage from '../assets/strawberry_top.jpg';
import lemonTopImage from '../assets/lemon_top_home.jpg';
import lemonSideImage from '../assets/lemon_side.PNG';
import coconutTopImage from '../assets/coconut_top_home.jpg';
import coconutSideImage from '../assets/coconut_side.PNG';
import cottonCandyTopImage from '../assets/cotton_candy_top_home.jpg';
import mintChocolateTopImage from '../assets/mint_chocolate_top_home.jpg';
import mintChocolateSideImage from '../assets/mint_chocolate_top.PNG';
import cookiesCreamSideImage from '../assets/cookies_cream_side.PNG';
import pintIcon from '../assets/pint_icon.png';
import quartIcon from '../assets/quart_icon.png';
import halfGallonIcon from '../assets/half_gallon_icon.png';

const takeHomeFlavors = [
  { name: 'Sweet Cream Vanilla', badge: 'Classic', imageClass: 'flavor-image-sweet-cream' },
  { name: 'French Vanilla', badge: 'Classic', imageClass: 'flavor-image-french-vanilla' },
  { name: 'Chocolate', badge: 'Classic', imageClass: 'flavor-image-chocolate' },
  { name: 'Strawberry', badge: 'Classic', imageClass: 'flavor-image-strawberry' },
  { name: 'Funfetti Cake', badge: 'Bakery Favorite', imageClass: 'flavor-image-funfetti-cake' },
  { name: 'Oatmeal Raisin', badge: 'Bakery Favorite', imageClass: 'flavor-image-oatmeal-raisin' },
  { name: 'Lemon', badge: 'Bright Favorite', imageClass: 'flavor-image-lemon' },
  { name: 'Cotton Candy', badge: 'Kids Favorite', imageClass: 'flavor-image-cotton-candy' },
  { name: 'Peanut Butter Cup', badge: 'Candy Favorite', imageClass: 'flavor-image-peanut-butter-cup' },
  { name: 'Pistachio', badge: 'Nutty Favorite', imageClass: 'flavor-image-pistachio' },
  { name: 'Butter Pecan', badge: 'Classic', imageClass: 'flavor-image-butter-pecan' },
  { name: 'Creamcicle', badge: 'Citrus Favorite', imageClass: 'flavor-image-creamcicle' },
  { name: 'Coconut', badge: 'Bright Favorite', imageClass: 'flavor-image-coconut' },
  { name: 'Cardamom', badge: 'House Favorite', imageClass: 'flavor-image-cardamom' },
  { name: 'Honeycomb', badge: 'House Favorite', imageClass: 'flavor-image-honeycomb' },
  { name: 'Huckleberry', badge: 'Montana Favorite', imageClass: 'flavor-image-huckleberry' },
  { name: 'Bubblegum', badge: 'Kids Favorite', imageClass: 'flavor-image-bubblegum' },
  { name: 'Coffee', badge: 'Cafe Favorite', imageClass: 'flavor-image-coffee' },
  { name: 'Cookies and Cream', badge: 'Crowd Favorite', imageClass: 'flavor-image-cookies-cream' },
  { name: 'Cookie Dough', badge: 'Crowd Favorite', imageClass: 'flavor-image-cookie-dough' },
  { name: 'Cherry', badge: 'Fruit Favorite', imageClass: 'flavor-image-cherry' },
  { name: 'Mint Chocolate Chip', badge: 'Classic', imageClass: 'flavor-image-mint-chocolate-chip' },
  { name: 'White Chocolate-Macadamia', badge: 'Bakery Favorite', imageClass: 'flavor-image-white-chocolate-macadamia' },
  { name: 'Rocky Road', badge: 'Classic', imageClass: 'flavor-image-rocky-road' },
  { name: 'Moose Tracks', badge: 'Crowd Favorite', imageClass: 'flavor-image-moose-tracks' },
  { name: 'Pup Trax', badge: 'Pet Flavor', imageClass: 'flavor-image-pup-trax' },
  { name: 'Kit Trax', badge: 'Pet Flavor', imageClass: 'flavor-image-kit-trax' }
];

const takeHomeSizes = [
  { name: 'Pint', price: 10, icon: pintIcon },
  { name: 'Quart', price: 18, icon: quartIcon },
  { name: 'Half Gallon', price: 30, icon: halfGallonIcon }
];

const cakeSizes = [
  { name: '7 Inch Cake', servings: '4 - 6 servings', price: 28.95 },
  { name: '8 Inch Cake', servings: '6 - 8 servings', price: 33.95 },
  { name: '9 Inch Cake', servings: '8 - 12 servings', price: 40.95 },
  { name: '11 Inch Cake', servings: '12 - 16 servings', price: 47.95 },
  { name: '13 Inch Cake', servings: '16 - 24 servings', price: 61.95 },
  { name: '15 Inch Cake', servings: '24 - 36 servings', price: 82.95 }
];

const cakeLayerOptions = ['Vanilla', 'Chocolate', 'Strawberry', 'Cake Batter'];
const cakeMiddleOptions = ['Crushed Oreos', 'Crushed Nilla Waffers', 'Crushed Graham Cracker'];

const menu = [
  {
    category: 'Prepackaged',
    items: [
      {
        id: 'take-home',
        name: 'Prepackaged',
        price: takeHomeSizes[0].price,
        description: 'Choose your size and favorite flavor for a freezer-ready prepackaged order.',
        requiresFlavor: true,
        requiresSize: true
      }
    ]
  },
  {
    category: 'Special Orders',
    items: [
      {
        id: 'ice-cream-sandwiches',
        name: 'Ice Cream Sandwiches',
        price: 8,
        description: 'Handheld ice cream sandwiches made for easy pickup and sharing.'
      },
      {
        id: 'affogato',
        name: 'Affogato',
        price: 7,
        description: 'Espresso poured over ice cream for a quick dessert-and-coffee hit.'
      },
      {
        id: 'homemade-waffle-cones',
        name: 'Homemade Waffle Cones',
        price: 5,
        description: 'Fresh waffle cones ready to pair with your take-home order.'
      },
      { id: 'party-box', name: 'Ice Cream Party in a Box', price: 42, description: 'A ready-to-serve kit with cups, toppings, and crowd-friendly portions.' },
      {
        id: 'ice-cream-cake',
        name: 'Ice Cream Cake',
        price: cakeSizes[0].price,
        description: 'Round cake sizes with two ice cream layers, a crunchy middle, and optional writing on top.',
        requiresCakeBuild: true,
        requiresCakeSize: true
      }
    ]
  }
];

const quickFilters = [
  'All',
  'Prepackaged',
  'Bundles',
  'Ice Cream Sandwiches',
  'Cakes',
  'Cones and Toppings',
  'Party Boxes',
  'Affogato',
  'Containers and Extras',
  'Subscription'
];

const flavorImageMap = {
  Chocolate: {
    defaultImage: chocolateSideImage,
    hoverImage: chocolateTopImage
  },
  Strawberry: {
    defaultImage: strawberryTopImage,
    hoverImage: strawberryTopImage
  },
  Lemon: {
    defaultImage: lemonSideImage,
    hoverImage: lemonTopImage
  },
  Coconut: {
    defaultImage: coconutSideImage,
    hoverImage: coconutTopImage
  },
  'Cotton Candy': {
    defaultImage: cottonCandyTopImage,
    hoverImage: cottonCandyTopImage
  },
  'Cookies and Cream': {
    defaultImage: cookiesCreamSideImage,
    hoverImage: cookiesCreamImage
  },
  'Mint Chocolate Chip': {
    defaultImage: mintChocolateTopImage,
    hoverImage: mintChocolateSideImage
  }
};

function getFlavorDescription(flavor) {
  if (flavor.badge === 'Classic') {
    return 'A dependable scoop-shop staple for freezer stocking.';
  }

  if (flavor.badge === 'Crowd Favorite') {
    return 'A customer favorite built for easy take-home ordering.';
  }

  if (flavor.badge === 'Kids Favorite') {
    return 'Bright, playful, and ready for family dessert runs.';
  }

  return 'Available for take-home ordering in pint, quart, or half gallon.';
}

function getProductDescription(product) {
  if (product.kind === 'take-home') {
    return getFlavorDescription(product);
  }

  if (product.id === 'ice-cream-cake') {
    return 'Choose your cake size, then finish the layer build in checkout notes if needed.';
  }

  return product.description;
}

function getQuickFilter(product) {
  if (product.id === 'ice-cream-cake') {
    return 'Cakes';
  }

  if (product.id === 'ice-cream-sandwiches') {
    return 'Ice Cream Sandwiches';
  }

  if (product.id === 'affogato') {
    return 'Affogato';
  }

  if (product.id === 'homemade-waffle-cones') {
    return 'Cones and Toppings';
  }

  return 'Party Boxes';
}

function getProductImages(product) {
  if (product.kind === 'take-home') {
    return (
      flavorImageMap[product.name] || {
        defaultImage: cookiesCreamImage,
        hoverImage: cookiesCreamHoverImage
      }
    );
  }

  return {
    defaultImage: cookiesCreamImage,
    hoverImage: cookiesCreamHoverImage
  };
}

function currency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function readCart() {
  try {
    return JSON.parse(localStorage.getItem('riverCityCart') || '[]');
  } catch {
    return [];
  }
}

function OrderSection({ openCart }) {
  const initialFilter = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    return quickFilters.includes(filter) ? filter : 'All';
  }, []);
  const [cart, setCart] = useState(() => readCart());
  const [selectedCakeSizes, setSelectedCakeSizes] = useState({
    'ice-cream-cake': cakeSizes[0].name
  });
  const [filterText, setFilterText] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState(initialFilter);
  const [cakeConfig, setCakeConfig] = useState({
    topLayer: cakeLayerOptions[0],
    middle: cakeMiddleOptions[0],
    bottomLayer: cakeLayerOptions[1],
    message: ''
  });
  const showcaseProducts = useMemo(() => {
    const takeHomeProducts = takeHomeFlavors.map((flavor) => ({
      ...flavor,
      kind: 'take-home',
      productKey: `take-home:${flavor.name}`,
      title: flavor.name,
      quickFilter: 'Prepackaged'
    }));

    const specialProducts = menu
      .flatMap((group) => group.items)
      .filter((item) => item.id !== 'take-home')
      .map((item) => ({
        ...item,
        kind: item.id === 'ice-cream-cake' ? 'cake' : 'special',
        productKey: item.id,
        title: item.name,
        quickFilter: getQuickFilter(item)
      }));

    return [...takeHomeProducts, ...specialProducts];
  }, []);

  const filteredShowcaseProducts = useMemo(() => {
    return showcaseProducts.filter((product) => {
      const matchesQuickFilter =
        activeQuickFilter === 'All' ||
        product.quickFilter === activeQuickFilter;
      const searchValue = `${product.title} ${product.badge || ''} ${product.description || ''}`.toLowerCase();
      const matchesText = !filterText || searchValue.includes(filterText.toLowerCase());

      return matchesQuickFilter && matchesText;
    });
  }, [activeQuickFilter, filterText, showcaseProducts]);

  useEffect(() => {
    const syncCart = () => setCart(readCart());

    window.addEventListener('storage', syncCart);
    window.addEventListener('river-city-cart-updated', syncCart);

    return () => {
      window.removeEventListener('storage', syncCart);
      window.removeEventListener('river-city-cart-updated', syncCart);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('riverCityCart', JSON.stringify(cart));
    window.dispatchEvent(new Event('river-city-cart-updated'));
  }, [cart]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeQuickFilter === 'All') {
      params.delete('filter');
    } else {
      params.set('filter', activeQuickFilter);
    }

    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}`;
    window.history.replaceState({}, '', nextUrl);
  }, [activeQuickFilter]);

  const handleCakeSizeSelect = (productId, value) => {
    setSelectedCakeSizes((current) => ({ ...current, [productId]: value }));
  };

  const handleCakeConfigChange = (event) => {
    const { name, value } = event.target;
    setCakeConfig((current) => ({ ...current, [name]: value }));
  };

  const addFlavorCardItem = (flavor, forcedSize) => {
    const selectedSize = forcedSize || takeHomeSizes[0].name;
    const selectedSizeConfig = takeHomeSizes.find((size) => size.name === selectedSize) || takeHomeSizes[0];
    const cartId = `take-home:${selectedSize}:${flavor.name}`;

    setCart((current) => {
      const existing = current.find((item) => item.cartId === cartId);

      if (existing) {
        return current.map((item) =>
          item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...current,
          {
            id: 'take-home',
            name: 'Prepacked',
            description: 'Choose your size and favorite flavor for a freezer-ready prepacked order.',
            cartId,
            price: selectedSizeConfig.price,
            flavor: flavor.name,
          size: selectedSize,
          quantity: 1
        }
      ];
    });

    if (openCart) {
      openCart();
    }
  };

  const addShowcaseProduct = (product) => {
    if (product.kind === 'take-home') {
      addFlavorCardItem(product);
      return;
    }

    if (product.id === 'ice-cream-cake') {
      const selectedCakeSize = selectedCakeSizes[product.id];
      const selectedCakeSizeConfig = cakeSizes.find((size) => size.name === selectedCakeSize) || cakeSizes[0];
      const cartId = `${product.id}:${selectedCakeSize}:${cakeConfig.topLayer}:${cakeConfig.middle}:${cakeConfig.bottomLayer}:${cakeConfig.message}`;

      setCart((current) => {
        const existing = current.find((item) => item.cartId === cartId);
        if (existing) {
          return current.map((item) =>
            item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item
          );
        }

        return [
          ...current,
          {
            ...product,
            cartId,
            price: selectedCakeSizeConfig.price,
            size: selectedCakeSize,
            cakeBuild: { ...cakeConfig },
            quantity: 1
          }
        ];
      });

      if (openCart) {
        openCart();
      }

      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.cartId === product.id);
      if (existing) {
        return current.map((item) => (item.cartId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }

      return [...current, { ...product, cartId: product.id, quantity: 1 }];
    });

    if (openCart) {
      openCart();
    }
  };

  return (
    <section className="content-block">
      <div className="section">
        <section className="catalog-group">
          <div className="section-title">
            <h2>All products.</h2>
          </div>

          <div className="flavor-filter-bar">
            <input
              className="flavor-filter-input"
              type="search"
              placeholder="Search products or flavors"
              value={filterText}
              onChange={(event) => setFilterText(event.target.value)}
            />
            <div className="flavor-filter-pills">
              {quickFilters.map((filterOption) => (
                <button
                  key={filterOption}
                  type="button"
                  className={`flavor-filter-pill${activeQuickFilter === filterOption ? ' flavor-filter-pill-active' : ''}`}
                  onClick={() => setActiveQuickFilter(filterOption)}
                >
                  {filterOption}
                </button>
              ))}
            </div>
          </div>

          <div className="flavor-showcase-grid">
            {filteredShowcaseProducts.map((product) => (
              <article className="flavor-showcase-card" key={product.productKey}>
                {(() => {
                  const productImages = getProductImages(product);

                  return (
                    <div className="flavor-showcase-image-frame">
                      <img className="flavor-showcase-image flavor-showcase-image-default" src={productImages.defaultImage} alt={product.title} />
                      <img className="flavor-showcase-image flavor-showcase-image-hover" src={productImages.hoverImage} alt="" aria-hidden="true" />
                      {product.kind === 'take-home' ? (
                        <>
                          <button
                            type="button"
                            className="flavor-image-add-button"
                            onClick={() => addFlavorCardItem(product, takeHomeSizes[0].name)}
                            aria-label={`Add ${product.title}`}
                          >
                            Add
                          </button>
                          <div className="take-home-image-size-buttons" role="group" aria-label={`Choose a size for ${product.name}`}>
                            {takeHomeSizes.map((size) => (
                              <button
                                key={size.name}
                                type="button"
                                className="take-home-image-size-button"
                                onClick={() => addFlavorCardItem(product, size.name)}
                                aria-label={`${product.name} ${size.name} ${currency(size.price)}`}
                              >
                                <img src={size.icon} alt="" aria-hidden="true" className="take-home-size-icon" />
                                <span className="take-home-image-size-price">{currency(size.price)}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <button type="button" className="flavor-image-add-button" onClick={() => addShowcaseProduct(product)}>
                          Add
                        </button>
                      )}
                    </div>
                  );
                })()}
                <div className="flavor-showcase-copy">
                  <strong>{product.title}</strong>
                  <span className="flavor-showcase-badge">{product.badge || product.quickFilter}</span>
                  <p>{getProductDescription(product)}</p>
                </div>
                {product.id === 'ice-cream-cake' ? (
                  <>
                    <label className="product-select-label">
                      <span>Cake Size</span>
                      <select
                        className="product-select"
                        value={selectedCakeSizes[product.id]}
                        onChange={(event) => handleCakeSizeSelect(product.id, event.target.value)}
                      >
                        {cakeSizes.map((size) => (
                          <option key={size.name} value={size.name}>
                            {size.name} - {size.servings} - {currency(size.price)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="cake-builder">
                      <label>
                        Top
                        <select className="product-select" name="topLayer" value={cakeConfig.topLayer} onChange={handleCakeConfigChange}>
                          {cakeLayerOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Middle
                        <select className="product-select" name="middle" value={cakeConfig.middle} onChange={handleCakeConfigChange}>
                          {cakeMiddleOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Bottom
                        <select className="product-select" name="bottomLayer" value={cakeConfig.bottomLayer} onChange={handleCakeConfigChange}>
                          {cakeLayerOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </>
                ) : null}
              </article>
            ))}
          </div>
          {!filteredShowcaseProducts.length ? (
            <p className="empty-state">No products match that filter yet.</p>
          ) : null}
        </section>

      </div>
    </section>
  );
}

export default OrderSection;
