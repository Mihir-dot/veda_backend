const express = require('express');
const router = express.Router();
const sendEmailWithAttachment = require('../services/mailer');
const multer = require('multer');
const fs = require('fs');
const emailTemplatePath = './services/mailCountaint.html';
const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
// Multer configuration for file upload
const upload = multer({ dest: 'uploads/' });
// Route for Create a FAQ
router.post('/sendEmail', upload.single('file'), async (req, res) => {
    try {
        const { name, email, phone, message } = req.body
        const replacedTemplate = emailTemplate
            .replace('{{name}}', name ? name : "")
            .replace('{{email}}', email ? email : "")
            .replace('{{phone}}', phone ? phone : "")
            .replace('{{text}}', message ? message : "")
        await sendEmailWithAttachment(req, replacedTemplate);
        res.status(200).send('Email sent successfully.');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Internal server error.');
    }
});

module.exports = router;
