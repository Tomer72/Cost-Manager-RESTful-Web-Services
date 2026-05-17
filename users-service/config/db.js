const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[${process.env.SERVICE_NAME}] Connected to MongoDB Atlas`);
  } catch (error) {
    console.error(`[${process.env.SERVICE_NAME}] MongoDB Connection Error:`, error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
