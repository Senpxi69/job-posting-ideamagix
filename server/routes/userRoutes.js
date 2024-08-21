const express = require('express');
const { login, register, forgotPassword, verifyOtp, changePassword } = require('../controller/userController');

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOtp);

router.post("/change-password", changePassword);

module.exports = router;
