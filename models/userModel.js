const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true, unique: false },
    lastname: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    about: { type: String },

    password: { type: String, required: false },
    image: { type: String },
    achievement: { type: String },
    goal: { type: String },
    skill: { type: String },
    resetKey: String,
    resetKeyExpiration: Date,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);
