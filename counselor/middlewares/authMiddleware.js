const jwt = require('jsonwebtoken');
const Counsellor = require('../models/Counsellor');
const { generateToken } = require('../helpers/counsellorHelpers');
require('dotenv').config();
const { JWT_SECRET } = process.env;

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
    req.phoneNo = decoded.phoneNo;
    req.id = counsellor._id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};