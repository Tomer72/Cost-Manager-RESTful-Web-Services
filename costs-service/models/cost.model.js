const mongoose = require("mongoose");

// Define the structure of a cost document in MongoDB.
// Each document represents one cost added by a user.
const costSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },

  // Category must be one of the allowed project categories.
  category: {
    type: String,
    required: true,
    enum: ["food", "health", "housing", "sport", "education"]
  },

  // userid connects the cost to a user from the users collection.
  userid: {
    type: Number,
    required: true
  },

  // sum is the amount of money spent in this cost record.
  sum: {
    type: Number,
    required: true,
    min: 0
  },

  // If no date is sent, MongoDB saves the current date.
  date: {
    type: Date,
    default: Date.now
  }
});

// Export the Cost model so app.js can create and search costs.
module.exports = mongoose.model("Cost", costSchema);