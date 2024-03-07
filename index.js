// index.js
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const routes = require('./routes');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB', err));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.get('/get/image', (req, res) => {
    let { urlPath } = req.query;

    // Construct the full path to the image
    const imagePath = path.join(__dirname, urlPath);

    // Check if the file exists
    fs.access(imagePath, fs.constants.R_OK, (err) => {
        if (err) {
            // If the file is not found or not readable, send a 404 response
            res.status(404).send('Image not found');
        } else {
            // If the file exists, send it as a response
            res.sendFile(imagePath);
        }
    });
});
app.use('/api', routes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
