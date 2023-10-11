const crypto = require('crypto');
const Otp = require('../models/Otp');
const User = require('../models/User');

// Generate and store a 4-Digit OTP for a User
exports.generateOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).send({ error: "Phone number is required" });

    const user = await User.findOne({ phoneNumber });
    if (user && user.verified === true) return res.status(400).send({ error: "User is already verified" })
    // Generate a random 4-digit OTP
    console.log(user);
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Hash the OTP using SHA-256 for storage
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const expirationTime = new Date(); // Set the expiration time (e.g., 5 minutes from now)
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    let otpObj = await Otp.findOne({ phoneNumber });
    if (otpObj) {
      otpObj.expiresAt = expirationTime;
      otpObj.hashedOtp = hashedOtp;
      otpObj.attempts = 0;
    } else {
      otpObj = new Otp({
        phoneNumber,
        hashedOtp,
        expiresAt: expirationTime,
      });
    }

    await otpObj.save();
    // Send the OTP to the client (avoid logging it)
    res.status(200).send({
      message: "OTP sent to the client",
      otp
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

// Verify the 4-Digit OTP sent by the client
exports.verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    const isPhoneNumber = await User.findOne({ phoneNumber });
    if (isPhoneNumber && isPhoneNumber.verified === true) return res.status(401).send({
      error: "Phone number is already verified"
    });

    let otpObj = await Otp.findOne({ phoneNumber });

    if (!otpObj) return res.status(404).send({ error: "Phone number not found" });

    if (otpObj.attempts >= 3 || new Date() > otpObj.expiresAt) {
      // Handle cases where too many attempts or OTP expiration
      return res.status(401).send({ error: "Invalid OTP token" });
    }

    // Hash the received OTP from the client
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Verify if the hashed OTP from the client matches the hashed OTP stored in your data storage
    if (hashedOtp !== otpObj.hashedOtp) {
      // Increment the attempts on failed verification
      otpObj.attempts++;
      await otpObj.save();
      return res.status(401).send({ error: "Invalid OTP token" });
    }

    // If OTP is valid, you can proceed with user verification
    const user = new User({
      phoneNumber,
      verified: true,
    });

    await user.save();
    res.status(200).send({ message: "User has verified OTP" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};
