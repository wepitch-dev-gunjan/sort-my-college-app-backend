const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Counsellor = require('../models/Counsellor');
require('dotenv').config();
const { JWT_SECRET } = process.env;

exports.userAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'No token found, authorization denied' });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);
    req.email = decoded.email;
    req.phoneNo = decoded.phoneNo;

    const user = await User.findOne({ email: req.email, phoneNo: req.phoneNo });

    if (!user) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.counsellorAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'No token found, authorization denied' });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);
    req.email = decoded.email;
    req.phoneNo = decoded.phoneNo;

    const counsellor = await Counsellor.findOne({ email: req.email, phoneNo: req.phoneNo });

    if (!counsellor) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};