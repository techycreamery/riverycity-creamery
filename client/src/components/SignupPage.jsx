import React, { useState } from 'react';
import Footer from './Footer';
import SiteHeader from './SiteHeader';

function SignupPage({ openCart, cartCount = 0 }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [socialMessage, setSocialMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const accounts = JSON.parse(localStorage.getItem('riverCityAccounts') || '[]');
    const exists = accounts.some((item) => item.email.toLowerCase() === form.email.toLowerCase());

    if (exists) {
      setError('An account with that email already exists.');
      return;
    }

    const newAccount = {
      ...form,
      rewardsPoints: 125,
      tier: 'Neighborhood Regular',
      subscriptions: [
        {
          name: 'Monthly Pint Club',
          status: 'Available to start'
        }
      ]
    };

    localStorage.setItem('riverCityAccounts', JSON.stringify([...accounts, newAccount]));
    localStorage.setItem(
      'riverCityCurrentUser',
      JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email
      })
    );
    window.location.assign('/account');
  };

  const handleSocialSignup = (provider) => {
    setSocialMessage(
      `${provider} sign-up is ready for integration, but still needs live OAuth credentials and redirect setup.`
    );
  };

  return (
    <>
      <section className="account-hero">
        <div className="section">
          <SiteHeader
            openCart={openCart}
            cartCount={cartCount}
            secondaryLink={{ href: '/login', label: 'Login' }}
          />
          <div className="account-page-grid">
            <div className="account-page-copy">
              <span className="eyebrow">Create Account</span>
              <h1>Save orders, track rewards, and manage subscriptions.</h1>
              <p>
                Create a customer account to keep your order history in one place and
                unlock rewards and recurring take-home plans.
              </p>
            </div>
            <form className="account-card" onSubmit={handleSubmit}>
              <h2>Sign Up</h2>
              <div className="social-auth-group">
                <button type="button" className="social-auth-button" onClick={() => handleSocialSignup('Google')}>
                  Continue with Google
                </button>
                <button type="button" className="social-auth-button" onClick={() => handleSocialSignup('Facebook')}>
                  Continue with Facebook
                </button>
                <button type="button" className="social-auth-button" onClick={() => handleSocialSignup('Apple')}>
                  Continue with Apple
                </button>
              </div>
              {socialMessage ? <p className="account-helper">{socialMessage}</p> : null}
              <div className="account-divider">
                <span>or create an account with email</span>
              </div>
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
                Password
                <input type="password" name="password" value={form.password} onChange={handleChange} required />
              </label>
              <button type="submit" className="button button-primary">
                Create Account
              </button>
              {error ? <p className="account-error">{error}</p> : null}
              <p className="account-helper">
                Already have an account? <a href="/login">Login</a>.
              </p>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default SignupPage;
