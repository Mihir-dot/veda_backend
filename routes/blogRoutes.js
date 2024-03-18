const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const authenticateJWT = require('../services/authMiddleware');
const { check } = require('express-validator');
const path = require('path');
const multer = require('multer');

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/blog/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload
const upload = multer({ storage: storage });
// Route for creating a new blog
router.post('/create/blog', upload.fields([{ name: 'picture', maxCount: 1 }]), blogController.createBlog);

// Route for updating a blog
router.put('/update/blog/:id', upload.fields([{ name: 'picture', maxCount: 1 }]), blogController.updateBlog);

// Route for getting a blog by ID
router.get('/get/blog/:id',
    blogController.getBlogById,
);

// Route for getting a blog data
router.get('/get/allblog',
    blogController.getBlogData,
);


// Route for getting a blog name
router.delete('/delete/blog/:id',
    blogController.deleteBlogById,
);

module.exports = router;
