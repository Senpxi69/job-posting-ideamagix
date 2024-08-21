const { createApplication, updateApplicationStatus, getApplicationById, getAllApplication, getApplicationStatus, getCandidatesByJobId } = require('../controller/applicationController');

const { authMiddleware } = require('../middleware/auth')

const express = require('express');

const router = express.Router();

router.post('/create-application', authMiddleware, createApplication);

router.put('/update-status/:id', authMiddleware, updateApplicationStatus);

router.get('/application-id/:id', authMiddleware, getApplicationById);

router.get('/all', authMiddleware, getAllApplication);

router.get('/status/:candidateId/:jobId', authMiddleware, getApplicationStatus);

router.get('/candidates/:jobId', getCandidatesByJobId);

module.exports = router;