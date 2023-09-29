const User = require("../models/User");

exports.getUserIdByEmail = (email) => {
  return User.findOne({ email });
}