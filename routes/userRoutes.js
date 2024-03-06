// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../services/authMiddleware');
const { check } = require('express-validator');
const multer = require('multer');
const _ = require("lodash");
const Social = require('../models/social');
// Multer configuration for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/contact/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Contact routes
router.get('/get-all-contacts', userController.getAllContacts);
router.post('/contacts', authenticateJWT, upload.single('image'), [
    check('email').isEmail().withMessage('Invalid email address'),
    check('phone').isMobilePhone().withMessage('Invalid phone number')
], userController.createContact);
router.get('/get-contacts/:id', authenticateJWT, userController.getContactById); // Get contact by ID
router.delete('/delete-contacts/:id', authenticateJWT, userController.deleteContactById); // Delete contact by ID

// Users routes
router.get('/all/users', authenticateJWT, userController.getAllUsers);
router.post('/create/user', authenticateJWT, userController.createUser);
router.post('/login', userController.loginUser);
// Add more routes as needed



// Social Routs
router.put('/update/social/media', async (req, res) => {
    try {
        const updatedSocialData = req.body; // Assuming request body contains the updated data
        const result = await Social.findOneAndUpdate({}, updatedSocialData, { new: true, upsert: true });
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all social media data
router.get('/get/all/social/media', async (req, res) => {
    try {
        const allSocialData = await Social.find({});
        res.json(allSocialData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;
