const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Transaction = require('./models/Transaction');
const mongoose = require("mongoose");
const app = express();

// Middleware to parse JSON request bodies
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => console.log(err));

// Test route
app.get('/api/test', (req, res) => {
  res.json('test ok2w');
});

// Transaction route
app.post('/api/transaction', async (req, res) => {
  const { name, description, datetime, price } = req.body;

  try {
    const transaction = await Transaction.create({ name, description, datetime, price });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all transactions route
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
