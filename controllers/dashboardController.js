// controllers/dashboardController.js
const { validationResult } = require('express-validator');
const Dashboard = require('../models/dashboard');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

// Set up storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/dashboard/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer upload
const upload = multer({ storage: storage });

// Controller function for creating a new dashboard
const createDashboard = async (req, res) => {
    try {
        const {
            card_title,
            card_main_title,
            card_content,
            Link,
            homePageTitleOne,
            homePageTitleTwo,
            homePageDescription,
        } = req.body;

        const banner1 = req.files['banner1'][0].filename;
        const banner1Location = req.files['banner1'][0].path;
        const banner2 = req.files['banner2'][0].filename;
        const banner2Location = req.files['banner2'][0].path;
        const homageImageOne = req.files['homageImageOne'][0].filename;
        const homageImageOneLocation = req.files['homageImageOne'][0].path;
        const homePageImageTwo = req.files['homePageImageTwo'][0].filename;
        const homePageImageTwoLocation = req.files['homePageImageTwo'][0].path;
        const dashboard = new Dashboard({
            banner1,
            banner1Location,
            banner2,
            banner2Location,
            card_title,
            card_main_title,
            card_content,
            Link,
            homePageTitleOne,
            homePageTitleTwo,
            homePageDescription,
            homageImageOne,
            homageImageOneLocation,
            homePageImageTwo,
            homePageImageTwoLocation,
        });

        await dashboard.save();

        res.status(201).json({ message: 'Dashboard created successfully', dashboard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update dashboard
const updateDashboard = async (req, res) => {
    try {
        const dashboardId = req.params.id;
        const { card_title, card_main_title, card_content, Link, homePageTitleOne, homePageTitleTwo, homePageDescription } = req.body;
        const dashboard = await Dashboard.findById(id = dashboardId);
        if (!dashboard) {
            return res.status(404).json({ error: 'dashboard not found' });
        }

        let updateFields = {
            card_title,
            card_main_title,
            card_content,
            Link,
            homePageTitleOne,
            homePageTitleTwo,
            homePageDescription,
        };

        // If banner1 is being updated
        if (req.files['banner1']) {
            const banner1 = req.files['banner1'][0].filename;
            const banner1Location = req.files['banner1'][0].path;
            updateFields.banner1 = banner1;
            updateFields.banner1Location = banner1Location;

            // Check if the banner1 file exists and delete it
            const banner1Path = path.join(__dirname, '..', dashboard.banner1Location);
            try {
                await fs.access(banner1Path, fs.constants.F_OK); // Check if file exists
                // If file exists, proceed to delete it
                await fs.unlink(banner1Path);
            } catch (accessError) {
                // Handle the error if the file does not exist
                if (accessError.code !== 'ENOENT') {
                    throw accessError; // re-throw error if it's not "file not found"
                }
            }
        }

        // Similarly, repeat the process for other image fields...

        // If banner2 is being updated
        if (req.files['banner2']) {
            const banner2 = req.files['banner2'][0].filename;
            const banner2Location = req.files['banner2'][0].path;
            updateFields.banner2 = banner2;
            updateFields.banner2Location = banner2Location;

            // Check if the banner2 file exists and delete it
            const banner2Path = path.join(__dirname, '..', dashboard.banner2Location);
            try {
                await fs.access(banner2Path, fs.constants.F_OK); // Check if file exists
                // If file exists, proceed to delete it
                await fs.unlink(banner2Path);
            } catch (accessError) {
                // Handle the error if the file does not exist
                if (accessError.code !== 'ENOENT') {
                    throw accessError; // re-throw error if it's not "file not found"
                }
            }
        }

        // Repeat the process for other image fields...

        await Dashboard.findByIdAndUpdate(dashboardId, updateFields);

        res.status(200).json({ message: 'Dashboard updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get dashboard by ID
const getDashboardById = async (req, res) => {
    try {
        const dashboard = await Dashboard.findById(req.params.id);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard data not found' });
        }
        res.status(200).json(dashboard);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Get dashboard Data
const getDashboardData = async (req, res) => {
    try {
        // Fetch all dashboard from the database
        const allDashboard = await Dashboard.find();

        // Return the dashboard as a JSON response
        res.status(200).json(allDashboard);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
};


// delete Dashboard by id
const deleteDashboardById = async (req, res) => {
    const { id } = req.params;
    try {
        const dashboard = await Dashboard.findById(id);
        if (!dashboard) {
            return res.status(404).json({ error: 'dashboard not found' });
        }

        // Check if the image file exists
        const banner1Location = path.join(__dirname, '..', dashboard.banner1Location);
        const banner2Location = path.join(__dirname, '..', dashboard.banner2Location);
        const homageImageOneLocation = path.join(__dirname, '..', dashboard.homageImageOneLocation);
        const homePageImageTwoLocation = path.join(__dirname, '..', dashboard.homePageImageTwoLocation);
        try {
            await fs.access(banner1Location, fs.constants.F_OK); // Check if file exists
            // If file exists, proceed to delete it
            await fs.unlink(banner1Location);
            await fs.access(banner2Location, fs.constants.F_OK); // Check if file exists
            // If file exists, proceed to delete it
            await fs.unlink(banner2Location);
            await fs.access(homageImageOneLocation, fs.constants.F_OK); // Check if file exists
            // If file exists, proceed to delete it
            await fs.unlink(homageImageOneLocation);
            await fs.access(homePageImageTwoLocation, fs.constants.F_OK); // Check if file exists
            // If file exists, proceed to delete it
            await fs.unlink(homePageImageTwoLocation);
        } catch (accessError) {
            // Handle the error if the file does not exist
            if (accessError.code !== 'ENOENT') {
                throw accessError; // re-throw error if it's not "file not found"
            }
        }

        // Delete the contact from the database
        await Dashboard.deleteOne({ _id: id });

        res.json({ message: 'Dashboard deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createDashboard: upload.fields([{ name: 'banner1', maxCount: 1 }, { name: 'banner2', maxCount: 1 }, { name: 'homageImageOne', maxCount: 1 }, { name: 'homePageImageTwo', maxCount: 1 }]),
    createDashboard,
    updateDashboard: upload.fields([{ name: 'banner1', maxCount: 1 }, { name: 'banner2', maxCount: 1 }, { name: 'homageImageOne', maxCount: 1 }, { name: 'homePageImageTwo', maxCount: 1 }]),
    updateDashboard,
    getDashboardById,
    getDashboardData,
    deleteDashboardById
};