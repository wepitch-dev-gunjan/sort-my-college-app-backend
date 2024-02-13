const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");
const Admin = require("../models/Admin");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const { BACKEND_URL } = process.env;

exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ error: "No token found, authorization denied" });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    const admin = await Admin.findOne({ email: decoded.email });

    if (!admin) {
      return res.status(401).json({ error: "Admin not authorized" });
    }

    req.email = decoded.email;
    req.admin_id = decoded.admin_id;
    req.refresh_token = decoded.tokens.refresh_token;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.counsellorOrUserAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ error: "No token found, authorization denied" });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Update JWT_SECRET to use process.env

    let response = {};
    let responseData = {};
    if (decoded.counsellor_id) {
      response = await axios.get(`${process.env.BACKEND_URL}/counselor/counsellors/find-one`, { // Update BACKEND_URL to use process.env
        params: {
          email: decoded.email
        }
      });
      console.log(response.data);
      responseData = response.data;
    } else if (decoded.user_id) {
      response = await axios.get(`${process.env.BACKEND_URL}/user/users`, { // Update BACKEND_URL to use process.env
        params: {
          email: decoded.email,
        },
      });
      responseData = response.data;
    }

    if (!responseData) {
      return res.status(401).json({
        error: `${decoded.user_id ? "User" : "Counsellor"} not authorized`,
      });
    }

    req.email = decoded.email;
    req.phone_number = decoded.phone_number;
    req.id = responseData._id; // Update response to responseData

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

