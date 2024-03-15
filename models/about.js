const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    name: { type: String, },
    titleOne: { type: String, },
    titleTwo: { type: String, },
    containtOne: { type: String, },
    banner: { type: String, },
    bannerLocation: { type: String, },
    visionTitleOne: { type: String, },
    visionDesscriptionOne: { type: String, },
    visionTitleTwo: { type: String, },
    visionDesscriptionTwo: { type: String, },
    visionBanner: { type: String, },
    visionBannerLocation: { type: String, },
});

const Abouts = mongoose.model('about', aboutSchema);

module.exports = Abouts;
