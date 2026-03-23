const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const CustomerMessage = require('../models/CustomerMessage');
const Campaign = require('../models/Campaign');
const inMemoryOrders = require('../lib/inMemoryOrders');
const inMemoryAdminStore = require('../lib/inMemoryAdminStore');

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@rivercitycreamery.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || 'river-city-admin-secret';

function signAdminToken(payload) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', ADMIN_TOKEN_SECRET)
    .update(encoded)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

function verifyAdminToken(token) {
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) {
    return null;
  }

  const expected = crypto
    .createHmac('sha256', ADMIN_TOKEN_SECRET)
    .update(encoded)
    .digest('base64url');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  const payload = verifyAdminToken(token);

  if (!payload || payload.email !== ADMIN_EMAIL) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  req.admin = payload;
  return next();
}

async function listOrders() {
  if (mongoose.connection.readyState === 1) {
    return Order.find().sort({ createdAt: -1 }).lean();
  }

  return inMemoryOrders.listOrders();
}

async function listProducts() {
  if (mongoose.connection.readyState === 1) {
    return Product.find().sort({ createdAt: -1 }).lean();
  }

  return inMemoryAdminStore.listProducts();
}

async function createProduct(data) {
  if (mongoose.connection.readyState === 1) {
    return new Product(data).save();
  }

  return inMemoryAdminStore.createProduct(data);
}

async function listMessages() {
  if (mongoose.connection.readyState === 1) {
    return CustomerMessage.find().sort({ createdAt: -1 }).lean();
  }

  return inMemoryAdminStore.listMessages();
}

async function createMessage(data) {
  if (mongoose.connection.readyState === 1) {
    return new CustomerMessage(data).save();
  }

  return inMemoryAdminStore.createMessage(data);
}

async function listCampaigns() {
  if (mongoose.connection.readyState === 1) {
    return Campaign.find().sort({ createdAt: -1 }).lean();
  }

  return inMemoryAdminStore.listCampaigns();
}

async function createCampaign(data) {
  if (mongoose.connection.readyState === 1) {
    return new Campaign(data).save();
  }

  return inMemoryAdminStore.createCampaign(data);
}

function buildCustomers(orders) {
  const byEmail = new Map();

  orders.forEach((order) => {
    const customer = order.customer || {
      firstName: order.firstName,
      lastName: order.lastName,
      fullName: order.customerName || `${order.firstName || ''} ${order.lastName || ''}`.trim(),
      email: order.email,
      phone: order.phone,
      address: order.address
    };
    const key = customer.email.toLowerCase();
    const existing = byEmail.get(key);
    const nextCount = (existing?.orderCount || 0) + 1;
    const nextSpend = (existing?.totalSpend || 0) + Number(order.total || 0);

    byEmail.set(key, {
      customerName: customer.fullName || `${customer.firstName} ${customer.lastName}`.trim(),
      customerEmail: customer.email,
      phone: customer.phone,
      orderCount: nextCount,
      totalSpend: Number(nextSpend.toFixed(2)),
      lastOrderAt: existing?.lastOrderAt && new Date(existing.lastOrderAt) > new Date(order.createdAt)
        ? existing.lastOrderAt
        : order.createdAt
    });
  });

  return Array.from(byEmail.values()).sort((a, b) => b.orderCount - a.orderCount);
}

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }

  const token = signAdminToken({
    email: ADMIN_EMAIL,
    role: 'admin',
    issuedAt: Date.now()
  });

  return res.json({
    token,
    admin: {
      email: ADMIN_EMAIL,
      role: 'admin'
    }
  });
});

router.get('/overview', requireAdmin, async (req, res) => {
  try {
    const [orders, products, campaigns] = await Promise.all([
      listOrders(),
      listProducts(),
      listCampaigns()
    ]);
    const customers = buildCustomers(orders);
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

    res.json({
      totals: {
        orders: orders.length,
        customers: customers.length,
        products: products.length,
        campaigns: campaigns.length,
        revenue: Number(revenue.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await listOrders();
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/products', requireAdmin, async (req, res) => {
  try {
    const products = await listProducts();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/products', requireAdmin, async (req, res) => {
  try {
    const { name, category, price, status, description } = req.body;

    if (!name || !category || Number(price) < 0) {
      return res.status(400).json({ error: 'Name, category, and valid price are required.' });
    }

    const product = await createProduct({
      name,
      category,
      price: Number(price),
      status: status || 'Active',
      description
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/customers', requireAdmin, async (req, res) => {
  try {
    const orders = await listOrders();
    res.json({ customers: buildCustomers(orders) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/messages', requireAdmin, async (req, res) => {
  try {
    const messages = await listMessages();
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/messages', requireAdmin, async (req, res) => {
  try {
    const { customerName, customerEmail, channel, subject, body, status } = req.body;

    if (!customerName || !customerEmail || !subject || !body) {
      return res.status(400).json({ error: 'Customer, email, subject, and message body are required.' });
    }

    const message = await createMessage({
      customerName,
      customerEmail,
      channel: channel || 'Email',
      subject,
      body,
      status: status || 'Sent'
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/campaigns', requireAdmin, async (req, res) => {
  try {
    const campaigns = await listCampaigns();
    res.json({ campaigns });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/campaigns', requireAdmin, async (req, res) => {
  try {
    const { name, channel, audience, scheduledFor, content, status } = req.body;

    if (!name || !audience || !content) {
      return res.status(400).json({ error: 'Campaign name, audience, and content are required.' });
    }

    const campaign = await createCampaign({
      name,
      channel: channel || 'Email',
      audience,
      scheduledFor,
      content,
      status: status || 'Draft'
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
