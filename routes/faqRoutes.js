const express = require('express');
const router = express.Router();
const Faq = require('../models/faq');
const authenticateJWT = require('../services/authMiddleware');
const { check } = require('express-validator');

// Route for Create a FAQ
router.post('/create/faq', async (req, res) => {
    try {
        const { question, answer } = req.body;
        const faq = new Faq({
            question, answer
        });
        await faq.save();
        res.status(201).json({ message: 'FAQ created successfully', faq });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Route for Update a FAQ
router.put('/update/faq/:id', async (req, res) => {
    try {
        const faqId = req.params.id;
        const { question, answer } = req.body;

        const faq = await Faq.findById(id = faqId);
        let updateFields = {
            question, answer
        };
        let data = await Faq.findByIdAndUpdate(faqId, updateFields);
        res.status(201).json({ message: 'FAQ updated successfully', data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// // Route for getting a faq by ID
router.get('/get/faq/:id', async (req, res) => {
    try {
        const faq = await Faq.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: 'Faq data not found' });
        }
        res.status(200).json(faq);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Route for getting a FAQ data
router.get('/get/allFaq', async (req, res) => {
    try {
        // Fetch all dashboard from the database
        const allFaq = await Faq.find();

        // Return the dashboard as a JSON response
        res.status(200).json(allFaq);
    } catch (error) {
        // If an error occurs, send an error response
        res.status(500).json({ message: error.message });
    }
});

// // Route for delete dashboard
router.delete('/delete/faq/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const faq = await Faq.findById(id);
        if (!faq) {
            return res.status(404).json({ error: 'Faq not found' });
        }
        // Delete the contact from the database
        await Faq.deleteOne({ _id: id });

        res.json({ message: 'Faq deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
