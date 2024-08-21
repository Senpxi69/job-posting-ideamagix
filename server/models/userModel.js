const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'candidate']
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
},)

module.exports = mongoose.model("user", userSchema);