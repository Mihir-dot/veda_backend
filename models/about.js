const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    name: { type: String, required: true },
    titleOne: { type: String, required: true },
    containtOne: { type: String, required: true },
    titleTwo: { type: String, required: true },
    containtTwo: { type: String, required: true },
    banner: { type: String, required: true },
    bannerLocation: { type: String, required: true },
    image: { type: String, required: true },
    imageLocation: { type: String, required: true },
    homePageImage: { type: String, required: true },
    homePageImageLocation: { type: String, required: true }
});

const Abouts = mongoose.model('about', aboutSchema);

module.exports = Abouts;
