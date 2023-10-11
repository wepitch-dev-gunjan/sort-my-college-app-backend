const { Schema, model } = require('mongoose');

const otpSchema = new Schema({
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
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
});

module.exports = model('Otp', otpSchema);
