const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const authenticateJWT = require('../services/authMiddleware');
const { check } = require('express-validator');
const path = require('path');
const multer = require('multer');

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/resource/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload
const upload = multer({ storage: storage });
// Route for creating a new resource
router.post('/create/resource', upload.fields([{ name: 'picture', maxCount: 1 }]), resourceController.createResource);

// Route for updating a resource
router.put('/update/resource/:id', upload.fields([{ name: 'picture', maxCount: 1 }]), resourceController.updateResource);

// Route for getting a resource by ID
router.get('/get/resource/:id',
    resourceController.getResourceById,
);

// Route for getting a resource data
router.get('/get/allresource',
    resourceController.getResourceData,
);


// Route for getting a resource name
router.delete('/delete/resource/:id',
    resourceController.deleteResourceById,
);

module.exports = router;
