// controllers/userController.js
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Contact = require('../models/contact');
const Review = require('../models/review');
const fs = require('fs').promises;
const path = require('path');

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
        const { firstname, lastname, email, password } = req.body;

        try {
            const newUser = new User({ firstname, lastname, email, role: "Admin", password });
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
    },

    getAllContacts: async (req, res) => {
        try {
            let contacts = await Contact.find();

            // Iterate over each contact and update the path property
            contacts = contacts.map(contact => {
                contact.path = contact.path.replace(/\\/g, '\\');
                return contact;
            });

            res.json(contacts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createContact: async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Extract data from request body
        const { email, phone, location } = req.body;
        try {
            // Create new contact object
            const newContact = new Contact({
                email,
                phone,
                path: req.file.path,
                location: location,
                image: req.file.filename// Save the path of the uploaded image
            });

            // Save contact to database
            await newContact.save();

            res.status(201).json(newContact);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getContactById: async (req, res) => {
        const { id } = req.params;
        try {
            const contact = await Contact.findById(id);
            if (!contact) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            res.json(contact);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    deleteContactById: async (req, res) => {
        const { id } = req.params;
        try {
            const contact = await Contact.findById(id);
            if (!contact) {
                return res.status(404).json({ error: 'Contact not found' });
            }

            // Check if the image file exists
            const imagePath = path.join(__dirname, '..', contact.location);
            try {
                await fs.access(imagePath, fs.constants.F_OK); // Check if file exists
                // If file exists, proceed to delete it
                await fs.unlink(imagePath);
            } catch (accessError) {
                // Handle the error if the file does not exist
                if (accessError.code !== 'ENOENT') {
                    throw accessError; // re-throw error if it's not "file not found"
                }
            }

            // Delete the contact from the database
            await Contact.deleteOne({ _id: id });

            res.json({ message: 'Contact deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    ,
    // Create a new review
    createReview: async (req, res) => {
        const { text, rating, name, post } = req.body;
        try {
            const review = new Review({
                text, rating, name, post, picture: req.file.filename, pictureLocation: req.file.path
            });
            await review.save();

            res.status(201).json({ message: 'Review created successfully', review })
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Update review
    updateReview: async (req, res) => {
        const reviewId = req.params.id;
        const { text, rating, name, post } = req.body;
        try {
            let updateFields = { text, rating, name, post };
            if (req.file) {
                updateFields.picture = req.file.filename
                updateFields.pictureLocation = req.file.path
            }
            await Review.findByIdAndUpdate(reviewId, updateFields);
            res.status(200).json({ message: 'Service updated successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    // Get ratting by ID
    getRattingById: async (req, res) => {
        try {
            const ratting = await Review.findById(req.params.id);
            if (!ratting) {
                return res.status(404).json({ message: 'Ratting not found' });
            }
            res.status(200).json(ratting);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    // Get ratting Data
    getRattingData: async (req, res) => {
        try {
            const allRatting = await Review.find();
            res.status(200).json(allRatting);
        } catch (error) {
            // If an error occurs, send an error response
            res.status(500).json({ message: error.message });
        }
    },
    // delete Ratting by id
    deleteRattingById: async (req, res) => {
        const { id } = req.params;
        try {
            const review = await Review.findById(id);
            if (!review) {
                return res.status(404).json({ error: 'Ratting not found' });
            }
            // Check if the image file exists
            const imagePath = path.join(__dirname, '..', review.pictureLocation);
            try {
                await fs.access(imagePath, fs.constants.F_OK); // Check if file exists
                // If file exists, proceed to delete it
                await fs.unlink(imagePath);
            } catch (accessError) {
                // Handle the error if the file does not exist
                if (accessError.code !== 'ENOENT') {
                    throw accessError; // re-throw error if it's not "file not found"
                }
            }

            await Review.deleteOne({ _id: id });

            res.json({ message: 'Ratting deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};
