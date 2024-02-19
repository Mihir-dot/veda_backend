// routes/index.js
const express = require('express');
const router = express.Router();

// Import route handlers from other files
const userRoutes = require('./userRoutes');
const servicesRoutes = require('./servicesRoutes');

// Use route handlers
router.use( userRoutes);
router.use( servicesRoutes);
module.exports = router;
