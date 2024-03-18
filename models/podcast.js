const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema({
    name: { type: String, },
    link: { type: String, },
    picture: { type: String, },
    pictureLocation: { type: String, },
});

const Podcast = mongoose.model('podcast', podcastSchema);

module.exports = Podcast;
