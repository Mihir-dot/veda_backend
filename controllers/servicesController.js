// controllers/userController.js
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Services = require('../models/services');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/services/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload
const upload = multer({ storage: storage });

// Controller function for creating a new service
const createService = async (req, res) => {
    try {
        const { name, sortName, titleOne, containtOne, titleTwo, containtTwo } = req.body;

        const banner = req.files['banner'][0].filename;
        const bannerLocation = req.files['banner'][0].path;
        const image = req.files['image'][0].filename;
        const imageLocation = req.files['image'][0].path;

        const service = new Services({
            name,
            sortName,
            titleOne,
            containtOne,
            titleTwo,
            containtTwo,
            banner,
            bannerLocation,
            image,
            imageLocation
        });

        await service.save();

        res.status(201).json({ message: 'Service created successfully', service });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update service
const updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const { name, sortName, titleOne, containtOne, titleTwo, containtTwo } = req.body;
        const services = await Services.findById(id = serviceId);
        // Check if the image file exists
        const imagePath = path.join(__dirname, '..', services.imageLocation);
        const bannerPath = path.join(__dirname, '..', services.bannerLocation);
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
        let updateFields = {
            name,
            sortName,
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

        await Services.findByIdAndUpdate(serviceId, updateFields);

        res.status(200).json({ message: 'Service updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get service by ID
const getServiceById = async (req, res) => {
    try {
        const service = await Services.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(service);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Get service Data
const getServiceData = async (req, res) => {
    try {
        // Fetch all services from the database
        const allServices = await Services.find();

        // Return the services as a JSON response
        res.status(200).json(allServices);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
};

// Get service name
const getServiceName = async (req, res) => {
    try {
        // Fetch all services from the database
        const allServices = await Services.find({}, "name sortName imageLocation");

        // Return the services as a JSON response
        res.status(200).json(allServices);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
};

// delete Service by id
const deleteServiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const services = await Services.findById(id);
        if (!services) {
            return res.status(404).json({ error: 'services not found' });
        }

        // Check if the image file exists
        const imagePath = path.join(__dirname, '..', services.imageLocation);
        const bannerPath = path.join(__dirname, '..', services.bannerLocation);
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
        await Services.deleteOne({ _id: id });

        res.json({ message: 'Services deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createService: upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'image', maxCount: 1 }]),
    createService,
    updateService: upload.fields([{ name: 'banner', maxCount: 1 }, { name: 'image', maxCount: 1 }]),
    updateService,
    getServiceById,
    getServiceData,
    getServiceName,
    deleteServiceById
};