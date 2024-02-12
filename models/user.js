
// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },

    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password') || user.isNew) {
        try {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
            next();
        } catch (error) {
            return next(error);
        }
    } else {
        return next();
    }
});
const User = mongoose.model('User', userSchema);

module.exports = User;
