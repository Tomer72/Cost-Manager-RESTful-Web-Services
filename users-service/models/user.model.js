const mongoose = require('mongoose');

/*
  User model for the users-service.
  Stores the core user details as required by the project document.
  id and _id are two separate fields — id is the application-level identifier.
*/
const userSchema = new mongoose.Schema({
    // id is the application-level user identifier, must be unique
    id: {
        type: Number,
        required: true,
        unique: true
    },

    // first_name and last_name are required string fields
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },

    // birthday is stored as a Date as required by the project document
    birthday: {
        type: Date,
        required: true
    }
});

// Export the User model so app.js can create and query users
module.exports = mongoose.model('User', userSchema);
