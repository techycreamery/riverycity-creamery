const mongoose = require('mongoose');

const customerMessageSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true },
  customerEmail: { type: String, required: true, trim: true, lowercase: true },
  channel: { type: String, default: 'Email', trim: true },
  subject: { type: String, required: true, trim: true },
  body: { type: String, required: true, trim: true, maxlength: 2000 },
  status: { type: String, default: 'Sent', trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomerMessage', customerMessageSchema);
