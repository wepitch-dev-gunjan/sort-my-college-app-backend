const User = require("../models/User");
require("dotenv");

const { BACKEND_URL } = process.env;

exports.register = async (req, res) => {
  try {
    const { user_id } = req;
    const { name, date_of_birth, gender, education_level } = req.body;

    if (!name || !date_of_birth || !gender || !education_level)
      return res.status(400).send({
        error: "Required fields not provided",
      });

    const user = await User.findOne({ _id: user_id });
    user.name = name;
    user.date_of_birth = date_of_birth;
    user.gender = gender;
    user.education_level = education_level;

    await user.save();

    res.status(200).send({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editUser = async (req, res) => {
  try {
    const { user_id } = req;
    const { phone_number, name, gender, date_of_birth, location, profile_pic } =
      req.body;

    if (!phone_number) {
      return res.status(400).json({
        error: "Provide  phone_number to identify the user.",
      });
    }
    // console.log(req.body);
    const query = {};
    query._id = user_id;

    // Find the user based on email or phone_number
    // if (email) query.email = email;
    if (phone_number) query.phone_number = phone_number;

    let user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Update user information
    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (date_of_birth) user.date_of_birth = date_of_birth;
    if (location && location.city) {
      if (!user.location) user.location = {};
      user.location.city = location.city;
    }
    if (profile_pic) user.profile_pic = profile_pic;

    // Save the updated user
    await user.save();

    return res.status(200).json({
      message: "User information updated successfully.",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal  Server Error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { phone_number } = req;
    const user = await User.find({ phone_number });

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.findOneUser = async (req, res) => {
  try {
    const { email, user_id } = req.query;
    const query = {};
    if (email) query.email = email;
    if (user_id) query._id = user_id;

    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.rescheduleRequest = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.cancelRequest = (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.saveCounsellor = async (req, res) => {
  try {
    const { user_id } = req;
    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { counsellor_id } = req.body;
    if (user.saved_counsellors.includes(counsellor_id))
      return res.status(400).json({ error: "Counsellor is already saved" });

    user.saved_counsellors.push(counsellor_id);

    await user.save();
    res.status(200).send({ messeage: "Counsellor successfully saved" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.unsaveCounsellor = async (req, res) => {
  try {
    const { user_id } = req;
    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { counsellor_id } = req.body;
    if (!user.saved_counsellors.includes(counsellor_id))
      return res.status(404).json({ error: "Counsellor is already unsaved" });

    user.saved_counsellors.filter(
      (counsellorId) => counsellorId !== counsellor_id
    );

    await user.save();
    res.status(200).send({ message: "Counsellor unsaved successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getUsersForAdmin = async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(404).send({ error: "No Users found" });
    }

    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getSingleUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await User.findOne({ _id: user_id });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "No user found with this ID" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal user Server Error" });
  }
};
