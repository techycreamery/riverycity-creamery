const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    flavor: { type: String, trim: true },
    size: { type: String, trim: true },
    cakeBuild: {
      shape: { type: String, trim: true },
      topLayer: { type: String, trim: true },
      middle: { type: String, trim: true },
      bottomLayer: { type: String, trim: true },
      message: { type: String, trim: true }
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, trim: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema({
  customer: { type: customerSchema, required: true },
  fulfillmentMethod: {
    type: String,
    enum: ['pickup', 'delivery'],
    default: 'pickup'
  },
  pickupTime: { type: String, trim: true },
  deliveryWindow: { type: String, trim: true },
  notes: { type: String, trim: true, maxlength: 500 },
  items: {
    type: [orderItemSchema],
    validate: [(items) => items.length > 0, 'Order must include at least one item.']
  },
  total: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
