import React, { useState } from 'react';
import Footer from './Footer';
import SiteHeader from './SiteHeader';

function ResetPasswordPage({ openCart, cartCount = 0 }) {
  const [form, setForm] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const accounts = JSON.parse(localStorage.getItem('riverCityAccounts') || '[]');
    const index = accounts.findIndex((item) => item.email.toLowerCase() === form.email.toLowerCase());

    if (index === -1) {
      setError('No account found for that email.');
      return;
    }

    const updatedAccounts = [...accounts];
    updatedAccounts[index] = {
      ...updatedAccounts[index],
      password: form.newPassword
    };

    localStorage.setItem('riverCityAccounts', JSON.stringify(updatedAccounts));
    setMessage('Password updated. You can now log in with the new password.');
    setForm({
      email: form.email,
      newPassword: '',
      confirmPassword: ''
    });
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
              <span className="eyebrow">Password Reset</span>
              <h1>Reset your account password.</h1>
              <p>
                Enter your account email and choose a new password to regain access
                to your River City account.
              </p>
            </div>
            <form className="account-card" onSubmit={handleSubmit}>
              <h2>Reset Password</h2>
              <label>
                Email
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                New Password
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit" className="button button-primary">
                Update Password
              </button>
              {message ? <p className="account-success">{message}</p> : null}
              {error ? <p className="account-error">{error}</p> : null}
              <p className="account-helper">
                Remembered it? <a href="/login">Back to login</a>.
              </p>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default ResetPasswordPage;
