// Import required modules
require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const User = require('./models/user.model');
const Cost = require('./models/cost.model');
const Log = require('./models/log.model');

// Initialize the Express application
const app = express();
// Port configuration
const PORT = process.env.PORT || 3002;

// Connect to Database
connectDB();

// Middleware to parse incoming JSON requests
app.use(express.json());

// Basic route to test if the server is running
app.get('/', (req, res) => {
    res.send('Welcome to the Users Service API');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: process.env.SERVICE_NAME });
});

// Route to handle POST requests for adding a new user
app.post('/api/add', async (req, res) => {
    try {
        const { id, first_name, last_name, birthday} = req.body;
        
        // Validate required fields
        if (!id || !first_name || !last_name || !birthday) {
            return res.status(400).json({ 
                message: 'Invalid input', 
                error: 'The following fields are required: id, first_name, last_name, birthday.' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ id: id });
        if (existingUser) {
            return res.status(409).json({ 
                message: 'User already exists', 
                error: `A user with id ${id} is already registered.` 
            });
        }

        // Create a new user document
        const newUser = new User({
            id,
            first_name,
            last_name,
            birthday
        });

        const savedUser = await newUser.save();
        res.status(201).send(savedUser);
    } catch (err) {
        res.status(400).send({ message: 'Error adding user', error: err.message });
    }
});

// Route to handle GET requests for retrieving all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving users', error: err.message });
    }
});

// Route to handle GET requests for a specific user by ID
app.get('/api/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = await User.findOne({ id: id });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate the total sum of costs for this user
        const costs = await Cost.find({ user_id: id });
        const total = costs.reduce((acc, cost) => acc + cost.sum, 0);
        
        // Return exactly the requested fields
        res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total: total
        });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving user details', error: err.message });
    }
});


// Start the server and listen for connections
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;