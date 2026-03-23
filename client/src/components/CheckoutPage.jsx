import React, { useEffect, useMemo, useState } from 'react';
import textLogo from '../assets/Text Logo.png';
import Footer from './Footer';

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

function getMinDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function CheckoutPage() {
  const [cart, setCart] = useState(() => readCart());
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    fulfillmentMethod: 'pickup',
    address: '',
    pickupTime: '',
    deliveryWindow: '',
    notes: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    billingZip: ''
  });
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [deliveryWindows, setDeliveryWindows] = useState([]);
  const [deliveryWindowsStatus, setDeliveryWindowsStatus] = useState('idle');
  const minDateTime = getMinDateTime();

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

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
    let cancelled = false;

    async function loadDeliveryWindows() {
      setDeliveryWindowsStatus('loading');

      try {
        const response = await fetch('/api/delivery-windows');
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || 'Unable to load delivery windows.');
        }

        if (!cancelled) {
          setDeliveryWindows(payload.windows || []);
          setDeliveryWindowsStatus('ready');
        }
      } catch (error) {
        if (!cancelled) {
          setDeliveryWindowsStatus('error');
        }
      }
    }

    loadDeliveryWindows();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'fulfillmentMethod') {
      setForm((current) => ({
        ...current,
        fulfillmentMethod: value,
        address: value === 'delivery' ? current.address : '',
        deliveryWindow: value === 'delivery' ? current.deliveryWindow : '',
        pickupTime: value === 'pickup' ? current.pickupTime : ''
      }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cart.length) {
      setStatus({ type: 'error', message: 'Your cart is empty.' });
      return;
    }

    if (!form.cardName || !form.cardNumber || !form.expiry || !form.cvv || !form.billingZip) {
      setStatus({ type: 'error', message: 'Complete the payment section before checking out.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Submitting your order...' });

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fulfillmentMethod: form.fulfillmentMethod,
          pickupTime: form.pickupTime,
          deliveryWindow: form.deliveryWindow,
          notes: form.notes,
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            fullName: `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            phone: form.phone,
            address: form.address
          },
          total: Number(subtotal.toFixed(2)),
          items: cart.map(({ id, name, quantity, price, flavor, size, cakeBuild }) => ({
            productId: id,
            name,
            quantity,
            price,
            flavor,
            size,
            cakeBuild
          }))
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || payload.message || 'Unable to place order.');
      }

      const savedOrders = JSON.parse(localStorage.getItem('riverCityOrders') || '[]');
      localStorage.setItem(
        'riverCityOrders',
        JSON.stringify([
          {
            id: payload._id,
            email: payload.customer?.email || form.email,
            date: new Date().toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            }),
            summary: cart.map((item) => item.name).join(', '),
            total: currency(subtotal)
          },
          ...savedOrders
        ])
      );

      localStorage.setItem('riverCityCart', '[]');
      window.dispatchEvent(new Event('river-city-cart-updated'));
      setCart([]);
      setStatus({
        type: 'success',
        message: `Order received. Reference: ${payload._id?.slice(-6).toUpperCase() || 'NEW'}.`
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'There was a problem placing your order.'
      });
    }
  };

  return (
    <>
      <section className="account-hero">
        <div className="section">
          <div className="checkout-bar">
            <a className="brand" href="/">
              <img className="brand-wordmark" src={textLogo} alt="River City Creamery" />
            </a>
            <div className="checkout-links">
              <a href="/order">Back to Order</a>
            </div>
          </div>

          <div className="order-page-intro">
            <span className="eyebrow">Checkout</span>
            <h1>Complete your order.</h1>
            <p>Enter customer details, choose fulfillment, and finish payment in one place.</p>
          </div>

          <div className="checkout-layout">
            <form className="order-form checkout-form" onSubmit={handleSubmit}>
              <section className="checkout-section">
                <h2>Customer Information</h2>
                <label>
                  First Name
                  <input name="firstName" value={form.firstName} onChange={handleChange} required />
                </label>
                <label>
                  Last Name
                  <input name="lastName" value={form.lastName} onChange={handleChange} required />
                </label>
                <label>
                  Email
                  <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </label>
                <label>
                  Phone
                  <input name="phone" value={form.phone} onChange={handleChange} required />
                </label>
              </section>

              <section className="checkout-section">
                <h2>Fulfillment</h2>
                <label>
                  Fulfillment Method
                  <select name="fulfillmentMethod" value={form.fulfillmentMethod} onChange={handleChange}>
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Local delivery</option>
                  </select>
                </label>
                <label>
                  {form.fulfillmentMethod === 'delivery' ? 'Delivery address' : 'Pickup time'}
                  {form.fulfillmentMethod === 'delivery' ? (
                    <input name="address" value={form.address} onChange={handleChange} required />
                  ) : (
                    <input
                      type="datetime-local"
                      name="pickupTime"
                      value={form.pickupTime}
                      onChange={handleChange}
                      min={minDateTime}
                      required
                    />
                  )}
                </label>
                {form.fulfillmentMethod === 'delivery' ? (
                  <label>
                    Delivery Window
                    <div className="delivery-window-list">
                      {deliveryWindowsStatus === 'loading' ? (
                        <p className="delivery-window-message">Loading delivery windows...</p>
                      ) : null}
                      {deliveryWindowsStatus === 'error' ? (
                        <p className="delivery-window-message">Unable to load delivery windows right now.</p>
                      ) : null}
                      {deliveryWindowsStatus === 'ready'
                        ? deliveryWindows.map((window) => (
                            <label
                              key={window.id}
                              className={`delivery-window-option${
                                form.deliveryWindow === window.label ? ' delivery-window-option-selected' : ''
                              }`}
                            >
                              <input
                                type="radio"
                                name="deliveryWindow"
                                value={window.label}
                                checked={form.deliveryWindow === window.label}
                                onChange={handleChange}
                                required={form.fulfillmentMethod === 'delivery'}
                              />
                              <strong>{window.label}</strong>
                              <span>{window.date}</span>
                            </label>
                          ))
                        : null}
                    </div>
                  </label>
                ) : null}
                <label>
                  Notes
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Flavor requests, cake message, allergy notes, etc."
                  />
                </label>
              </section>

              <section className="checkout-section">
                <h2>Payment</h2>
                <label>
                  Name on Card
                  <input name="cardName" value={form.cardName} onChange={handleChange} required />
                </label>
                <label>
                  Card Number
                  <input name="cardNumber" value={form.cardNumber} onChange={handleChange} inputMode="numeric" required />
                </label>
                <div className="checkout-payment-grid">
                  <label>
                    Expiry
                    <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" required />
                  </label>
                  <label>
                    CVV
                    <input name="cvv" value={form.cvv} onChange={handleChange} inputMode="numeric" required />
                  </label>
                  <label>
                    Billing ZIP
                    <input name="billingZip" value={form.billingZip} onChange={handleChange} inputMode="numeric" required />
                  </label>
                </div>
              </section>

              <button type="submit" className="button button-primary">
                Submit Order
              </button>

              {status.type !== 'idle' ? (
                <p className={`order-message order-message-${status.type}`}>{status.message}</p>
              ) : null}
            </form>

            <aside className="order-panel">
              <div className="order-card">
                <div className="order-card-head">
                  <h3>Order Summary</h3>
                  <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                </div>

                <div className="cart-list">
                  {cart.length ? (
                    cart.map((item) => (
                      <div className="cart-item" key={item.cartId}>
                        <div>
                          <strong>{item.name}</strong>
                          {item.size ? <p className="cart-meta">Size: {item.size}</p> : null}
                          {item.flavor ? <p className="cart-meta">Flavor: {item.flavor}</p> : null}
                          <p>{item.quantity} x {currency(item.price)}</p>
                        </div>
                        <strong>{currency(item.price * item.quantity)}</strong>
                      </div>
                    ))
                  ) : (
                    <p className="empty-state">Your cart is empty.</p>
                  )}
                </div>

                <div className="order-total">
                  <span>Subtotal</span>
                  <strong>{currency(subtotal)}</strong>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default CheckoutPage;
