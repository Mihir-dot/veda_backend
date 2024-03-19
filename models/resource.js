const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    titleOne: { type: String, },
    descriptionOne: { type: String, },
    titleTwo: { type: String, },
    descriptionTwo: { type: String, },
    picture: { type: String, },
    pictureLocation: { type: String, },
});

const Resource = mongoose.model('resource', resourceSchema);

module.exports = Resource;
