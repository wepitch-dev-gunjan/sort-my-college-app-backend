const jwt = require('jsonwebtoken');
const Counsellor = require('../models/Counsellor');
const { generateToken } = require('../helpers/counsellorHelpers');
const { default: axios } = require('axios');
require('dotenv').config();
const { JWT_SECRET } = process.env;
const { BACKEND_URL } = process.env;

exports.counsellorAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'No token found, authorization denied' });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    const counsellor = await Counsellor.findOne({ email: decoded.email });

    if (!counsellor) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    req.email = decoded.email;
    req.counsellor_id = decoded.counsellor_id;
    req.refresh_token = decoded.tokens.refresh_token;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.userAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'No token found, authorization denied' });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    const userResponse = await axios.get(`${BACKEND_URL}/user/users`,
      null,
      {
        params: {
          email: decoded.email
        }
      });

    const user = userResponse.data; // Access user data from the response

    console.log(user)
    if (!user) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    req.email = decoded.email;
    req.phone_number = decoded.phone_number;
    req.id = user._id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.counsellorOrUserAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'No token found, authorization denied' });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    let response = {};
    let responseData = {};
    if (decoded.counsellor_id) {
      response = await Counsellor.findOne({ _id: decoded.counsellor_id })
      responseData = response;
    } else if (decoded.user_id) {
      response = await axios.get(`${BACKEND_URL}/user/users`,
        null,
        {
          params: {
            email: decoded.email
          }
        });
      responseData = response.data;
    }

    if (!responseData) {
      return res.status(401).json({
        error: `${decoded.user_id ? "User" : "Counsellor"} not authorized`
      });
    }

    req.email = decoded.email;
    req.phone_number = decoded.phone_number;
    req.id = response._id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'No token found, authorization denied' });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    let response = {};
    if (decoded.counsellor_id) {
      response = await Counsellor.findOne({ _id: decoded.counsellor_id })
    } else if (decoded.user_id) {
      response = await axios.get(`${BACKEND_URL}/user/users`,
        null,
        {
          params: {
            email: decoded.email
          }
        });
    }

    const responseData = response.data;
    if (!responseData) {
      return res.status(401).json({
        error: `${decoded.user_id ? "User" : "Counsellor"} not authorized`
      });
    }

    req.email = decoded.email;
    req.phone_number = decoded.phone_number;
    req.id = user._id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
