// controllers/authController.js
const authService = require('../services/authService');

// Controller to send OTP to the user's phone number
exports.sendOTPPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const otp = await generateOTP();

    // Send the OTP via SMS (You will need to implement this)
    await sendOTPViaSMS(phoneNumber, otp);

    // Store the OTP and phone number in a temporary cache or database
    // with an expiration time for verification

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to verify OTP
exports.verifyOTPPhone = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Verify the OTP against the stored OTP for the given phone number
    const isOTPValid = await verifyOTP(phoneNumber, otp);

    if (isOTPValid) {
      // If OTP is valid, you can proceed with user authentication
      // Generate authentication tokens, log the user in, etc.

      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(401).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to send OTP to the user's email
exports.sendOTPEmail = async (req, res) => {
  try {
    const { email } = req.body.phoneNumber;
    const otp = await generateOTP();

    // Send the OTP via SMS (You will need to implement this)
    await sendOTPViaSMS(phoneNumber, otp);

    // Store the OTP and phone number in a temporary cache or database
    // with an expiration time for verification

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to verify OTP
exports.verifyOTPEmail = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Verify the OTP against the stored OTP for the given phone number
    const isOTPValid = await verifyOTP(phoneNumber, otp);

    if (isOTPValid) {
      // If OTP is valid, you can proceed with user authentication
      // Generate authentication tokens, log the user in, etc.

      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(401).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
