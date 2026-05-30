const mongoose = require('mongoose');

/*
  Cost model used by the users-service only to calculate total costs per user.
  The costs-service owns the actual cost creation logic.
  This model must match the schema used by the costs-service exactly.
*/
const costSchema = new mongoose.Schema({
    // userid connects the cost to a user — must match the costs-service field name
    userid: {
        type: Number,
        required: true
    },

    // description is a short text explaining what the cost was for
    description: {
        type: String,
        required: true
    },

    // category must be one of the five allowed project categories
    category: {
        type: String,
        required: true,
        enum: ['food', 'health', 'housing', 'sports', 'education']
    },

    // sum is the amount spent, stored as a number (Double in MongoDB)
    sum: {
        type: Number,
        required: true
    },

    // date defaults to the time the cost was created if not provided
    date: {
        type: Date,
        default: Date.now
    }
});

// Export the Cost model so app.js can query costs by userid
module.exports = mongoose.model('Cost', costSchema);
