const express = require('express');
const router = express.Router();

// Import job controllers
const {
    createJob,
    viewJob,
    updateJob,
    deleteJob,
    getAllJob,
    getJobsByAdmin,
    getApplicationsForAdminJobs
} = require('../controller/jobController');
const { authMiddleware } = require('../middleware/auth');

router.post('/create-job', authMiddleware, createJob);

router.get('/view-job/:id', authMiddleware, viewJob);

router.put('/update-job/:id', authMiddleware, updateJob);

router.delete('/delete-job/:id', authMiddleware, deleteJob);

router.get('/all-job', authMiddleware, getAllJob);

router.get('/:adminId/jobs', authMiddleware, getJobsByAdmin);
module.exports = router;
