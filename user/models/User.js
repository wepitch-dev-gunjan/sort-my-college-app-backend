const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  phone_number: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  date_of_birth: {
    type: String
  },
  location: {
    city: String
  },
  profile_pic: {
    type: String,
  },
  education_level: {
    type: String,
    enum: ['Student', 'College', 'Graduated'],
    default: 'Student'
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
}, {
  strict: false
});

module.exports = model('User', userSchema);
