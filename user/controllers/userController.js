const User = require("../models/User");

// GET
exports.getUsers = async (req, res) => {
  try {
    res.send('hello')
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// POST
exports.createUser = async (req, res) => {
  try {
    // Extract user data from the request body
    const { personal_info, email, password, /* other user fields */ } = req.body;

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create a new user instance
    const newUser = new User({
      personal_info,
      email,
      password, // You should hash the password before saving it in a production environment
      // Add other user fields here
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with a success message
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getSingleUser = async (req, res) => {
  try {

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}