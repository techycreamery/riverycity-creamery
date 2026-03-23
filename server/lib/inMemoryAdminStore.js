const crypto = require('crypto');

const products = [
  {
    _id: crypto.randomUUID(),
    name: 'Take Home',
    category: 'Take Home',
    price: 10,
    status: 'Active',
    description: 'Freezer-ready pints, quarts, and half gallons.'
  },
  {
    _id: crypto.randomUUID(),
    name: 'Ice Cream Cake',
    category: 'Cakes',
    price: 28.95,
    status: 'Active',
    description: 'Custom round cakes with configurable layers and message.'
  }
];

const messages = [];
const campaigns = [];

function listProducts() {
  return [...products];
}

function createProduct(data) {
  const product = {
    _id: crypto.randomUUID(),
    createdAt: new Date(),
    ...data
  };
  products.unshift(product);
  return product;
}

function listMessages() {
  return [...messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function createMessage(data) {
  const message = {
    _id: crypto.randomUUID(),
    createdAt: new Date(),
    status: data.status || 'Sent',
    ...data
  };
  messages.unshift(message);
  return message;
}

function listCampaigns() {
  return [...campaigns].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function createCampaign(data) {
  const campaign = {
    _id: crypto.randomUUID(),
    createdAt: new Date(),
    status: data.status || 'Draft',
    ...data
  };
  campaigns.unshift(campaign);
  return campaign;
}

module.exports = {
  listProducts,
  createProduct,
  listMessages,
  createMessage,
  listCampaigns,
  createCampaign
};
