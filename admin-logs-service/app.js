// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const pino = require('pino');
const pinoHttp = require('pino-http');
const cors = require('cors');
const Log = require('./models/log.model');
const logToMongo = require('./middleware/logToMongo');

// Initialize Express app and configuration
const app = express();
const PORT = process.env.PORT || 3001;
const logger = pino();

// Connect to MongoDB to access the shared logs collection
connectDB();

// Parse incoming JSON request bodies
app.use(express.json());
// Enable Cross-Origin Resource Sharing
app.use(cors());
// Attach Pino HTTP logger to every request
app.use(pinoHttp({ logger }));
// Save every request log to MongoDB
app.use(logToMongo);

// Returns all logs from MongoDB, sorted newest first
app.get('/api/logs', async (req, res) => {
    try {
        // Fetch all log documents, most recent first
        const logs = await Log.find({}).sort({ timestamp: -1 });
        res.status(200).json(logs);
    } catch (err) {
        // Return error details as JSON if the query fails
        logger.error('Failed to fetch logs:', err.message);
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
