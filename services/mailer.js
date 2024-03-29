const fs = require('fs');
const nodemailer = require('nodemailer');

// Function to check if a file is empty
function isFileEmpty(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size === 0;
}
// Function to send email with or without attachment
const sendEmailWithAttachment = async function (req, replacedTemplate) {

    // Create a transporter object using SMTP transport
    const file = req.file
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'vida.org.au.in@gmail.com', // Your Gmail address
            pass: 'botq qyso bnlv oxpt' // Your Gmail password
        }
    });

    // Define email options
    let mailOptions = {
        from: 'vida.org.au.in@gmail.com',
        to: 'savaliyabhavisha456@gmail.com',
        // to: 'vida.org.au.in@gmail.com',
        subject: 'From Vida Customer',
        html: replacedTemplate,
        attachments: []
    };

    // Check if the file exists and is not empty, then attach it
    if (file && fs.existsSync(file.path) && !isFileEmpty(file.path)) {
        mailOptions.attachments.push({
            filename: file.originalname,
            path: file.path
        });
    }

    // Send email
    let info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);

    // If file exists, delete the uploaded file after sending email
    if (file && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
    }
}

module.exports = sendEmailWithAttachment;