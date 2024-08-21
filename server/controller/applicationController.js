const Application = require('../models/applicationModel');
const Candidate = require('../models/candidateModel')
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other service
    auth: {
        // Your email password or application-specific password
    }
});

module.exports.createApplication = (async (req, res) => {
    try {
        const { candidate, job, } = req.body;

        if (!mongoose.Types.ObjectId.isValid(candidate)) {
            return res.status(400).json({ msg: "Invalid candidate ID", status: false });
        }

        if (!mongoose.Types.ObjectId.isValid(job)) {
            return res.status(400).json({ msg: "Invalid job ID", status: false });
        }

        const application = await Application.create({
            candidate,
            job
        })

        return res.status(201).json({ msg: "application submitted successfully", application })

    } catch (err) {
        return res.status(400).json({ msg: "internal server error", err });
    }
})


module.exports.updateApplicationStatus = (async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        if (!id) {
            return res.status(404).json({ msg: "no application available" });
        }

        if (!status) {
            return res.status(404).json({ msg: "please input a status to update" });
        }

        if (status === "Rejected") {
            if (!rejectionReason) {
                return res.json({ msg: "rejection reason is required" });
            }
        }

        // Update the application status
        const updateApplication = await Application.findByIdAndUpdate(id, { status, rejectionReason }, { new: true });

        if (!updateApplication) {
            return res.status(500).json({ msg: "failed to update" });
        }

        // Fetch the candidate and populate the user
        const candidate = await Candidate.findById(updateApplication.candidate).populate('user');

        if (!candidate || !candidate.user) {
            return res.status(500).json({ msg: "candidate or user not found" });
        }

        const { email, fullname } = candidate.user;

        const mailOptions = {
            from: "",
            to: email,
            subject: 'Application Status Updated',
            text: `Dear ${fullname},\n\nYour application status has been updated to "${status}".${status === 'Rejected' ? `\n\nReason for rejection: ${rejectionReason}` : ''}\n\nBest regards,\nYour Company`
        };

        await transporter.sendMail(mailOptions);

        return res.json({ msg: "status updated successfully and email sent" });

    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "internal server error", err });
    }
});

module.exports.getApplicationById = (async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(404).json({ msg: "no application available" })
        }

        const application = await Application.findById(id)

        if (!application) {
            return res.status(500).json({ msg: "failed to find the application" })
        }

        return res.status(200).json({ msg: "application fetched successfully", application });
    } catch (err) {
        console.log(err);
        return res.status(400).json({ msg: "internal server error", err });
    }
})

module.exports.getAllApplication = (async (req, res) => {
    try {
        const applications = await Application.find({});

        if (applications.length === 0) {
            return res.status(404).json({ msg: "No applications found" });
        }

        return res.status(200).json({ msg: "Applications fetched successfully", applications });
    } catch (err) {
        console.error("Error fetching applications:", err);
        return res.status(500).json({ msg: "Internal server error", error: err.message });
    }
});

module.exports.getApplicationStatus = async (req, res) => {
    try {
        const { candidateId, jobId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(candidateId) || !mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ msg: "Invalid candidate or job ID", status: false });
        }

        const application = await Application.findOne({ candidate: candidateId, job: jobId });

        if (!application) {
            return res.status(404).json({ msg: "Application not found", status: false });
        }

        return res.status(200).json({ msg: "Application status fetched successfully", application });
    } catch (err) {
        return res.status(400).json({ msg: "Internal server error", err });
    }
};

module.exports.getCandidatesByJobId = async (req, res) => {
    try {
        const { jobId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({ msg: "Invalid job ID", status: false });
        }

        const applications = await Application.find({ job: jobId }).populate('candidate')

        if (applications.length === 0) {
            return res.status(404).json({ msg: "No applications found for this job", status: false });
        }

        return res.status(200).json({ msg: "Applications fetched successfully", applications });
    } catch (err) {
        console.error("Error fetching applications:", err);
        return res.status(500).json({ msg: "Internal server error", error: err.message });
    }
};