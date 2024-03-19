// controllers/userController.js
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Resource = require('../models/resource');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/resource/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload
const upload = multer({ storage: storage });

// Controller function for creating a new Resource
const createResource = async (req, res) => {
    try {
        const { titleOne, descriptionOne, titleTwo, descriptionTwo } = req.body;

        const picture = req.files['picture'][0].filename;
        const pictureLocation = req.files['picture'][0].path;
        const resource = new Resource({
            titleOne,
            descriptionOne,
            titleTwo,
            descriptionTwo,
            picture,
            pictureLocation,
        });
        await resource.save();
        res.status(201).json({ message: 'Resource created successfully', resource });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update Resource
const updateResource = async (req, res) => {
    try {
        const resourceId = req.params.id;
        const { titleOne, descriptionOne, titleTwo, descriptionTwo } = req.body;
        let updateFields = { titleOne, descriptionOne, titleTwo, descriptionTwo };
        const resource = await Resource.findById(id = resourceId);
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        // Check if the image file exists
        const pictureLocation = path.join(__dirname, '..', resource.pictureLocation);
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
        await Resource.findByIdAndUpdate(resourceId, updateFields);

        res.status(200).json({ message: 'Resource updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get resource by ID
const getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json(resource);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get Resource Data
const getResourceData = async (req, res) => {
    try {
        // Fetch all Resource from the database
        const allResource = await Resource.find();

        // Return the Resource as a JSON response
        res.status(200).json(allResource);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
};



// delete Resource by id
const deleteResourceById = async (req, res) => {
    const { id } = req.params;
    try {
        const resource = await Resource.findById(id);
        if (!resource) {
            return res.status(404).json({ error: 'Prodcast not found' });
        }

        // Check if the image file exists
        const pictureLocation = path.join(__dirname, '..', resource.pictureLocation);
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
        await Resource.deleteOne({ _id: id });

        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createResource: upload.fields([{ name: 'picture', maxCount: 1 }]),
    createResource,
    updateResource: upload.fields([{ name: 'picture', maxCount: 1 }]),
    updateResource,
    getResourceById,
    getResourceData,
    deleteResourceById
};