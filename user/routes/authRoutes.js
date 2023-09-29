const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP } = require('../controllers/authController');

// Route to send OTP
router.post('auth/phone/sendOTP', sendOTP);

// Route to verify OTP
router.post('auth/verifyOTP', verifyOTP);

module.exports = router;