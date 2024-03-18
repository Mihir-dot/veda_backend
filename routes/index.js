// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const servicesRoutes = require('./servicesRoutes');
const aboutRoutes = require('./aboutRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const faqRoutes = require('./faqRoutes');
// Use route handlers
router.use(userRoutes);
router.use(servicesRoutes);
router.use(aboutRoutes);
router.use(dashboardRoutes);
router.use(faqRoutes);

module.exports = router;
