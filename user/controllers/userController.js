const User = require("../models/User");

exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    const newUser = new User(userData);
    const savedUser = await newUser.save();

    res.status(201).json(savedUser); // Respond with the saved user object
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.status(400).send({ error: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findById(user_id);

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const updatedProfileData = {
      personal_info: {
        name: req.body.personal_info.name,
        contact_number: req.body.personal_info.contact_number,
        gender: req.body.personal_info.gender,
        date_of_birth: req.body.personal_info.date_of_birth,
        location: {
          city: req.body.personal_info.location.city,
        },
      },
    };
    user.set(updatedProfileData);

    await user.save();

    res.status(200).send({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
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
    const { user_id } = req.params;
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
    const { user_id } = req.params;
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

exports.saveVocationalCourse = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({ _id: user_id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log(user);

    const { course_id } = req.body;
    if (user.saved_courses.includes(course_id))
      return res.status(400).json({ error: "Course is already saved" });

    user.saved_courses.push(course_id);

    await user.save();
    res.status(200).send({ message: "Course successfully saved" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
