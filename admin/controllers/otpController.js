const crypto = require("crypto");
const Otp = require("../models/otp");
const Admin = require("../models/Admin")
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;
require("dotenv").config();

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:9000";
const MSG91_API_URL = process.env.MSG91_API_URL;
const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_KEY = process.env.MSG91_TEMPLATE_KEY;

exports.generateOtp = async (req, res) => {
  try {
    const { phone_number } = req.body;

    if (!phone_number) {
      return res.status(400).send({ error: "Phone number is required" });
    }

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




exports.verifyOtp = async (req, res) => {
  try {
    const { email, phone_number, otp } = req.body;

    if (!email || !phone_number || !otp) {
      return res.status(400).send({ error: "Email, phone number, and OTP are required" });
    }

    // Admin find karo email se
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).send({ error: "Admin not found" });
    }

    // OTP verify karo phone_number se
    let otpObj = await Otp.findOne({ phone_number });

    if (!otpObj) {
      return res.status(404).send({ error: "Phone number not found" });
    }

    if (otpObj.attempts >= 3 || new Date() > otpObj.expiresAt) {
      return res.status(401).send({ error: "Invalid OTP token" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== otpObj.hashedOtp) {
      otpObj.attempts++;
      await otpObj.save();
      return res.status(401).send({ error: "Invalid OTP token" });
    }

    // Token generate karo email & admin_id ke sath
    const token = jwt.sign({ email: admin.email, admin_id: admin._id }, JWT_SECRET);

    res.status(200).send({
      message: "OTP verified successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
};