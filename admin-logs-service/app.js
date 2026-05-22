require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const pino = require('pino');
const pinoHttp = require('pino-http');
const cors = require('cors');
const Log = require('./models/log.model');
const logToMongo = require('./middleware/logToMongo');

const app = express();
const PORT = process.env.PORT || 3001;
const logger = pino();

// Connect to Database
connectDB();

app.use(express.json());
app.use(cors());
app.use(pinoHttp({ logger }));
app.use(logToMongo);

// Returns all logs from MongoDB, sorted newest first
app.get('/api/logs', async (req, res) => {
    try {
        const logs = await Log.find({}).sort({ timestamp: -1 });
        res.status(200).json(logs);
    } catch (err) {
        logger.error('Failed to fetch logs:', err.message);
        res.status(500).json({ id: Date.now(), message: err.message });
    }
});

app.listen(PORT, () => {
    logger.info(`${process.env.SERVICE_NAME} is running on port ${PORT}`);
});

module.exports = app;
