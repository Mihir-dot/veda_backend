
// models/contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    image: { type: String, required: true },
    path:{ type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true},
    phone: { type: String, required: true },
});

const Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;
