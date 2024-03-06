
// models/social.js
const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    email: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
    whatsapp: { type: String },
    telegram: { type: String }
});

const Social = mongoose.model('social', socialSchema);

module.exports = Social;
