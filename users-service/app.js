// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const connectDB = require('./config/db');

const User = require('./models/user.model');
const Cost = require('./models/cost.model');
const Log = require('./models/log.model');

// Initialize the Express application and shared constants
const app = express();
const PORT = process.env.PORT || 3002;
const SERVICE_NAME = process.env.SERVICE_NAME || 'users-service';

// Connect to MongoDB Atlas
connectDB();

// Enable JSON body parsing, CORS, and Pino HTTP logging
app.use(express.json());
app.use(cors());
app.use(pinoHttp());

/*
  Log middleware: saves a log document to MongoDB after every HTTP response.
  Uses res.on('finish') so the status code is already set when we save.
*/
app.use((req, res, next) => {
    res.on('finish', async () => {
        try {
            // Save method, url, status, and service name to the shared logs collection
            await Log.create({
                method: req.method,
                url: req.originalUrl,
                status: res.statusCode,
                service: SERVICE_NAME
            });
        } catch (err) {
            console.error('Failed to save log to MongoDB:', err.message);
        }
    });
    next();
});

// Health check endpoint to verify the service is running
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: SERVICE_NAME });
});

// Add a new user after validating input and checking for duplicates
app.post('/api/add', async (req, res) => {
    try {
        const { id, first_name, last_name, birthday } = req.body;

        // Validate that all required fields are present
        if (!id || !first_name || !last_name || !birthday) {
            return res.status(400).json({
                id: Date.now(),
                message: 'The following fields are required: id, first_name, last_name, birthday.'
            });
        }

        // Reject the request if a user with this id already exists
        const existingUser = await User.findOne({ id: id });
        if (existingUser) {
            return res.status(409).json({
                id: Date.now(),
                message: `A user with id ${id} is already registered.`
            });
        }

        // Create and save the new user document
        const newUser = new User({ id, first_name, last_name, birthday });
        const savedUser = await newUser.save();

        return res.status(201).json(savedUser);
    } catch (err) {
        // Return error details using the required id + message format
        return res.status(400).json({ id: Date.now(), message: err.message });
    }
});

// Return all users from the users collection
app.get('/api/users', async (req, res) => {
    try {
        // Fetch every user document from MongoDB
        const users = await User.find();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ id: Date.now(), message: err.message });
    }
});

// Return a specific user by id, including their total costs
app.get('/api/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        // Look up the user by the numeric id field (not _id)
        const user = await User.findOne({ id: id });

        if (!user) {
            return res.status(404).json({ id: Date.now(), message: 'User not found' });
        }

        // Sum all costs for this user from the costs collection
        const costs = await Cost.find({ userid: id });
        const total = costs.reduce((acc, cost) => acc + cost.sum, 0);

        // Return exactly the fields required by the project document
        return res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total: total
        });
    } catch (err) {
        return res.status(500).json({ id: Date.now(), message: err.message });
    }
});

// Start the server only when this file is run directly, not during tests
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`${SERVICE_NAME} is running on port ${PORT}`);
    });
}

// Export app so unit tests can call endpoints directly
module.exports = app;
