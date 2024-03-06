// controllers/userController.js
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const About = require('../models/about');
const fs = require('fs').promises;
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

// Controller function for creating a new About
const createAbout = async (req, res) => {
    try {
        const { name, titleOne, containtOne, titleTwo, containtTwo } = req.body;

        const banner = req.files['banner'][0].filename;
        const bannerLocation = req.files['banner'][0].path;
        const image = req.files['image'][0].filename;
        const imageLocation = req.files['image'][0].path;
        const homePageImage = req.files['homePageImage'][0].filename;
        const homePageImageLocation = req.files['homePageImage'][0].path;

        const about = new About({
            name,
            titleOne,
            containtOne,
            titleTwo,
            containtTwo,
            banner,
            bannerLocation,
            image,
            imageLocation,
            homePageImage,
            homePageImageLocation
        });

        await about.save();

        res.status(201).json({ message: 'About created successfully', about });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update about
const updateAbout = async (req, res) => {
    try {
        const aboutId = req.params.id;
        console.log('aboutId: ', aboutId);
        const { name, titleOne, containtOne, titleTwo, containtTwo } = req.body;
        console.log('name, titleOne, containtOne, titleTwo, containtTwo : ', name, titleOne, containtOne, titleTwo, containtTwo);
        let updateFields = {
            name,
            titleOne,
            containtOne,
            titleTwo,
            containtTwo
        };

        // If banner is being updated
        if (req.files['banner']) {
            const banner = req.files['banner'][0].filename;
            const bannerLocation = req.files['banner'][0].path;
            updateFields.banner = banner;
            updateFields.bannerLocation = bannerLocation;
        }

        // If image is being updated
        if (req.files['image']) {
            const image = req.files['image'][0].filename;
            const imageLocation = req.files['image'][0].path;
            updateFields.image = image;
            updateFields.imageLocation = imageLocation;
        }
        // If home page image is being updated
        if (req.files['homePageImage']) {
            const homePageImage = req.files['homePageImage'][0].filename;
            const homePageImageLocation = req.files['homePageImage'][0].path;
            updateFields.homePageImage = homePageImage;
            updateFields.homePageImageLocation = homePageImageLocation;
        }

        await About.findByIdAndUpdate(aboutId, updateFields);

        res.status(200).json({ message: 'About updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get about by ID
const getAboutById = async (req, res) => {
    try {
        const about = await About.findById(req.params.id);
        if (!about) {
            return res.status(404).json({ message: 'About not found' });
        }
        res.status(200).json(about);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Get About Data
const getAboutData = async (req, res) => {
    try {
        // Fetch all about from the database
        const allAbout = await About.find();

        // Return the about as a JSON response
        res.status(200).json(allAbout);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
};

// Get About name
const getAboutName = async (req, res) => {
    try {
        // Fetch all about from the database
        const allAbout = await About.find({}, "name");

        // Return the about as a JSON response
        res.status(200).json(allAbout);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
};


// delete about by id
const deleteAboutById = async (req, res) => {
    const { id } = req.params;
    try {
        const about = await About.findById(id);
        console.log('about: ', about);
        if (!about) {
            return res.status(404).json({ error: 'about not found' });
        }

        // Check if the image file exists
        const imagePath = path.join(__dirname, '..', about.imageLocation);
        const bannerPath = path.join(__dirname, '..', about.bannerLocation);
        try {
            await fs.access(imagePath, fs.constants.F_OK); // Check if file exists
            // If file exists, proceed to delete it
            await fs.unlink(imagePath);
            await fs.access(bannerPath, fs.constants.F_OK); // Check if file exists
            // If file exists, proceed to delete it
            await fs.unlink(bannerPath);
        } catch (accessError) {
            // Handle the error if the file does not exist
            if (accessError.code !== 'ENOENT') {
                throw accessError; // re-throw error if it's not "file not found"
            }
        }

        // Delete the contact from the database
        await About.deleteOne({ _id: id });

        res.json({ message: 'About deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createAbout: upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'image', maxCount: 1 }, { name: "homePageImage", maxCount: 1 }]),
    createAbout,
    updateAbout: upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'image', maxCount: 1 }, { name: "homePageImage", maxCount: 1 }]),
    updateAbout,
    getAboutById,
    getAboutData,
    getAboutName,
    deleteAboutById
};