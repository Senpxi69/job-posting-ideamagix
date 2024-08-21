const Jobs = require('../models/jobModel');
const Applications = require('../models/applicationModel')
const mongoose = require('mongoose');


module.exports.createJob = (async (req, res) => {
    try {
        const { title, company, category, type, tags, skills, experienceRequired, description, salary, additionalFields, createdBy } = req.body;

        if (!title || !company || !category || !type || !experienceRequired || !description || !salary || !createdBy) {
            return res.status(400).json({ msg: 'All fields are required', status: false });
        }

        const job = await Jobs.create({ title, company, category, type, tags, skills, experienceRequired, description, salary, additionalFields, createdBy });

        return res.status(201).json({ job, status: true });
    } catch (err) {
        return res.status(500).json({ msg: 'Error creating job', err });
    }
});

module.exports.viewJob = (async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid job ID", status: false });
        }

        const job = await Jobs.findById(id);

        if (!job) {
            return res.status(404).json({ msg: "Job not found", status: false });
        }

        return res.status(200).json({ job, status: true });
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", err });
    }
});

module.exports.updateJob = (async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid job ID", status: false });
        }

        const updatedJob = await Jobs.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedJob) {
            return res.status(404).json({ msg: "Failed to update job", status: false });
        }

        return res.status(200).json({ updatedJob, msg: "Job updated successfully", status: true });
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", err });
    }
});

module.exports.deleteJob = (async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid job ID", status: false });
        }

        const deleteJob = await Jobs.findByIdAndDelete(id);

        if (!deleteJob) {
            return res.status(404).json({ msg: "Failed to delete job", status: false });
        }

        return res.status(200).json({ msg: 'Job deleted successfully', status: true });
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", err });
    }
});

module.exports.getAllJob = (async (req, res) => {
    try {
        const jobs = await Jobs.find({});

        if (jobs.length === 0) {
            return res.status(404).json({ msg: "No jobs found", status: false });
        }

        return res.status(200).json({ msg: "Jobs fetched successfully", jobs, status: true });
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", err });
    }
});

module.exports.getJobsByAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(400).json({ msg: "Invalid admin ID", status: false });
        }

        const jobs = await Jobs.find({ createdBy: adminId });

        if (jobs.length === 0) {
            return res.json({ msg: "No jobs available right now", status: false });
        }

        return res.status(200).json({ msg: "Jobs fetched successfully", jobs, status: true });
    } catch (err) {
        return res.status(500).json({ msg: "Internal server error", err });
    }
};