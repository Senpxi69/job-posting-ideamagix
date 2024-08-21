const express = require('express')
const { createCandidates, viewCandidate, updateCandidate, deleteCandidate } = require('../controller/candidateController');
const { authMiddleware } = require('../middleware/auth');
const { upload } = require("../controller/candidateController");

const router = express.Router();

router.post('/create-candidate', upload.single('resume'), createCandidates);

router.get('/view-candidate/:id', viewCandidate);

router.put('/update-candidate/:id', authMiddleware, updateCandidate);

router.delete('/delete-candidate/:id', authMiddleware, deleteCandidate);

module.exports = router