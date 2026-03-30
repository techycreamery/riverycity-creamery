import React, { useEffect, useMemo, useState } from 'react';
import roundCakeIcon from '../assets/round_cake_icon.png';
import sheetCakeIcon from '../assets/sheet_cake_icon.png';

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
const cakeShapeOptions = [
  { name: 'Round Cake', icon: roundCakeIcon },
  { name: 'Sheet Cake', icon: sheetCakeIcon }
];

function currency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function defaultConfig(initialShape = cakeShapeOptions[0].name) {
  return {
    shape: initialShape,
    size: cakeSizes[0].name,
    topLayer: cakeLayerOptions[0],
    middle: cakeMiddleOptions[0],
    bottomLayer: cakeLayerOptions[1],
    message: ''
  };
}

function configFromCartItem(cartItem, initialShape) {
  if (!cartItem?.cakeBuild) {
    return defaultConfig(initialShape);
  }

  return {
    shape: cartItem.cakeBuild.shape || initialShape || cakeShapeOptions[0].name,
    size: cartItem.size || cakeSizes[0].name,
    topLayer: cartItem.cakeBuild.topLayer || cakeLayerOptions[0],
    middle: cartItem.cakeBuild.middle || cakeMiddleOptions[0],
    bottomLayer: cartItem.cakeBuild.bottomLayer || cakeLayerOptions[1],
    message: cartItem.cakeBuild.message || ''
  };
}

function CakeBuilderDrawer({ open, withCart, onClose, onAddCake, initialShape, initialCake }) {
  const [config, setConfig] = useState(() => defaultConfig(initialShape));

  useEffect(() => {
    if (open) {
      setConfig(configFromCartItem(initialCake, initialShape));
    }
  }, [initialCake, initialShape, open]);

  const selectedSize = useMemo(
    () => cakeSizes.find((size) => size.name === config.size) || cakeSizes[0],
    [config.size]
  );

  const submitCake = () => {
    onAddCake({
      id: 'ice-cream-cake',
      name: 'Ice Cream Cake',
      description: 'Custom ice cream cake',
      price: selectedSize.price,
      size: config.size,
      cakeBuild: {
        shape: config.shape,
        topLayer: config.topLayer,
        middle: config.middle,
        bottomLayer: config.bottomLayer,
        message: config.message
      }
    });
  };

  return (
    <aside
      className={`cake-builder-drawer${open ? ' cake-builder-drawer-open' : ''}${
        open && withCart ? ' cake-builder-drawer-with-cart' : ''
      }`}
    >
      <div className="cart-drawer-head">
        <h2>Build Your Cake</h2>
        <button type="button" className="cart-close" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="cake-builder-drawer-body">
        <section className="checkout-section">
          <h3>Cake Shape</h3>
          <div className="cake-shape-grid" role="group" aria-label="Choose a cake shape">
            {cakeShapeOptions.map((shape) => (
              <button
                key={shape.name}
                type="button"
                className={`cake-shape-button${config.shape === shape.name ? ' cake-shape-button-active' : ''}`}
                onClick={() => setConfig((current) => ({ ...current, shape: shape.name }))}
              >
                <img src={shape.icon} alt="" aria-hidden="true" className="cake-shape-icon" />
                <span>{shape.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="checkout-section">
          <h3>Cake Size</h3>
          <div className="cake-size-grid" role="group" aria-label="Choose a cake size">
            {cakeSizes.map((size) => (
              <button
                key={size.name}
                type="button"
                className={`cake-size-button${config.size === size.name ? ' cake-size-button-active' : ''}`}
                onClick={() => setConfig((current) => ({ ...current, size: size.name }))}
              >
                <strong>{size.name}</strong>
                <span>{size.servings}</span>
                <span>{currency(size.price)}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="checkout-section cake-builder">
          <h3>Layers</h3>
          <label>
            Top
            <select
              className="product-select"
              value={config.topLayer}
              onChange={(event) => setConfig((current) => ({ ...current, topLayer: event.target.value }))}
            >
              {cakeLayerOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Middle
            <select
              className="product-select"
              value={config.middle}
              onChange={(event) => setConfig((current) => ({ ...current, middle: event.target.value }))}
            >
              {cakeMiddleOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Bottom
            <select
              className="product-select"
              value={config.bottomLayer}
              onChange={(event) => setConfig((current) => ({ ...current, bottomLayer: event.target.value }))}
            >
              {cakeLayerOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            Writing On Top
            <input
              className="product-select"
              value={config.message}
              onChange={(event) => setConfig((current) => ({ ...current, message: event.target.value }))}
              placeholder="Happy Birthday Emma"
            />
          </label>
        </section>
      </div>

      <div className="cart-drawer-foot">
        <div className="cart-drawer-total">
          <span>Selected Cake</span>
          <strong>{currency(selectedSize.price)}</strong>
        </div>
        <button type="button" className="button button-primary" onClick={submitCake}>
          {initialCake ? 'Save Cake' : 'Add Cake To Cart'}
        </button>
      </div>
    </aside>
  );
}

export default CakeBuilderDrawer;
