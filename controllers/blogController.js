// controllers/userController.js
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Blogs = require('../models/blogs');
const fs = require('fs').promises;
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

// Controller function for creating a new Blogs
const createBlog = async (req, res) => {
    try {
        const { title, description, expertise, email, phone_no } = req.body;

        const picture = req.files['picture'][0].filename;
        const pictureLocation = req.files['picture'][0].path;
        const blogs = new Blogs({
            title,
            description, expertise,
            email,
            phone_no,
            picture,
            pictureLocation,
        });
        await blogs.save();
        res.status(201).json({ message: 'Blogs created successfully', blogs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update podcast
const updateBlog = async (req, res) => {
    try {
        const blogsId = req.params.id;
        const { title, description, expertise, email, phone_no } = req.body;
        let updateFields = { title, description, expertise, email, phone_no };
        const blog = await Blogs.findById(id = blogsId);
        if (!blog) {
            return res.status(404).json({ error: 'Blogs not found' });
        }

        // Check if the image file exists
        const pictureLocation = path.join(__dirname, '..', blog.pictureLocation);
        try {
            await fs.access(pictureLocation, fs.constants.F_OK); // Check if file exists
            // If file exists, proceed to delete it
            await fs.unlink(pictureLocation);
        } catch (accessError) {
            // Handle the error if the file does not exist
            if (accessError.code !== 'ENOENT') {
                throw accessError; // re-throw error if it's not "file not found"
            }
        }
        // If banner is being updated
        if (req.files['picture']) {
            const picture = req.files['picture'][0].filename;
            const pictureLocation = req.files['picture'][0].path;
            updateFields.picture = picture;
            updateFields.pictureLocation = pictureLocation;
        }
        await Blogs.findByIdAndUpdate(blogsId, updateFields);

        res.status(200).json({ message: 'Blogs updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get Blogs by ID
const getBlogById = async (req, res) => {
    try {
        const blogs = await Blogs.findById(req.params.id);
        if (!blogs) {
            return res.status(404).json({ message: 'Blogs not found' });
        }
        res.status(200).json(blogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get Blogs Data
const getBlogData = async (req, res) => {
    try {
        // Fetch all Blogs from the database
        const allBlogs = await Blogs.find();

        // Return the Blogs as a JSON response
        res.status(200).json(allBlogs);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
};

// delete Blogs by id
const deleteBlogById = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await Blogs.findById(id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        // Check if the image file exists
        const pictureLocation = path.join(__dirname, '..', blog.pictureLocation);
        try {
            await fs.access(pictureLocation, fs.constants.F_OK); // Check if file exists
            // If file exists, proceed to delete it
            await fs.unlink(pictureLocation);
        } catch (accessError) {
            // Handle the error if the file does not exist
            if (accessError.code !== 'ENOENT') {
                throw accessError; // re-throw error if it's not "file not found"
            }
        }

        // Delete the contact from the database
        await Blogs.deleteOne({ _id: id });

        res.json({ message: 'Blogs deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createBlog: upload.fields([{ name: 'picture', maxCount: 1 }]),
    createBlog,
    updateBlog: upload.fields([{ name: 'picture', maxCount: 1 }]),
    updateBlog,
    getBlogById,
    getBlogData,
    deleteBlogById
};