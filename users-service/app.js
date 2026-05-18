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
            return res.status(404).send({ message: 'User not found' });
        }
        
        res.send(user);
    } catch (err) {
        res.status(500).send({ message: 'Error retrieving user', error: err.message });
    }
});


// Start the server and listen for connections
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});