const { Schema, model } = require("mongoose");

const SuperAdmin = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  profile_pic: {
    type: String,
  },
});

module.exports = model("SuperAdmin", SuperAdmin);
