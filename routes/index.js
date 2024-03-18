// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const servicesRoutes = require('./servicesRoutes');
const aboutRoutes = require('./aboutRoutes');
const dashboardRoutes = require('./dashboardRoutes');
<<<<<<< HEAD
const faqRoutes = require('./faqRoutes');
=======
>>>>>>> c592d776056d913db3f98b4da90399b0754c7119

// Use route handlers
router.use(userRoutes);
router.use(servicesRoutes);
router.use(aboutRoutes);
router.use(dashboardRoutes);
<<<<<<< HEAD
router.use(faqRoutes);
=======
>>>>>>> c592d776056d913db3f98b4da90399b0754c7119
module.exports = router;
