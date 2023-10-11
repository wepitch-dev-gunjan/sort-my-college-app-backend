const express = require('express');
const router = express.Router();
const { generateOtp, verifyOtp } = require('../services/authService');

// Route to send OTP
router.post('/auth/sendOTP', generateOtp);

// Route to verify OTP
router.post('/auth/verifyOTP', verifyOtp);

module.exports = router;