import React, { useState } from 'react';
import textLogo from '../assets/Text Logo.png';

function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to sign in.');
      }

      localStorage.setItem('riverCityAdminSession', JSON.stringify(payload));
      window.location.assign('/admin');
    } catch (submitError) {
      setError(submitError.message);
      setLoading(false);
    }
  };

  return (
    <section className="admin-shell">
      <div className="section">
        <div className="admin-login-card">
          <img className="brand-wordmark admin-login-logo" src={textLogo} alt="River City Creamery" />
          <div className="admin-login-copy">
            <span className="eyebrow">Admin</span>
            <h1>Manage orders, products, customers, and campaigns.</h1>
            <p>Use your admin credentials to open the River City back office.</p>
          </div>
          <form className="account-card admin-login-form" onSubmit={handleSubmit}>
            <label>
              Admin Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Password
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </label>
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            {error ? <p className="account-error">{error}</p> : null}
          </form>
        </div>
      </div>
    </section>
  );
}

export default AdminLoginPage;
