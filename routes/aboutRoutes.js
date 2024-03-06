const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const authenticateJWT = require('../services/authMiddleware');
const { check } = require('express-validator');
const path = require('path');
const multer = require('multer');

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/about/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload
const upload = multer({ storage: storage });
// Route for creating a new About
router.post('/create/about', upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'image', maxCount: 1 }, { name: "homePageImage", maxCount: 1 }]), aboutController.createAbout);

// Route for updating a About
router.put('/update/about/:id', upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'image', maxCount: 1 }, { name: "homePageImage", maxCount: 1 }]), aboutController.updateAbout);

// Route for getting a About by ID
router.get('/get/about/:id',
    aboutController.getAboutById,
);

// Route for getting a About data
router.get('/get/allabout',
    aboutController.getAboutData,
);

// Route for getting a About name
router.get('/get/allaboutname',
    aboutController.getAboutName,
);

// Route for getting a About name
router.delete('/delete/about/:id',
    aboutController.deleteAboutById,
);


module.exports = router;
