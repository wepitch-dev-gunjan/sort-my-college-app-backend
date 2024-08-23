const express = require('express');
const router = express.Router();
const {
  generateOtpByPhone,
  generateOtpByEmail,
  verifyOtpByPhoneForRegistration,
  verifyOtpByEmail,
  verifyOtpByPhoneForLogIn,
} = require("../services/authService");

// Route to send OTP by Phone
router.post('/auth/sendOTPPhone', generateOtpByPhone);

// Route to verify OTP by Phone for Register
router.post('/auth/register/verifyOTPPhone', verifyOtpByPhoneForRegistration);

// Route to verify OTP by Phone for Login
router.post("/auth/login/verifyOTPPhone", verifyOtpByPhoneForLogIn);

// Route to send OTP by Email
router.post('/auth/sendOTPEmail', generateOtpByEmail);

// Route to verify OTP by Email
router.post('/auth/verifyOTPEmail', verifyOtpByEmail);

module.exports = router;