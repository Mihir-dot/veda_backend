const express = require('express');
const router = express.Router();
const prodcastController = require('../controllers/prodcastController');
const authenticateJWT = require('../services/authMiddleware');
const { check } = require('express-validator');
const path = require('path');
const multer = require('multer');

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/prodcast/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload
const upload = multer({ storage: storage });
// Route for creating a new prodcast
router.post('/create/prodcast', upload.fields([{ name: 'picture', maxCount: 1 }]), prodcastController.createProdcast);

// Route for updating a prodcast
router.put('/update/prodcast/:id', upload.fields([{ name: 'picture', maxCount: 1 }]), prodcastController.updateProdcast);

// Route for getting a prodcast by ID
router.get('/get/prodcast/:id',
    prodcastController.getProdcastById,
);

// Route for getting a prodcast data
router.get('/get/allprodcast',
    prodcastController.getProdcastData,
);


// Route for getting a prodcast name
router.delete('/delete/prodcast/:id',
    prodcastController.deleteProdcastById,
);

module.exports = router;
