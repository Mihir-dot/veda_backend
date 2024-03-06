// models/review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    text: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    name: { type: String, required: true },
    post: { type: String, required: true },
    picture: { type: String },
    pictureLocation: { type: String },
});

const Review = mongoose.model('review', reviewSchema);

module.exports = Review;
