// services/authService.js
const OTP_LENGTH = 4; // Length of the OTP

// Simulated temporary storage for OTPs (Replace with a database in production)
const otpCache = new Map();

// Function to generate a random OTP
exports.generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
  return otp.toString();
};

// Function to send OTP via SMS (Replace with actual SMS gateway integration)
exports.sendOTPViaSMS = async (phoneNumber, otp) => {
  try {
    // Implement code to send SMS using an SMS gateway library (e.g., Twilio, Nexmo)
    // Replace this with the actual code to send an SMS
    // Example (using Twilio):
    // const twilio = require('twilio');
    // const client = new twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');
    // const message = await client.messages.create({
    //   body: `Your OTP is: ${otp}`,
    //   from: 'YOUR_TWILIO_PHONE_NUMBER',
    //   to: phoneNumber,
    // });

    // For the sake of this example, we'll just log the OTP
    console.log(`OTP sent to ${phoneNumber}: ${otp}`);
  } catch (error) {
    console.error('Error sending OTP via SMS:', error);
    throw error;
  }
};

// Function to verify OTP
exports.verifyOTP = async (phoneNumber, userOTP) => {
  try {
    const storedOTP = otpCache.get(phoneNumber);

    if (!storedOTP) {
      return false; // OTP not found in cache, likely expired or never generated
    }

    // Compare the user-provided OTP with the stored OTP
    return userOTP === storedOTP;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};
