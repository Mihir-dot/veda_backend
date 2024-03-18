
// models/contact.js
const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
});

const Faq = mongoose.model('faq', faqSchema);

module.exports = Faq;
