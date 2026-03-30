const crypto = require('crypto');

const orders = [];

function createOrder(data) {
  const order = {
    ...data,
    _id: crypto.randomUUID(),
    status: data.status || 'Pending',
    createdAt: new Date()
  };

  orders.push(order);
  return order;
}

function getOrderById(id) {
  return orders.find((order) => order._id === id) || null;
}

function findOrdersByEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!normalizedEmail) {
    return [];
  }

  return orders.filter(
    (order) => String(order.customer?.email || '').trim().toLowerCase() === normalizedEmail
  );
}

function listOrders() {
  return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = {
  createOrder,
  getOrderById,
  findOrdersByEmail,
  listOrders
};
