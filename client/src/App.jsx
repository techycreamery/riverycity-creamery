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

function readCartCount() {
  try {
    const cart = JSON.parse(localStorage.getItem('riverCityCart') || '[]');
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  } catch {
    return 0;
  }
}

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const [cartOpen, setCartOpen] = useState(false);
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

  const sharedPageProps = useMemo(
    () => ({
      openCart: () => setCartOpen(true),
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
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
