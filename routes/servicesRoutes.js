const express = require('express');
const router = express.Router();
const servicesController = require('../controllers/servicesController');
const authenticateJWT = require('../services/authMiddleware'); 
const { check } = require('express-validator');
const path = require('path');
const multer = require('multer');

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/services/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload
const upload = multer({ storage: storage });
// Route for creating a new service
// Route for creating a new service
router.post('/create/services', upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'image', maxCount: 1 }]), servicesController.createService);



// Route for updating a service
router.put('/update/services/:id', 
    servicesController.updateService,
);

// Route for getting a service by ID
router.get('/get/services/:id', 
    servicesController.getServiceById,
);

// Route for getting a service name 
router.get('/get/allservices', 
    servicesController.getServiceName,
);

module.exports = router;
