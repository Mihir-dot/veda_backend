const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/dashboardController');
const authenticateJWT = require('../services/authMiddleware');
const { check } = require('express-validator');


// Route for getting a dashboard by ID
router.get('/get/dashboard/:id',
    servicesController.getDashboardById,
);

// Route for getting a dashboard data
router.get('/get/allDashboard',
    servicesController.getDashboardData,
);

// Route for delete dashboard
router.delete('/delete/dashboard/:id',
    servicesController.deleteDashboardById,
);
module.exports = router;
