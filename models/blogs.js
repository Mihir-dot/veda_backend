const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, },
    description: { type: String, },
    picture: { type: String, },
    pictureLocation: { type: String, },
});

const Blog = mongoose.model('blog', blogSchema);

module.exports = Blog;
