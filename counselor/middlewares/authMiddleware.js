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
    const cookie = req.headers.cookie;
    console.log(cookie)
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
    req.counsellor_id = counsellor._id;
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

    const userResponse = await axios.get(`${BACKEND_URL}/user/users`, {
      params: {
        email: decoded.email
      }
    });

    console.log(decoded)
    const user = userResponse.data; // Access user data from the response

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
