const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/dashboardController');
const authenticateJWT = require('../services/authMiddleware');
const { check } = require('express-validator');
const path = require('path');
const multer = require('multer');

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/dashboard/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload
const upload = multer({ storage: storage });
// Route for creating a new dashboard
router.post('/create/dashboard', upload.fields([{ name: 'banner1', maxCount: 1 }, { name: 'banner2', maxCount: 1 }, { name: 'homageImageOne', maxCount: 1 }, { name: 'homePageImageTwo', maxCount: 1 }]), servicesController.createDashboard);

// Route for updating a dashboard
router.put('/update/dashboard/:id', upload.fields([{ name: 'banner1', maxCount: 1 }, { name: 'banner2', maxCount: 1 }, { name: 'homageImageOne', maxCount: 1 }, { name: 'homePageImageTwo', maxCount: 1 }]), servicesController.updateDashboard,
);

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
