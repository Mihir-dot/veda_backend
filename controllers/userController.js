// controllers/userController.js
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createUser: async (req, res) => {
        const { username, email, password } = req.body;

        try {
            const newUser = new User({ username, email, role: "Admin", password });
            await newUser.save();
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    loginUser: async (req, res) => {
        const { email, password } = req.body;

        try {
            // Find the user in the database by email
            const user = await User.findOne({ email });

            // If user not found, return authentication failed
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed. User not found.' });
            }

            // Compare the provided password with the stored hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            // If password is not valid, return authentication failed
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Authentication failed. Incorrect password.' });
            }

            // If authentication is successful, generate a JWT token
            const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
                expiresIn: '1h', // Token expires in 1 hour
            });

            // Return the generated token
            res.status(200).json({ user: { name: user.username ? user.username : "", email: user.email ? email : "" }, token });
        } catch (error) {
            // Handle any errors that occur during authentication
            res.status(500).json({ error: error.message });
        }
    }


    // Other controller methods...
};
