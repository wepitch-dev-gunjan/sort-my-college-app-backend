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
  gender: {
    type: String,
    default: 'Male',
    enum: ['Male', 'Female', 'Other']
  },
  date_of_birth: {
    type: Date,
    default: new Date()
  }
}, {
  timestamps: true
}, {
  strict: true
});

module.exports = model("Admin", Admin);
