const mongoose = require('mongoose');

const costSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        default: () => new Date().getFullYear()
    },
    month: {
        type: Number,
        default: () => new Date().getMonth() + 1
    },
    day: {
        type: Number,
        default: () => new Date().getDate()
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['food', 'health', 'housing', 'sport', 'education', 'transportation', 'other']
    },
    sum: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Cost', costSchema);