// controllers/userController.js
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Podcast = require('../models/podcast');
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

// Controller function for creating a new Podcast
const createProdcast = async (req, res) => {
    try {
        const { name, link } = req.body;

        const picture = req.files['picture'][0].filename;
        const pictureLocation = req.files['picture'][0].path;
        const about = new Podcast({
            name,
            link,
            picture,
            pictureLocation,
        });
        await about.save();
        res.status(201).json({ message: 'Podcast created successfully', about });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update podcast
const updateProdcast = async (req, res) => {
    try {
        const podcastId = req.params.id;
        const { name, link } = req.body;
        let updateFields = {
            name,
            link,
        };
        const podcast = await Podcast.findById(id = podcastId);
        if (!podcast) {
            return res.status(404).json({ error: 'Podcast not found' });
        }

        // If picture is being updated
        if (req.files['picture']) {
            const picture = req.files['picture'][0].filename;
            const pictureLocation = req.files['picture'][0].path;
            updateFields.picture = picture;
            updateFields.pictureLocation = pictureLocation;

            // Check if the image file exists and delete it
            const picturePath = path.join(__dirname, '..', podcast.pictureLocation);
            try {
                await fs.access(picturePath, fs.constants.F_OK); // Check if file exists
                // If file exists, proceed to delete it
                await fs.unlink(picturePath);
            } catch (accessError) {
                // Handle the error if the file does not exist
                if (accessError.code !== 'ENOENT') {
                    throw accessError; // re-throw error if it's not "file not found"
                }
            }
        }

        await Podcast.findByIdAndUpdate(podcastId, updateFields);

        res.status(200).json({ message: 'Podcast updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get podcast by ID
const getProdcastById = async (req, res) => {
    try {
        const podcast = await Podcast.findById(req.params.id);
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }
        res.status(200).json(podcast);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get Podcast Data
const getProdcastData = async (req, res) => {
    try {
        // Fetch all Podcast from the database
        const allPodcast = await Podcast.find();

        // Return the Podcast as a JSON response
        res.status(200).json(allPodcast);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
};



// delete Podcast by id
const deleteProdcastById = async (req, res) => {
    const { id } = req.params;
    try {
        const prodcast = await Podcast.findById(id);
        if (!prodcast) {
            return res.status(404).json({ error: 'Prodcast not found' });
        }

        // Check if the image file exists
        const pictureLocation = path.join(__dirname, '..', prodcast.pictureLocation);
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
        await Podcast.deleteOne({ _id: id });

        res.json({ message: 'Podcast deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createProdcast: upload.fields([{ name: 'picture', maxCount: 1 }]),
    createProdcast,
    updateProdcast: upload.fields([{ name: 'picture', maxCount: 1 }]),
    updateProdcast,
    getProdcastById,
    getProdcastData,
    deleteProdcastById
};