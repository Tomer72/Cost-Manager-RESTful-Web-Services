require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3003;

// Connect to Database
connectDB();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: process.env.SERVICE_NAME });
});

app.listen(PORT, () => {
  console.log(`${process.env.SERVICE_NAME} is running on port ${PORT}`);
});
