const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    username: {
      type: String,
      default: "ADMIN",
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      default: "ADMIN",
    },
    email: {
      type: String,
    },
    profile_pic: {
      type: String,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = model("Admin", adminSchema);
