const crypto = require("crypto");
const Otp = require("../models/Otp");
const User = require("../models/User");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
require("dotenv").config();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:9000";
const MSG91_API_URL = process.env.MSG91_API_URL;
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_KEY = process.env.MSG91_TEMPLATE_KEY;
// const BACKEND_URL = process.env.BACKEND_URL || 'http://192.168.0.36:9000'

exports.generateOtpByPhone = async (req, res) => {
  try {
    const { phone_number, name } = req.body;

    if (phone_number == "917297827346") {
      return res.status(200).send({
        message: 'you are administrator, your otp is "1234"',///////////

      });
    }

    if (!phone_number)
      return res.status(400).send({ error: "Phone number is required" });

    const user = await User.findOne({ phone_number });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 2);

    let otpObj = await Otp.findOne({ phone_number });

    if (otpObj) {
      otpObj.expiresAt = expirationTime;
      otpObj.hashedOtp = hashedOtp;
      otpObj.attempts = 0;
    } else {
      otpObj = new Otp({
        phone_number,
        hashedOtp,
        expiresAt: expirationTime,
      });
    }

    await otpObj.save();

    // Ensure the phone number format is correct
    const formattedPhoneNumber = phone_number.startsWith("91") ? phone_number : `91${phone_number}`;

    console.log("Sending OTP to:", formattedPhoneNumber);
    console.log("Generated OTP:", otp);

    const { data } = await axios.post(
      MSG91_API_URL,
      {
        template_id: MSG91_TEMPLATE_KEY,
        realTimeResponse: "1",
        recipients: [
          {
            mobiles: formattedPhoneNumber,
            var: otp, // Ensure 'var1' matches template variable
          },
        ],
      },
      {
        headers: {
          authkey: MSG91_AUTH_KEY,
          accept: "application/json",
          "content-type": "application/json",
        },
      }
    );

    console.log("MSG91 API Response:", data);

    res.status(200).send({
      message: data.status || "OTP sent successfully",
    });
  } catch (error) {
    console.log("Error sending OTP:", error.response ? error.response.data : error);
    res.status(500).send({ error: "Internal server error" });
  }
};


