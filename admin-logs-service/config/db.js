const mongoose = require('mongoose');

/*
  Connects to MongoDB Atlas using the URI from the .env file.
  Exits the process if the connection fails, since the service
  cannot function without a database connection.
*/
const connectDB = async () => {
  try {
    // Attempt to connect using the URI defined in the environment
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[${process.env.SERVICE_NAME}] Connected to MongoDB Atlas`);
  } catch (error) {
    // Log the error and shut down — no point running without DB
    console.error(`[${process.env.SERVICE_NAME}] MongoDB Connection Error:`, error.message);
    process.exit(1);
  }
};

// Export the function so app.js can call it on startup
module.exports = connectDB;
