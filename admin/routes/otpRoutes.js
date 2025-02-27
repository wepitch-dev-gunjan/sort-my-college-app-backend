const express = require("express");
const { generateOtp, verifyOtp } = require("../controllers/otpController");

const router = express.Router();

router.post("/generate-otp-for-admin", generateOtp);
router.post("/veryfy-otp-for-admin", verifyOtp);

module.exports = router;
