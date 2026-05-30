// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const pino = require('pino');
const pinoHttp = require('pino-http');
const cors = require("cors");
const logToMongo = require('./middleware/logToMongo');

// Initialize Express app and configuration
const app = express();
const PORT = process.env.PORT || 3004;
const logger = pino();

// Connect to MongoDB (needed for writing request logs)
connectDB();

// Parse incoming JSON request bodies
app.use(express.json());

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Attach Pino HTTP logger to every request
app.use(pinoHttp({ logger }));

// Save every request log to MongoDB
app.use(logToMongo);

// Returns the list of team members (first_name and last_name only)
// Names are loaded from .env and are not stored in the database
app.get('/api/about', (req, res) => {
    try {
        // Build team members array from environment variables
        res.status(200).json([
            { first_name: process.env.TEAM_MEMBER_1_FIRST_NAME, last_name: process.env.TEAM_MEMBER_1_LAST_NAME },
            { first_name: process.env.TEAM_MEMBER_2_FIRST_NAME, last_name: process.env.TEAM_MEMBER_2_LAST_NAME },
            { first_name: process.env.TEAM_MEMBER_3_FIRST_NAME, last_name: process.env.TEAM_MEMBER_3_LAST_NAME }
        ]);
    } catch (err) {
        // Return error details as JSON if something goes wrong
        logger.error('Failed to return about data:', err.message);
        res.status(500).json({ id: Date.now(), message: err.message });
    }
});

// Start the server only when this file is executed directly, not during tests
if (require.main === module) {
    app.listen(PORT, () => {
        logger.info(`${process.env.SERVICE_NAME} is running on port ${PORT}`);
    });
}

// Export app for use in unit tests
module.exports = app;
