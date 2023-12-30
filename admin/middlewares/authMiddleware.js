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
