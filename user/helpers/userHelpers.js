const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
exports.generateToken = (user, expiresIn) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn });
};

exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log(error)
    return null;
  }
}