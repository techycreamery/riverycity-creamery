import React from 'react';
import Footer from './Footer';
import SiteHeader from './SiteHeader';

function readCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('riverCityCurrentUser') || 'null');
  } catch {
    return null;
  }
}

function readAccounts() {
  try {
    return JSON.parse(localStorage.getItem('riverCityAccounts') || '[]');
  } catch {
    return [];
  }
}

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem('riverCityOrders') || '[]');
  } catch {
    return [];
  }
}

function AccountPage({ openCart, cartCount = 0 }) {
  const currentUser = readCurrentUser();

  if (!currentUser) {
    window.location.assign('/login');
    return null;
  }

  const account = readAccounts().find(
    (item) => item.email.toLowerCase() === currentUser.email.toLowerCase()
  );
  const orders = readOrders().filter(
    (item) => item.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  const logout = () => {
    localStorage.removeItem('riverCityCurrentUser');
    window.location.assign('/');
  };

  return (
    <>
      <section className="account-hero">
        <div className="section">
          <SiteHeader
            openCart={openCart}
            cartCount={cartCount}
            secondaryAction={{ label: 'Logout', onClick: logout }}
          />

          <div className="account-page-copy">
            <span className="eyebrow">Customer Account</span>
            <h1>
              {currentUser.firstName} {currentUser.lastName}
            </h1>
            <p>{currentUser.email}</p>
          </div>

          <div className="account-dashboard">
            <section className="account-card">
              <h2>Previous Orders</h2>
              {orders.length ? (
                orders.map((order) => (
                  <article className="account-list-item" key={order.id}>
                    <strong>{order.summary}</strong>
                    <span>{order.date}</span>
                    <span>{order.total}</span>
                  </article>
                ))
              ) : (
                <p className="account-helper">No saved orders yet. Place an order to see it here.</p>
              )}
            </section>

            <section className="account-card">
              <h2>Rewards</h2>
              <article className="account-list-item">
                <strong>{account?.tier || 'Neighborhood Regular'}</strong>
                <span>{account?.rewardsPoints || 125} points available</span>
                <span>Next reward at 200 points</span>
              </article>
            </section>

            <section className="account-card">
              <h2>Subscriptions</h2>
              {(account?.subscriptions || []).map((subscription) => (
                <article className="account-list-item" key={subscription.name}>
                  <strong>{subscription.name}</strong>
                  <span>{subscription.status}</span>
                </article>
              ))}
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default AccountPage;
