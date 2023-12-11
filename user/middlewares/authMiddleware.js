const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const { JWT_SECRET } = process.env;

// exports.userAuth = async (req, res, next) => {
//   try {
//     const token = req.header('Authorization');
//     if (!token) {
//       return res.status(401).json({ error: 'No token found, authorization denied' });
//     }

//     // Verify the token using your secret key
//     const decoded = jwt.verify(token, JWT_SECRET);

//     const user = await User.findOne({ email: decoded.email });

//     if (!user) {
//       return res.status(401).json({ error: 'User not authorized' });
//     }

//     req.email = decoded.email;
//     req.phoneNo = decoded.phoneNo;
//     req.id = user._id;

//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
exports.userAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ error: 'No token found, authorization denied' });
    }

    // Verify the token using your secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(401).json({ error: 'User not authorized' });
    }

    req.email = decoded.email;
    req.phoneNo = decoded.phoneNo;
    req.user_id = user._id;

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};