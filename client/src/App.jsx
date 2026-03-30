import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import OrderPage from './components/OrderPage';
import AboutPage from './components/AboutPage';
import ScoopShopsPage from './components/ScoopShopsPage';
import CheckoutPage from './components/CheckoutPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import AccountPage from './components/AccountPage';
import CartDrawer from './components/CartDrawer';
import ResetPasswordPage from './components/ResetPasswordPage';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboardPage from './components/AdminDashboardPage';
import CakeBuilderDrawer from './components/CakeBuilderDrawer';
import OrderSupportChat from './components/OrderSupportChat';

function readCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('riverCityCart') || '[]');
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  } catch {
    return 0;
  }
}

function readCart() {
  try {
    return JSON.parse(localStorage.getItem('riverCityCart') || '[]');
  } catch {
    return [];
  }
}

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const [cartOpen, setCartOpen] = useState(false);
  const [cakeBuilderOpen, setCakeBuilderOpen] = useState(false);
  const [initialCakeShape, setInitialCakeShape] = useState('Round Cake');
  const [editingCake, setEditingCake] = useState(null);
  const [cartCount, setCartCount] = useState(() => readCartCount());

  useEffect(() => {
    const syncCartCount = () => setCartCount(readCartCount());

    window.addEventListener('storage', syncCartCount);
    window.addEventListener('river-city-cart-updated', syncCartCount);

    return () => {
      window.removeEventListener('storage', syncCartCount);
      window.removeEventListener('river-city-cart-updated', syncCartCount);
    };
  }, []);

  useEffect(() => {
    const drawerOpen = cartOpen || cakeBuilderOpen;
    const previousOverflow = document.body.style.overflow;

    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [cakeBuilderOpen, cartOpen]);

  const addCakeToCart = (cakeProduct) => {
    const cart = readCart();
    const cartId = `${cakeProduct.id}:${cakeProduct.cakeBuild.shape}:${cakeProduct.size}:${cakeProduct.cakeBuild.topLayer}:${cakeProduct.cakeBuild.middle}:${cakeProduct.cakeBuild.bottomLayer}:${cakeProduct.cakeBuild.message}`;
    let nextCart;

    if (editingCake) {
      const replacementItem = {
        ...cakeProduct,
        cartId,
        quantity: editingCake.quantity
      };
      const cartWithoutOriginal = cart.filter((item) => item.cartId !== editingCake.cartId);
      const existing = cartWithoutOriginal.find((item) => item.cartId === cartId);

      nextCart = existing
        ? cartWithoutOriginal.map((item) =>
            item.cartId === cartId ? { ...item, quantity: item.quantity + editingCake.quantity } : item
          )
        : [...cartWithoutOriginal, replacementItem];
    } else {
      const existing = cart.find((item) => item.cartId === cartId);
      nextCart = existing
        ? cart.map((item) => (item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item))
        : [...cart, { ...cakeProduct, cartId, quantity: 1 }];
    }

    localStorage.setItem('riverCityCart', JSON.stringify(nextCart));
    window.dispatchEvent(new Event('river-city-cart-updated'));
    setEditingCake(null);
    setCakeBuilderOpen(false);
    setCartOpen(true);
    setCartCount(readCartCount());
  };

  const sharedPageProps = useMemo(
    () => ({
      openCart: () => setCartOpen(true),
      openCakeBuilder: (shape = 'Round Cake') => {
        setEditingCake(null);
        setInitialCakeShape(shape);
        setCakeBuilderOpen(true);
        setCartOpen(true);
      },
      cartCount
    }),
    [cartCount]
  );

  let page = <HomePage {...sharedPageProps} />;

  if (pathname === '/order') {
    page = <OrderPage {...sharedPageProps} />;
  } else if (pathname === '/checkout') {
    page = <CheckoutPage />;
  } else if (pathname === '/scoop-shops') {
    page = <ScoopShopsPage {...sharedPageProps} />;
  } else if (pathname === '/about') {
    page = <AboutPage {...sharedPageProps} />;
  } else if (pathname === '/login') {
    page = <LoginPage {...sharedPageProps} />;
  } else if (pathname === '/reset-password') {
    page = <ResetPasswordPage {...sharedPageProps} />;
  } else if (pathname === '/signup') {
    page = <SignupPage {...sharedPageProps} />;
  } else if (pathname === '/account') {
    page = <AccountPage {...sharedPageProps} />;
  } else if (pathname === '/admin/login') {
    page = <AdminLoginPage />;
  } else if (pathname === '/admin') {
    page = <AdminDashboardPage />;
  }

  return (
    <div className="site-shell">
      {page}
      {cartOpen || cakeBuilderOpen ? (
        <button
          type="button"
          className="cart-backdrop"
          onClick={() => {
            setCartOpen(false);
            setEditingCake(null);
            setCakeBuilderOpen(false);
          }}
          aria-label="Close cart and drawers"
        />
      ) : null}
      <CakeBuilderDrawer
        open={cakeBuilderOpen}
        withCart={cartOpen}
        onClose={() => {
          setEditingCake(null);
          setCakeBuilderOpen(false);
        }}
        onAddCake={addCakeToCart}
        initialShape={initialCakeShape}
        initialCake={editingCake}
      />
      <OrderSupportChat />
      <CartDrawer
        open={cartOpen}
        withCakeBuilder={cakeBuilderOpen}
        onClose={() => setCartOpen(false)}
        onEditCake={(item) => {
          setEditingCake(item);
          setInitialCakeShape(item.cakeBuild?.shape || 'Round Cake');
          setCakeBuilderOpen(true);
          setCartOpen(true);
        }}
      />
    </div>
  );
}

export default App;
