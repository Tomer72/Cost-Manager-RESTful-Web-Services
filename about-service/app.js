require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const pino = require('pino');
const pinoHttp = require('pino-http');
const cors = require("cors");
const logToMongo = require('./middleware/logToMongo');

const app = express();
const PORT = process.env.PORT || 3004;
const logger = pino();

// Connect to Database
connectDB();

app.use(express.json());

app.use(cors());

app.use(pinoHttp({ logger }));

app.use(logToMongo);

app.get('/api/about', (req, res) => {
    try {
        res.status(200).json([
            { first_name: process.env.TEAM_MEMBER_1_FIRST_NAME, last_name: process.env.TEAM_MEMBER_1_LAST_NAME },
            { first_name: process.env.TEAM_MEMBER_2_FIRST_NAME, last_name: process.env.TEAM_MEMBER_2_LAST_NAME },
            { first_name: process.env.TEAM_MEMBER_3_FIRST_NAME, last_name: process.env.TEAM_MEMBER_3_LAST_NAME }
        ]);
    } catch (err) {
        logger.error('Failed to return about data:', err.message);
        res.status(500).json({ id: Date.now(), message: err.message });
    }
});

app.listen(PORT, () => {
  logger.info(`${process.env.SERVICE_NAME} is running on port ${PORT}`);
});

module.exports = app;
