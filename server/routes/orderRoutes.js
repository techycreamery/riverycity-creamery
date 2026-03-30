const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Order = require('../models/Order');
const inMemoryOrders = require('../lib/inMemoryOrders');
const { formatOrderForCustomer, lookupOrder } = require('../lib/orderLookup');

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const {
      customer,
      fulfillmentMethod,
      pickupTime,
      deliveryWindow,
      notes,
      items,
      total
    } = req.body;

    const normalizedCustomer = {
      firstName: customer?.firstName || req.body.firstName,
      lastName: customer?.lastName || req.body.lastName,
      fullName: customer?.fullName || req.body.customerName || `${customer?.firstName || req.body.firstName || ''} ${customer?.lastName || req.body.lastName || ''}`.trim(),
      email: customer?.email || req.body.email,
      phone: customer?.phone || req.body.phone,
      address: customer?.address || req.body.address
    };

    if (!normalizedCustomer.firstName || !normalizedCustomer.lastName || !normalizedCustomer.email || !normalizedCustomer.phone) {
      return res.status(400).json({ error: 'First name, last name, email, and phone are required.' });
    }

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'Order must include at least one item.' });
    }

    if (fulfillmentMethod === 'delivery' && !normalizedCustomer.address) {
      return res.status(400).json({ error: 'Delivery orders require an address.' });
    }

    if (fulfillmentMethod === 'delivery' && !deliveryWindow) {
      return res.status(400).json({ error: 'Delivery orders require a delivery window.' });
    }

    const normalizedItems = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      flavor: item.flavor,
      size: item.size,
      cakeBuild: item.cakeBuild,
      quantity: Number(item.quantity),
      price: Number(item.price)
    }));

    const computedTotal = normalizedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (Math.abs(computedTotal - Number(total)) > 0.01) {
      return res.status(400).json({ error: 'Order total does not match items.' });
    }

    const orderData = {
      customer: normalizedCustomer,
      fulfillmentMethod,
      pickupTime,
      deliveryWindow,
      notes,
      items: normalizedItems,
      total: computedTotal
    };

    const saved = mongoose.connection.readyState === 1
      ? await new Order(orderData).save()
      : inMemoryOrders.createOrder(orderData);

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders/lookup
router.post('/lookup', async (req, res) => {
  try {
    const { orderId, reference, email, phone } = req.body || {};
    const hasIdLookup = String(orderId || '').trim() || String(reference || '').trim();
    const hasContactLookup = String(email || '').trim() && String(phone || '').trim();

    if (!hasIdLookup && !hasContactLookup) {
      return res.status(400).json({
        error: 'Provide an order ID, a 6-character reference, or both email and phone.'
      });
    }

    const order = await lookupOrder({ orderId, reference, email, phone });

    if (!order) {
      return res.status(404).json({
        error: 'We could not find an order with that information.'
      });
    }

    return res.json({ order: formatOrderForCustomer(order) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = mongoose.connection.readyState === 1
      ? await Order.findById(req.params.id)
      : inMemoryOrders.getOrderById(req.params.id);

    if (order) res.json(order);
    else res.status(404).json({ message: 'Order not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
