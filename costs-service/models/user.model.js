const mongoose = require("mongoose");

// Define the structure of a user document in MongoDB.
// This service only uses users to verify that a userid exists.
const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },

  // Basic user details saved by the users service.
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },

  // Birthday is optional here because the costs service does not use it.
  birthday: {
    type: Date
  }
});

// Export the User model so app.js can search users by id.
module.exports = mongoose.model("User", userSchema);