const Counsellor = require("../models/Counsellor");
const bcrypt = require('bcryptjs'); // Required for password hashing
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email is empty
    if (!email) {
      return res.status(400).send({
        error: "Email cannot be empty"
      });
    }

    // Check if password is empty
    if (!password) {
      return res.status(400).send({
        error: "Password cannot be empty"
      });
    }

    // Check if the email already exists
    const existingCounsellor = await Counsellor.findOne({ email });
    if (existingCounsellor) {
      return res.status(400).send({
        error: "This email already exists"
      });
    }

    // Perform password validation
    if (password.length < 6) {
      return res.status(400).send({
        error: "Password should be at least 6 characters long"
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    // Create a new counsellor with the hashed password
    const newCounsellor = new Counsellor({
      email,
      password: hashedPassword // Store the hashed password in the database
      // Add other required fields as needed
    });

    // Save the new counsellor to the database
    await newCounsellor.save();

    res.status(201).send({
      message: "Counsellor registered successfully"
    });
  } catch (error) {
    res.status(500).send({
      error: "Server error"
    });
  }
});

module.exports = router;
