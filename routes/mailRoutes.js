const express = require('express');
const router = express.Router();
const sendEmailWithAttachment = require('../services/mailer');
const multer = require('multer');
// Multer configuration for file upload
const upload = multer({ dest: 'uploads/' });
// Route for Create a FAQ
router.post('/sendEmail', upload.single('file'), async (req, res) => {
    try {
        await sendEmailWithAttachment(req);
        res.status(200).send('Email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Internal server error.');
    }
});

module.exports = router;
