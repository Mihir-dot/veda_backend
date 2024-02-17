// routes/index.js
const express = require('express');
const router = express.Router();

// Import route handlers from other files
const userRoutes = require('./userRoutes');

// Use route handlers
router.use( userRoutes);

module.exports = router;