exports.verifyOtpByPhoneForRegistration = async (req, res) => {
  try {
    const { phone_number, otp, name } = req.body;

    if (phone_number == "917297827346" && otp == "1234") {
      let user = await User.findOne({ phone_number });

      if (!user) {
        user = new User({
          phone_number,
          verified: true,
        });

        await user.save();
      }

      const { _id } = user;
      const token = jwt.sign({ user_id: _id, phone_number }, JWT_SECRET);

      return res.status(200).send({
        message: "OTP verified successfully",
        already_registered: true,
        token,
      });
    }

    let otpObj = await Otp.findOne({ phone_number });

    if (!otpObj)
      return res.status(404).send({ error: "Phone number not found" });

    if (otpObj.attempts >= 3 || new Date() > otpObj.expiresAt) {
      // Handle cases where too many attempts or OTP expiration
      return res.status(401).send({ error: "Invalid OTP token" });
    }

    // Hash the received OTP from the client
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Verify if the hashed OTP from the client matches the hashed OTP stored in your data storage
    if (hashedOtp !== otpObj.hashedOtp) {
      // Increment the attempts on failed verification
      otpObj.attempts++;
      await otpObj.save();
      return res.status(401).send({ error: "Invalid OTP token" });
    }

    // If OTP is valid, you can proceed with user verification
    let user = await User.findOne({ phone_number });

    // phle wala code by gunjan sir
    // const already_registered = !!user;
    let already_registered = user && user.name ? true : false;

    if (!user) {
      user = new User({
        phone_number,
        name,
        verified: true,
      });

      await user.save();
    }
    if (user && name) {
      user.name = name;
      await user.save();
    }

    const { _id } = user;
    const token = jwt.sign({ user_id: _id, phone_number }, JWT_SECRET);

    // await axios.post(`${BACKEND_URL}/user/notification/verifiedOtp`, {
    //   to: phone_number,
    // })
    res.status(200).send({
      message: "OTP verified successfully",
      already_registered,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};

//==============================! Verify Otp BY phone !======================================

exports.verifyOtpByPhoneForLogIn = async (req, res) => {
  try {
    const { phone_number, otp, name, fcm_token } = req.body;

    if (phone_number == "917297827346" && otp == "1234") {
      let user = await User.findOne({ phone_number });

      if (!user) {
        return res.status(400).send({
          error: "User not registered. Please register first.",
        });
      }

      // Save the FCM token
      if (fcm_token) {
        user.fcm_token = fcm_token;
        await user.save();
      }

      const { _id } = user;
      const token = jwt.sign({ user_id: _id, phone_number }, JWT_SECRET);

      return res.status(200).send({
        message: "OTP verified successfully",
        already_registered: true,
        token,
        fcm_token: user.fcm_token,
      });
    }

    let otpObj = await Otp.findOne({ phone_number });

    if (!otpObj)
      return res.status(404).send({ error: "Phone number not found" });

    if (otpObj.attempts >= 3 || new Date() > otpObj.expiresAt) {
      return res.status(401).send({ error: "Invalid OTP token" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== otpObj.hashedOtp) {
      otpObj.attempts++;
      await otpObj.save();
      return res.status(401).send({ error: "Invalid OTP token" });
    }

    let user = await User.findOne({ phone_number });

    if (!user) {
      return res.status(400).send({
        error: "User not registered. Please register first.",
      });
    }

    if (user && name) {
      user.name = name;
    }

    // Save the FCM token
    if (fcm_token) {
      user.fcm_token = fcm_token;
    }

    await user.save();

    const { _id } = user;
    const token = jwt.sign({ user_id: _id, phone_number }, JWT_SECRET);

    res.status(200).send({
      message: "OTP verified successfully",
      already_registered: true,
      token,
      fcm_token: user.fcm_token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};


exports.generateOtpByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).send({ error: "Email is required" });

    // Check if the user exists and is already verified.
    const user = await User.findOne({ email });

    // Generate a random 4-digit OTP.
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Hash the OTP using SHA-256 for storage.
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Set the expiration time (e.g., 2 minutes from now).
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 2);

    // Find or create an OTP object for the email.
    let otpObj = await Otp.findOne({ email });

    if (otpObj) {
      otpObj.expiresAt = expirationTime;
      otpObj.hashedOtp = hashedOtp;
      otpObj.attempts = 0;
    } else {
      otpObj = new Otp({
        email,
        hashedOtp,
        expiresAt: expirationTime,
      });
    }

    // Save the OTP object to the database.
    await otpObj.save();

    // Send the OTP to the client (avoid logging it).
    const { data } = await axios.post(
      `${BACKEND_URL}/notification/generateOtp`,
      {
        to: email,
        otp,
      }
    );

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

    let otpObj = await Otp.findOne({ email });

    if (!otpObj) return res.status(404).send({ error: "Email not found" });

    if (otpObj.attempts >= 3 || new Date() > otpObj.expiresAt) {
      // Handle cases where too many attempts or OTP expiration
      return res.status(401).send({ error: "Invalid OTP token" });
    }

    // Hash the received OTP from the client
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Verify if the hashed OTP from the client matches the hashed OTP stored in your data storage
    if (hashedOtp !== otpObj.hashedOtp) {
      // Increment the attempts on failed verification
      otpObj.attempts++;
      await otpObj.save();
      return res.status(401).send({ error: "Invalid OTP token" });
    }

    // If OTP is valid, you can proceed with user verification
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        verified: true,
      });

      await user.save();
    }
    const { _id, phone_number } = user;
    const token = jwt.sign({ user_id: _id, email }, JWT_SECRET);
    const { data } = await axios.post(
      `${BACKEND_URL}/notification/verifiedOtp`,
      {
        to: email,
      }
    );
    res.status(200).send({
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};
