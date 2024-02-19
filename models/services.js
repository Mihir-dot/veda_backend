const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    titelOne: { type: String, required: true },
    containtOne: { type: String, required: true},
    titelTwo: { type: String, required: true },
    containtTwo: { type: String, required: true},
    banner: { type: String, required: true },
    bannerLocation: { type: String, required: true },
    image: { type: String, required: true},
    imageLocation: { type: String, required: true },
});

const Services = mongoose.model('service', serviceSchema);

module.exports = Services;
