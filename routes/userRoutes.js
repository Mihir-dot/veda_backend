// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../services/authMiddleware');
const { check } = require('express-validator');
const multer = require('multer');
const _ = require("lodash");
const path = require('path');
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

// Set up storage for multer
const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/ratting/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload
const upload1 = multer({ storage: storage1 });
// Contact routes
router.get('/get-all-contacts', userController.getAllContacts);
router.post('/contacts', authenticateJWT, upload.single('image'), [
    check('email').isEmail().withMessage('Invalid email address'),
    check('phone').isMobilePhone().withMessage('Invalid phone number')
], userController.createContact);
router.put('/contacts/update/:id', authenticateJWT, upload.single('image'), [
    check('email').isEmail().withMessage('Invalid email address'),
    check('phone').isMobilePhone().withMessage('Invalid phone number')
], userController.updateContact);

router.get('/get-contacts/:id', authenticateJWT, userController.getContactById); // Get contact by ID
router.delete('/delete-contacts/:id', authenticateJWT, userController.deleteContactById); // Delete contact by ID

// Users routes
router.get('/all/users', authenticateJWT, userController.getAllUsers);
router.post('/create/user', authenticateJWT, userController.createUser);
router.post('/login', userController.loginUser);
// Add more routes as needed

// Ratting
router.post('/create/ratting', authenticateJWT, upload1.single('picture'), userController.createReview);
router.put('/update/ratting/:id', upload1.single('picture'), userController.updateReview);
router.get('/get/ratting/:id', authenticateJWT, userController.getRattingById,);
router.get('/get/allratting', userController.getRattingData);
router.delete('/delete/ratting/:id', authenticateJWT, userController.deleteRattingById);

// Social Routs
router.put('/update/social/media', authenticateJWT, async (req, res) => {
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

// Get social media by id
router.get('/get/social/media/ById/:id', async (req, res) => {
    let { id } = req.params; // Change req.query to req.params
    try {
        const allSocialData = await Social.findOne({ _id: id }); // Assuming _id is the field in your model
        if (!allSocialData) {
            return res.status(404).json({ message: 'Social media not found. Please provide a valid ID.' });
        }
        res.json(allSocialData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;
