import React, { useEffect, useMemo, useState } from 'react';

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

function CartDrawer({ open, withCakeBuilder, onClose, onEditCake }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const syncCart = () => setCart(readCart());

    syncCart();
    window.addEventListener('storage', syncCart);
    window.addEventListener('river-city-cart-updated', syncCart);

    return () => {
      window.removeEventListener('storage', syncCart);
      window.removeEventListener('river-city-cart-updated', syncCart);
    };
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const writeCart = (nextCart) => {
    localStorage.setItem('riverCityCart', JSON.stringify(nextCart));
    setCart(nextCart);
    window.dispatchEvent(new Event('river-city-cart-updated'));
  };

  const removeItem = (cartId) => {
    writeCart(cart.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => {
    writeCart([]);
  };

  return (
    <>
      <aside className={`cart-drawer${open ? ' cart-drawer-open' : ''}${withCakeBuilder ? ' cart-drawer-with-cake-builder' : ''}`}>
        <div className="cart-drawer-head">
          <h2>
            Your Cart <span className="cart-drawer-count">({itemCount} Items)</span>
          </h2>
          <button type="button" className="cart-close" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="cart-drawer-body">
          {cart.length ? (
            cart.map((item) => (
              <article className="cart-drawer-item" key={item.cartId}>
                <div className="cart-drawer-item-main">
                  <strong>{item.name}</strong>
                  <div className="cart-drawer-meta">
                    {item.size ? <span>Size: {item.size}</span> : null}
                    {item.flavor ? <span>Flavor: {item.flavor}</span> : null}
                    {item.cakeBuild?.message ? <span>Top: {item.cakeBuild.message}</span> : null}
                    <span>
                      {item.quantity} x {currency(item.price)}
                    </span>
                  </div>
                  {item.id === 'ice-cream-cake' ? (
                    <button
                      type="button"
                      className="cart-edit-button"
                      onClick={() => onEditCake && onEditCake(item)}
                    >
                      Edit Cake
                    </button>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="cart-remove-button"
                  onClick={() => removeItem(item.cartId)}
                  aria-label="Remove item"
                >
                  <span aria-hidden="true">🗑</span>
                </button>
              </article>
            ))
          ) : (
            <p className="account-helper">Your cart is empty.</p>
          )}
        </div>

        <div className="cart-drawer-foot">
          <div className="cart-drawer-total">
            <span>Subtotal</span>
            <strong>{currency(subtotal)}</strong>
          </div>
          {cart.length ? (
            <button type="button" className="clear-cart-button" onClick={clearCart}>
              Clear Cart
            </button>
          ) : null}
          <a className="button button-primary" href="/checkout" onClick={onClose}>
            Checkout
          </a>
        </div>
      </aside>
    </>
  );
}

export default CartDrawer;
