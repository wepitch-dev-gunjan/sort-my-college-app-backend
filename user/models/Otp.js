const { Schema, model } = require('mongoose');

const otpSchema = new Schema({
  phone_number: {
    type: Number,
    unique: true,
    sparse: true,
    default: null
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    default: null
  },
  hashedOtp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date, // Store the expiration time
    required: true,
  },
  attempts: {
    type: Number, // Store the number of verification attempts
    default: 0,
  },
}, {
  timestamps: true
}, {
  strict: false
});

module.exports = model('Otp', otpSchema);
