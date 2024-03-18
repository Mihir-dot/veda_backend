// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const servicesRoutes = require('./servicesRoutes');
const aboutRoutes = require('./aboutRoutes');
const dashboardRoutes = require('./dashboardRoutes');

// Use route handlers
router.use(userRoutes);
router.use(servicesRoutes);
router.use(aboutRoutes);
router.use(dashboardRoutes);
module.exports = router;
