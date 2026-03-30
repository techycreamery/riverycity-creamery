const mongoose = require('mongoose');
const Order = require('../models/Order');
const inMemoryOrders = require('./inMemoryOrders');

function normalizePhone(value) {
  return String(value || '').replace(/\D/g, '');
}

function formatOrderForCustomer(order) {
  return {
    id: order._id,
    reference: String(order._id || '').slice(-6).toUpperCase(),
    status: order.status || 'Pending',
    fulfillmentMethod: order.fulfillmentMethod || 'pickup',
    pickupTime: order.pickupTime || '',
    deliveryWindow: order.deliveryWindow || '',
    createdAt: order.createdAt,
    total: Number(order.total || 0),
    customer: {
      firstName: order.customer?.firstName || '',
      fullName: order.customer?.fullName || '',
      email: order.customer?.email || ''
    },
    items: Array.isArray(order.items)
      ? order.items.map((item) => ({
          name: item.name,
          quantity: Number(item.quantity || 0),
          flavor: item.flavor || '',
          size: item.size || '',
          cakeBuild: item.cakeBuild || null
        }))
      : []
  };
}

async function lookupOrder({ orderId, reference, email, phone }) {
  const normalizedId = String(orderId || '').trim();
  const normalizedReference = String(reference || '').trim().toUpperCase();
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const normalizedPhone = normalizePhone(phone);

  if (normalizedId) {
    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(normalizedId)) {
        return null;
      }

      const order = await Order.findById(normalizedId).lean();
      return order || null;
    }

    return inMemoryOrders.getOrderById(normalizedId);
  }

  if (normalizedReference) {
    const matches = mongoose.connection.readyState === 1
      ? await Order.find().sort({ createdAt: -1 }).lean()
      : inMemoryOrders.listOrders();

    return matches.find(
      (order) => String(order._id || '').slice(-6).toUpperCase() === normalizedReference
    ) || null;
  }

  if (!normalizedEmail || !normalizedPhone) {
    return null;
  }

  const emailMatches = mongoose.connection.readyState === 1
    ? await Order.find({ 'customer.email': normalizedEmail }).sort({ createdAt: -1 }).lean()
    : inMemoryOrders.findOrdersByEmail(normalizedEmail);

  return emailMatches.find(
    (order) => normalizePhone(order.customer?.phone) === normalizedPhone
  ) || null;
}

module.exports = {
  normalizePhone,
  formatOrderForCustomer,
  lookupOrder
};
