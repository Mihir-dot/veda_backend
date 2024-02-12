// index.js
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB', err));

// Middleware
app.use(express.json());

// JWT authentication middleware for all routes except /api/users/login
app.use((req, res, next) => {
    // Bypass authentication for the login route
    if (req.path === '/api/users/login') {
        return next();
    }

    // Validate and verify JWT token for other routes
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token without 'Bearer' prefix
    if (!token) {
        console.log('Token not found.');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, { complete: true }, (err, decoded) => {
        if (err) {
            console.log('Token verification failed:', err.message);
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.user = decoded.payload;
        next();
    });
});

// Routes
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
