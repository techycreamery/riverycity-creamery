const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  channel: { type: String, default: 'Email', trim: true },
  audience: { type: String, required: true, trim: true },
  scheduledFor: { type: String, trim: true },
  content: { type: String, required: true, trim: true, maxlength: 3000 },
  status: { type: String, default: 'Draft', trim: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);
