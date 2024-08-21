const Candidate = require('../models/candidateModel');
const mongoose = require('mongoose')
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        return cb(null, Date.now() + path.extname(file.originalname));
    }
})

module.exports.upload = multer({ storage });

module.exports.createCandidates = async (req, res) => {
    try {
        const { user, phoneNumber, address, linkedinProfile, portfolio, skills, experience, education, status } = req.body;

        if (!user || !phoneNumber || !address || !linkedinProfile || !portfolio) {
            return res.status(400).json({ msg: 'Required fields are missing', status: false });
        }

        let parsedExperience = [];
        let parsedEducation = [];
        let parsedSkills = [];

        try {
            parsedExperience = experience ? JSON.parse(experience) : [];
            parsedEducation = education ? JSON.parse(education) : [];
            parsedSkills = skills ? JSON.parse(skills) : [];
        } catch (parseError) {
            return res.status(400).json({ msg: 'Error parsing JSON fields', status: false });
        }

        if (!Array.isArray(parsedExperience) || !Array.isArray(parsedEducation) || !Array.isArray(parsedSkills)) {
            return res.status(400).json({ msg: 'Invalid format for experience, education, or skills', status: false });
        }

        const resume = req.file ? req.file.path : null;

        const candidate = await Candidate.create({
            user,
            phoneNumber,
            address,
            resume,
            linkedinProfile,
            portfolio,
            skills: parsedSkills,
            experience: parsedExperience,
            education: parsedEducation,
            status
        });

        return res.status(201).json({ candidate, status: true });
    } catch (err) {
        console.error('Error creating candidate:', err);
        return res.status(500).json({ msg: 'Internal server error', err });
    }
};

module.exports.viewCandidate = (async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid candidate ID", status: false });
        }

        const candidate = await Candidate.findById(id).populate('user');

        if (!candidate) {
            return res.status(500).json({ msg: "no candidate found", status: false });
        }

        return res.status(201).json({ candidate, status: true });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "internal server error", err });
    }
})

module.exports.updateCandidate = (async (req, res) => {
    try {
        const { id } = req.params
        const { updateFields } = req.body

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid candidate ID", status: false });
        }

        const updatedcandidate = await Candidate.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedcandidate) {
            return res.status(500).json({ msg: "failed to update" });
        }
        return res.status(201).json({ updatedcandidate, msg: "updated successfully" });
    } catch (err) {
        return res.status(400).json({ msg: "internal server error", err });
    }
})

module.exports.deleteCandidate = (async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid candidate ID", status: false });
        }

        const deleteCandidate = await Candidate.findByIdAndDelete(id);

        if (!deleteCandidate) {
            return res.status(500).json({ msg: "failed to delete" });
        }

        return res.status(201).json({ msg: 'candidate deleted successfully' });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "internal server error", err });
    }
})