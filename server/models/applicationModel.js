const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    candidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    status: {
        type: String,
        enum: ['Applied', 'Reviewed', 'Interview Scheduled', 'Rejected'],
        default: "Applied",
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    rejectionReason: {
        type: String,
        required: function () { return this.status === 'Rejected'; },
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
