const mongoose = require("mongoose");

// Define the structure of a request log document.
// Every service saves HTTP request information into this collection.
const logSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true
  },

  // HTTP method and route show which endpoint was called.
  method: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },

  // statusCode is saved after the response is finished.
  statusCode: {
    type: Number,
    required: true
  },

  // createdAt stores the time of the request automatically.
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the Log model so app.js can save request logs.
module.exports = mongoose.model("Log", logSchema);