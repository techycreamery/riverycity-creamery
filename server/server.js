const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const deliveryWindowsRoutes = require('./routes/deliveryWindowsRoutes');
const orderRoutes = require('./routes/orderRoutes');
const orderSupportRoutes = require('./routes/orderSupportRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/delivery-windows', deliveryWindowsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/order-support', orderSupportRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('River City Creamery API is running.');
});

const PORT = process.env.PORT || 5001;
const startServer = () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI is not set. Starting with in-memory order storage.');
  startServer();
} else {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      startServer();
    })
    .catch(err => console.error('MongoDB connection failed:', err));
}
