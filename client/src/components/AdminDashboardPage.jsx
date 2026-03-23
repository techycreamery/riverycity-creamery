import React, { useEffect, useMemo, useState } from 'react';
import textLogo from '../assets/Text Logo.png';

const tabs = ['Orders', 'Products', 'Customers', 'Messages', 'Campaigns'];

function readAdminSession() {
  try {
    return JSON.parse(localStorage.getItem('riverCityAdminSession') || 'null');
  } catch {
    return null;
  }
}

function currency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0);
}

function AdminDashboardPage() {
  const session = readAdminSession();
  const [activeTab, setActiveTab] = useState('Orders');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    status: 'Active',
    description: ''
  });
  const [messageForm, setMessageForm] = useState({
    customerName: '',
    customerEmail: '',
    channel: 'Email',
    subject: '',
    body: ''
  });
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    channel: 'Email',
    audience: '',
    scheduledFor: '',
    content: '',
    status: 'Draft'
  });

  const authHeaders = useMemo(() => {
    return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
  }, [session]);

  useEffect(() => {
    if (!session?.token) {
      window.location.assign('/admin/login');
      return;
    }

    let cancelled = false;

    async function loadAdmin() {
      setLoading(true);
      setError('');

      try {
        const [overviewResponse, ordersResponse, productsResponse, customersResponse, messagesResponse, campaignsResponse] =
          await Promise.all([
            fetch('/api/admin/overview', { headers: authHeaders }),
            fetch('/api/admin/orders', { headers: authHeaders }),
            fetch('/api/admin/products', { headers: authHeaders }),
            fetch('/api/admin/customers', { headers: authHeaders }),
            fetch('/api/admin/messages', { headers: authHeaders }),
            fetch('/api/admin/campaigns', { headers: authHeaders })
          ]);

        const responses = await Promise.all([
          overviewResponse.json(),
          ordersResponse.json(),
          productsResponse.json(),
          customersResponse.json(),
          messagesResponse.json(),
          campaignsResponse.json()
        ]);

        if ([overviewResponse, ordersResponse, productsResponse, customersResponse, messagesResponse, campaignsResponse].some((response) => !response.ok)) {
          throw new Error(responses.find((payload) => payload.error)?.error || 'Unable to load admin data.');
        }

        if (!cancelled) {
          setOverview(responses[0].totals);
          setOrders(responses[1].orders || []);
          setProducts(responses[2].products || []);
          setCustomers(responses[3].customers || []);
          setMessages(responses[4].messages || []);
          setCampaigns(responses[5].campaigns || []);
          setLoading(false);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
          setLoading(false);
        }
      }
    }

    loadAdmin();

    return () => {
      cancelled = true;
    };
  }, [authHeaders, session]);

  const logout = () => {
    localStorage.removeItem('riverCityAdminSession');
    window.location.assign('/admin/login');
  };

  const postAdmin = async (path, body) => {
    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify(body)
    });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || 'Request failed.');
    }

    return payload;
  };

  const submitProduct = async (event) => {
    event.preventDefault();
    const created = await postAdmin('/api/admin/products', {
      ...productForm,
      price: Number(productForm.price)
    });
    setProducts((current) => [created, ...current]);
    setProductForm({ name: '', category: '', price: '', status: 'Active', description: '' });
  };

  const submitMessage = async (event) => {
    event.preventDefault();
    const created = await postAdmin('/api/admin/messages', messageForm);
    setMessages((current) => [created, ...current]);
    setMessageForm({
      customerName: '',
      customerEmail: '',
      channel: 'Email',
      subject: '',
      body: ''
    });
  };

  const submitCampaign = async (event) => {
    event.preventDefault();
    const created = await postAdmin('/api/admin/campaigns', campaignForm);
    setCampaigns((current) => [created, ...current]);
    setCampaignForm({
      name: '',
      channel: 'Email',
      audience: '',
      scheduledFor: '',
      content: '',
      status: 'Draft'
    });
  };

  if (!session?.token) {
    return null;
  }

  return (
    <section className="admin-shell">
      <div className="section admin-section">
        <div className="admin-topbar">
          <img className="brand-wordmark" src={textLogo} alt="River City Creamery" />
          <div className="admin-topbar-actions">
            <span>{session.admin?.email}</span>
            <button type="button" className="account-nav-button" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <div className="admin-heading">
          <span className="eyebrow">Back Office</span>
          <h1>Owner dashboard</h1>
          <p>Review live orders, manage what customers can buy, keep outreach organized, and plan campaigns.</p>
        </div>

        {loading ? <p className="account-helper">Loading admin data...</p> : null}
        {error ? <p className="account-error">{error}</p> : null}

        {overview ? (
          <div className="admin-metric-grid">
            <article className="admin-metric-card"><strong>{overview.orders}</strong><span>Orders</span></article>
            <article className="admin-metric-card"><strong>{overview.customers}</strong><span>Customers</span></article>
            <article className="admin-metric-card"><strong>{overview.products}</strong><span>Products</span></article>
            <article className="admin-metric-card"><strong>{overview.campaigns}</strong><span>Campaigns</span></article>
            <article className="admin-metric-card"><strong>{currency(overview.revenue)}</strong><span>Revenue</span></article>
          </div>
        ) : null}

        <div className="admin-tab-row">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`admin-tab${activeTab === tab ? ' admin-tab-active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Orders' ? (
          <div className="admin-card">
            <h2>Orders</h2>
            <div className="admin-list">
              {orders.map((order) => (
                <article className="admin-list-item" key={order._id}>
                  <strong>{order.customer?.fullName || order.customerName}</strong>
                  <span>{order.customer?.email || order.email}</span>
                  <span>{order.fulfillmentMethod} • {currency(order.total)} • {order.status}</span>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'Products' ? (
          <div className="admin-grid-two">
            <form className="admin-card admin-form-card" onSubmit={submitProduct}>
              <h2>Add Product</h2>
              <label>Name<input value={productForm.name} onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))} required /></label>
              <label>Category<input value={productForm.category} onChange={(event) => setProductForm((current) => ({ ...current, category: event.target.value }))} required /></label>
              <label>Price<input type="number" min="0" step="0.01" value={productForm.price} onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))} required /></label>
              <label>Status<input value={productForm.status} onChange={(event) => setProductForm((current) => ({ ...current, status: event.target.value }))} /></label>
              <label>Description<textarea rows="4" value={productForm.description} onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))} /></label>
              <button type="submit" className="button button-primary">Save Product</button>
            </form>
            <div className="admin-card">
              <h2>Current Products</h2>
              <div className="admin-list">
                {products.map((product) => (
                  <article className="admin-list-item" key={product._id}>
                    <strong>{product.name}</strong>
                    <span>{product.category}</span>
                    <span>{currency(product.price)} • {product.status}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'Customers' ? (
          <div className="admin-card">
            <h2>Customers</h2>
            <div className="admin-list">
              {customers.map((customer) => (
                <article className="admin-list-item" key={customer.customerEmail}>
                  <strong>{customer.customerName}</strong>
                  <span>{customer.customerEmail}</span>
                  <span>{customer.orderCount} orders • {currency(customer.totalSpend)}</span>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === 'Messages' ? (
          <div className="admin-grid-two">
            <form className="admin-card admin-form-card" onSubmit={submitMessage}>
              <h2>Message Customer</h2>
              <label>Name<input value={messageForm.customerName} onChange={(event) => setMessageForm((current) => ({ ...current, customerName: event.target.value }))} required /></label>
              <label>Email<input type="email" value={messageForm.customerEmail} onChange={(event) => setMessageForm((current) => ({ ...current, customerEmail: event.target.value }))} required /></label>
              <label>Channel<input value={messageForm.channel} onChange={(event) => setMessageForm((current) => ({ ...current, channel: event.target.value }))} /></label>
              <label>Subject<input value={messageForm.subject} onChange={(event) => setMessageForm((current) => ({ ...current, subject: event.target.value }))} required /></label>
              <label>Message<textarea rows="5" value={messageForm.body} onChange={(event) => setMessageForm((current) => ({ ...current, body: event.target.value }))} required /></label>
              <button type="submit" className="button button-primary">Log Message</button>
            </form>
            <div className="admin-card">
              <h2>Message History</h2>
              <div className="admin-list">
                {messages.map((message) => (
                  <article className="admin-list-item" key={message._id}>
                    <strong>{message.subject}</strong>
                    <span>{message.customerName} • {message.customerEmail}</span>
                    <span>{message.channel} • {message.status}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === 'Campaigns' ? (
          <div className="admin-grid-two">
            <form className="admin-card admin-form-card" onSubmit={submitCampaign}>
              <h2>Create Campaign</h2>
              <label>Name<input value={campaignForm.name} onChange={(event) => setCampaignForm((current) => ({ ...current, name: event.target.value }))} required /></label>
              <label>Audience<input value={campaignForm.audience} onChange={(event) => setCampaignForm((current) => ({ ...current, audience: event.target.value }))} required /></label>
              <label>Channel<input value={campaignForm.channel} onChange={(event) => setCampaignForm((current) => ({ ...current, channel: event.target.value }))} /></label>
              <label>Scheduled For<input value={campaignForm.scheduledFor} onChange={(event) => setCampaignForm((current) => ({ ...current, scheduledFor: event.target.value }))} placeholder="Apr 12, 10:00 AM" /></label>
              <label>Status<input value={campaignForm.status} onChange={(event) => setCampaignForm((current) => ({ ...current, status: event.target.value }))} /></label>
              <label>Content<textarea rows="6" value={campaignForm.content} onChange={(event) => setCampaignForm((current) => ({ ...current, content: event.target.value }))} required /></label>
              <button type="submit" className="button button-primary">Save Campaign</button>
            </form>
            <div className="admin-card">
              <h2>Campaigns</h2>
              <div className="admin-list">
                {campaigns.map((campaign) => (
                  <article className="admin-list-item" key={campaign._id}>
                    <strong>{campaign.name}</strong>
                    <span>{campaign.audience}</span>
                    <span>{campaign.channel} • {campaign.status}</span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default AdminDashboardPage;
