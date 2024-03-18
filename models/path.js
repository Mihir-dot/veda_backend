
// models/contact.js
const mongoose = require('mongoose');

const pathSchema = new mongoose.Schema({
    title: { type: String, required: true },
    path: { type: String, required: true },
});

const Path = mongoose.model('path', pathSchema);

module.exports = Path;
