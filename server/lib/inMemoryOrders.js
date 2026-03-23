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

function listOrders() {
  return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = {
  createOrder,
  getOrderById,
  listOrders
};
