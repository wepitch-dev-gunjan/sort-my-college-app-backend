const crypto = require('crypto');
const Otp = require('../models/Otp');
const User = require('../models/User');
const axios = require('axios');
require('dotenv').config();

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:9000'

exports.generateOtpByPhone = async (req, res) => {
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

    axios.post(`${BACKEND_URL}/user/notification/generateOtp`, {
      body: {
        to: user.email,
        otp
      }
    })
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

exports.verifyOtpByPhone = async (req, res) => {
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
    await axios.post(`${BACKEND_URL}/user/notification/verifiedOtp`, {
      body: {
        to: user.email,
      }
    })
    res.status(200).send({ message: "User has verified OTP" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.generateOtpByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ error: "Email is required" });
    }

    // Check if the user exists and is already verified.
    const user = await User.findOne({ email });
    if (user && user.verified === true) {
      return res.status(400).send({ error: "User is already verified" });
    }

    // Generate a random 4-digit OTP.
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Hash the OTP using SHA-256 for storage.
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Set the expiration time (e.g., 2 minutes from now).
    const expirationTime = new Date();
    console.log('hi')
    expirationTime.setMinutes(expirationTime.getMinutes() + 2);

    // Find or create an OTP object for the email.
    let otpObj = await Otp.findOne({ email });

    if (otpObj) {
      // Update the existing OTP object.
      otpObj.expiresAt = expirationTime;
      otpObj.hashedOtp = hashedOtp;
      otpObj.attempts = 0;
    } else {
      // Create a new OTP object.
      otpObj = new Otp({
        email,
        hashedOtp,
        expiresAt: expirationTime,
      });
    }

    // Save the OTP object to the database.
    await otpObj.save();

    // Send the OTP to the client (avoid logging it).
    const { data } = await axios.post(`${BACKEND_URL}/notification/generateOtp`, {
      to: email,
      otp,
    });

    // Respond with a success message.
    res.status(200).send({
      message: data.message,
      otp: undefined, // Don't send the OTP in the response.
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

exports.verifyOtpByEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const isemail = await User.findOne({ email });
    if (isemail && isemail.verified === true) return res.status(401).send({
      error: "Email is already verified"
    });

    let otpObj = await Otp.findOne({ email });

    if (!otpObj) return res.status(404).send({ error: "Email not found" });

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
      email,
      verified: true,
    });

    await user.save();
    const { data } = await axios.post(`${BACKEND_URL}/notification/verifiedOtp`, {
      to: email,
    })
    res.status(200).send({ message: "OTP verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};
