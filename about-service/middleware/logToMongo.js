/*
  Middleware: logToMongo
  Runs after every HTTP response (via res.on('finish')).
  Saves method, url, status, and service name to the shared 'logs' collection in MongoDB.
  Using res.on('finish') ensures the status code is already set before we save.
*/

const Log = require('../models/log.model');

module.exports = (req, res, next) => {
    res.on('finish', async () => {
        try {
            await Log.create({
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                service: process.env.SERVICE_NAME,
            });
        } catch (err) {
            console.error('Failed to save log to MongoDB:', err.message);
        }
    });
    next();
};
