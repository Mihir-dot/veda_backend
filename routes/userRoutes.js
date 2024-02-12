// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define routes
router.get('/all/users', userController.getAllUsers);
router.post('/create/user', userController.createUser);
router.post('/login', userController.loginUser);
// Add more routes as needed

module.exports = router;
