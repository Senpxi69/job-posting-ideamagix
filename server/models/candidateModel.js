const mongoose = require('mongoose');
const User = require('../models/userModel');

const candidateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: false,
    },
    resume: {
        type: String,
        required: false,
    },
    linkedinProfile: {
        type: String,
        required: false,
    },
    portfolio: {
        type: String,
        required: false,
    },
    skills: [String],
    experience: [{
        company: String,
        role: String,
        startDate: Date,
        endDate: Date,
        description: String
    }],
    education: [{
        institution: String,
        degree: String,
        startDate: Date,
        endDate: Date,
        description: String
    }],
    status: {
        type: String,
        default: 'Applied',
    },
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
