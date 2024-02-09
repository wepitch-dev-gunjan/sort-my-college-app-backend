const jwt = require("jsonwebtoken");
const Counsellor = require("../models/Counsellor");
const { generateToken } = require("../helpers/counsellorHelpers");
const { default: axios } = require("axios");
require("dotenv").config();
const { JWT_SECRET } = process.env;
const { BACKEND_URL } = process.env;

exports.counsellorAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ error: "No token found, authorization denied" });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    const counsellor = await Counsellor.findOne({ email: decoded.email });

    if (!counsellor) {
      return res.status(401).json({ error: "User not authorized" });
    }

    req.email = decoded.email;
    req.counsellor_id = decoded.counsellor_id;
    req.refresh_token = decoded.tokens.refresh_token;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.userAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ error: "No token found, authorization denied" });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    const userResponse = await axios.get(`${BACKEND_URL}/user/users`, {
      params: {
        email: decoded.email,
      },
    });

    const user = userResponse.data; // Access user data from the response

    if (!user) {
      return res.status(401).json({ error: "User not authorized" });
    }

    req.email = user.email;
    req.phone_number = decoded.phone_number;
    req.id = user._id;

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
    const decoded = jwt.verify(token, JWT_SECRET);

    let response = {};
    let responseData = {};
    if (decoded.counsellor_id) {
      response = await Counsellor.findOne({ _id: decoded.counsellor_id });
      responseData = response;
    } else if (decoded.user_id) {
      response = await axios.get(`${BACKEND_URL}/user/users`, null, {
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
    req.id = response._id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.adminOrUserAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ error: "No token found, authorization denied" });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    let response = {};
    let responseData = {};
    if (decoded.admin_id) {
      response = await axios.get(`${BACKEND_URL}/admin/admins`, null, {
        params: {
          email: decoded.email,
        },
      });
      responseData = response.data;
    } else if (decoded.user_id) {
      response = await axios.get(`${BACKEND_URL}/user/users`, null, {
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
    req.id = response._id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.adminOrCounsellorAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ error: "No token found, authorization denied" });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    let response = {};
    let responseData = {};
    if (decoded.admin_id) {
      response = await axios.get(`${BACKEND_URL}/admin/admins`, null, {
        params: {
          email: decoded.email,
        },
      });
      responseData = response.data;
    } else if (decoded.counsellor_id) {
      response = await Counsellor.findOne({ _id: decoded.counsellor_id });
      responseData = response.data;
    }

    if (!responseData) {
      return res.status(401).json({
        error: `${
          decoded.counsellor_id ? "Counsellor" : "Admin"
        } not authorized`,
      });
    }

    req.email = decoded.email;
    req.phone_number = decoded.phone_number;
    req.id = response._id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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

    const adminResponse = await axios.get(`${BACKEND_URL}/admin/admins`, null, {
      params: {
        email: decoded.email,
      },
    });

    const admin = adminResponse.data; // Access user data from the response

    if (!admin) {
      return res.status(401).json({ error: "Admin not authorized" });
    }

    req.email = admin.email;
    req.phone_number = decoded.phone_number;
    req.id = admin._id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
