const User = require("../models/User");

exports.editUser = async (req, res) => {
  try {
    const { user_id } = req;
    const { email, phone_number, name, gender, date_of_birth, location, profile_pic } = req.body;

    // Check if either email or phone_number is provided
    if (!email && !phone_number) {
      return res.status(400).json({ error: 'Provide either email or phone_number to identify the user.' });
    }

    // Find the user based on email or phone_number
    const query = email ? { email } : { phone_number };
    const user = await User.findOne(query);

    // If user not found, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Update user information
    if (name) user.name = name;
    if (gender) user.gender = gender;
    if (date_of_birth) user.date_of_birth = date_of_birth;
    if (location && location.city) user.location.city = location.city;
    if (profile_pic) user.profile_pic = profile_pic;
    if (verified !== undefined) user.verified = verified;

    // Save the updated user
    await user.save();

    return res.status(200).json({
      message: 'User information updated successfully.',
      user
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getUser = async (req, res) => {
  try {
    const { user_id } = req;
    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.status(400).send({ error: 'User not found' });
    }

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.rescheduleRequest = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.cancelRequest = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.saveCounsellor = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { counsellor_id } = req.body;
    if (user.saved_counsellors.includes(counsellor_id)) return res.status(400).json({ error: "Counsellor is already saved" });

    user.saved_counsellors.push(counsellor_id);

    await user.save();
    res.status(200).send({ messeage: "Counsellor successfully saved" })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.unsaveCounsellor = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { counsellor_id } = req.body;
    if (!user.saved_counsellors.includes(counsellor_id)) return res.status(404).json({ error: "Counsellor is already unsaved" });

    user.saved_counsellors.filter(counsellorId => counsellorId !== counsellor_id);

    await user.save();
    res.status(200).send({ message: "Counsellor unsaved successfully" })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};