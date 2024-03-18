// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const servicesRoutes = require('./servicesRoutes');
const aboutRoutes = require('./aboutRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const faqRoutes = require('./faqRoutes');
const prodcastRoutes = require('./prodcastRoutes');
const blogRoutes = require('./blogRoutes');
// Use route handlers
router.use(userRoutes);
router.use(servicesRoutes);
router.use(aboutRoutes);
router.use(dashboardRoutes);
router.use(faqRoutes);
router.use(prodcastRoutes);
router.use(blogRoutes);

module.exports = router;
