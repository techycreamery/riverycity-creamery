import React, { useState } from 'react';
import Footer from './Footer';
import SiteHeader from './SiteHeader';

function LoginPage({ openCart, cartCount = 0 }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [socialMessage, setSocialMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const accounts = JSON.parse(localStorage.getItem('riverCityAccounts') || '[]');
    const account = accounts.find(
      (item) => item.email.toLowerCase() === form.email.toLowerCase() && item.password === form.password
    );

    if (!account) {
      setError('We could not match that email and password.');
      return;
    }

    localStorage.setItem(
      'riverCityCurrentUser',
      JSON.stringify({
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email
      })
    );
    window.location.assign('/account');
  };

  const handleSocialLogin = (provider) => {
    setSocialMessage(
      `${provider} sign-in is ready for integration, but still needs live OAuth credentials and redirect setup.`
    );
  };

  return (
    <>
      <section className="account-hero">
        <div className="section">
          <SiteHeader openCart={openCart} cartCount={cartCount} />
          <div className="account-page-grid">
            <div className="account-page-copy">
              <span className="eyebrow">Customer Login</span>
              <h1>Sign in to see orders, rewards, and subscriptions.</h1>
              <p>
                Use your River City account to reorder favorites, check loyalty status,
                and manage your standing dessert habits.
              </p>
            </div>
            <form className="account-card" onSubmit={handleSubmit}>
              <h2>Login</h2>
              <div className="social-auth-group">
                <button type="button" className="social-auth-button" onClick={() => handleSocialLogin('Google')}>
                  Continue with Google
                </button>
                <button type="button" className="social-auth-button" onClick={() => handleSocialLogin('Facebook')}>
                  Continue with Facebook
                </button>
                <button type="button" className="social-auth-button" onClick={() => handleSocialLogin('Apple')}>
                  Continue with Apple
                </button>
              </div>
              {socialMessage ? <p className="account-helper">{socialMessage}</p> : null}
              <div className="account-divider">
                <span>or sign in with email</span>
              </div>
              <label>
                Email
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                Password
                <input type="password" name="password" value={form.password} onChange={handleChange} required />
              </label>
              <button type="submit" className="button button-primary">
                Sign In
              </button>
              {error ? <p className="account-error">{error}</p> : null}
              <p className="account-helper">
                <a href="/reset-password">Forgot your password?</a>
              </p>
              <p className="account-helper">
                New here? <a href="/signup">Create an account</a>.
              </p>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default LoginPage;
