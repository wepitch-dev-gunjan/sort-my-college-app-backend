const express = require('express');
const router = express.Router();
const { generateOtpByPhone, generateOtpByEmail, verifyOtpByPhone, verifyOtpByEmail } = require('../services/authService');

// Route to send OTP by Phone
router.post('/auth/sendOTPPhone', generateOtpByPhone);

// Route to verify OTP by Phone
router.post('/auth/verifyOTPPhone', verifyOtpByPhone);

// Route to send OTP by Email
router.post('/auth/sendOTPEmail', generateOtpByEmail);

// Route to verify OTP by Email
router.post('/auth/verifyOTPEmail', verifyOtpByEmail);

module.exports = router;