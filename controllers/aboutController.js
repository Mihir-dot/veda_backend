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
        const { name,
            titleOne,
            titleTwo,
            containtOne,
            visionTitleOne,
            visionDesscriptionOne,
            visionTitleTwo,
            visionDesscriptionTwo, } = req.body;

        const banner = req.files['banner'][0].filename;
        const bannerLocation = req.files['banner'][0].path;
        const visionBanner = req.files['visionBanner'][0].filename;
        const visionBannerLocation = req.files['visionBanner'][0].path;

        const about = new About({
            name,
            titleOne,
            titleTwo,
            containtOne,
            visionTitleOne,
            visionDesscriptionOne,
            visionTitleTwo,
            visionDesscriptionTwo,
            banner,
            bannerLocation,
            visionBanner,
            visionBannerLocation,
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
        const { name, titleOne, titleTwo, containtOne, visionTitleOne, visionDesscriptionOne, visionTitleTwo, visionDesscriptionTwo } = req.body;
        let updateFields = {
            name,
            titleOne,
            titleTwo,
            containtOne,
            visionTitleOne,
            visionDesscriptionOne,
            visionTitleTwo,
            visionDesscriptionTwo,
        };
        const about = await About.findById(id = aboutId);
        if (!about) {
            return res.status(404).json({ error: 'About not found' });
        }

        // If banner is being updated
        if (req.files['banner']) {
            const banner = req.files['banner'][0].filename;
            const bannerLocation = req.files['banner'][0].path;
            updateFields.banner = banner;
            updateFields.bannerLocation = bannerLocation;

            // Check if the image file exists and delete it
            const bannerPath = path.join(__dirname, '..', about.bannerLocation);
            try {
                await fs.access(bannerPath, fs.constants.F_OK); // Check if file exists
                // If file exists, proceed to delete it
                await fs.unlink(bannerPath);
            } catch (accessError) {
                // Handle the error if the file does not exist
                if (accessError.code !== 'ENOENT') {
                    throw accessError; // re-throw error if it's not "file not found"
                }
            }
        }

        // If visionBanner is being updated
        if (req.files['visionBanner']) {
            const visionBanner = req.files['visionBanner'][0].filename;
            const visionBannerLocation = req.files['visionBanner'][0].path;
            updateFields.visionBanner = visionBanner;
            updateFields.visionBannerLocation = visionBannerLocation;

            // Check if the image file exists and delete it
            const visionBannerPath = path.join(__dirname, '..', about.visionBannerLocation);
            try {
                await fs.access(visionBannerPath, fs.constants.F_OK); // Check if file exists
                // If file exists, proceed to delete it
                await fs.unlink(visionBannerPath);
            } catch (accessError) {
                // Handle the error if the file does not exist
                if (accessError.code !== 'ENOENT') {
                    throw accessError; // re-throw error if it's not "file not found"
                }
            }
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
        if (!about) {
            return res.status(404).json({ error: 'about not found' });
        }

        // Check if the image file exists
        const visionBannerLocation = path.join(__dirname, '..', about.visionBannerLocation);
        const bannerPath = path.join(__dirname, '..', about.bannerLocation);
        try {
            await fs.access(visionBannerLocation, fs.constants.F_OK); // Check if file exists
            // If file exists, proceed to delete it
            await fs.unlink(visionBannerLocation);
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
    createAbout: upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'visionBanner', maxCount: 1 }]),
    createAbout,
    updateAbout: upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'visionBanner', maxCount: 1 }]),
    updateAbout,
    getAboutById,
    getAboutData,
    getAboutName,
    deleteAboutById
};