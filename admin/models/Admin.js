const { Schema, model } = require("mongoose");

const Admin = new Schema({
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

module.exports = model("Admin", Admin);
