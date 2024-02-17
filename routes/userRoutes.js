// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../services/authMiddleware'); 
const { check } = require('express-validator');
const multer = require('multer');
const _ =require("lodash");
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
router.post('/contacts',authenticateJWT, upload.single('image'), [
    check('email').isEmail().withMessage('Invalid email address'),
    check('phone').isMobilePhone().withMessage('Invalid phone number')
], userController.createContact);
router.get('/get-contacts/:id',authenticateJWT, userController.getContactById); // Get contact by ID
router.delete('/delete-contacts/:id',authenticateJWT, userController.deleteContactById); // Delete contact by ID



// Users routes
router.get('/all/users', authenticateJWT,userController.getAllUsers);
router.post('/create/user', authenticateJWT,userController.createUser);
router.post('/login', userController.loginUser);
// Add more routes as needed

module.exports = router;
