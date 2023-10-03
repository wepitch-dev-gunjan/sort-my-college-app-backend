const Counsellor = require('../models/Counsellor');

// GET
exports.getProfile = async (req, res) => {
  try {
    const { id } = req;
    const profile = await Counsellor.findOne({ _id: id });

    if (!profile) {
      return res.status(404).send({
        eerror: "Unauthorised user"
      })
    }

    res.status(200).send(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getCounsellors = async (req, res) => {
  try {
    // Extract query parameters from the request
    const { degree, country, city, course, saved } = req.query;

    // Construct a filter object based on the query parameters
    const filter = {};
    if (degree) {
      filter.degree = degree;
    }
    if (country) {
      filter.country = country;
    }
    if (city) {
      filter.residing_city = city;
    }
    if (course) {
      filter.course = course;
    }
    if (saved) {
      filter.saved = saved;
    }

    // Query the database using the filter
    const counselors = await Counsellor.find(filter);

    // Respond with the filtered counselors
    res.status(200).json(counselors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getSingleCounsellor = async (req, res) => {
  try {
    const { counselor_id } = req.params;

    // Find the counselor by ID in the database
    const counselor = await Counsellor.findById({ _id: counselor_id });

    if (!counselor) {
      return res.status(404).json({ error: 'Counselor not found' });
    }

    // Respond with the counselor's details
    res.status(200).json({ counselor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST
exports.createCounsellor = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      email,
      personal_info,
      qualifications,
      specializations,
      languages_spoken,
      next_appointment,
      work_experience,
      total_appointed_sessions,
      reward_points,
      client_testimonials,
      total_ratings,
      average_rating,
    } = req.body;

    // Create a new counselor object
    const newCounsellor = new Counsellor({
      email,
      personal_info,
      qualifications,
      specializations,
      languages_spoken,
      next_appointment,
      work_experience,
      total_appointed_sessions,
      reward_points,
      client_testimonials,
      total_ratings,
      average_rating,
    });

    // Save the new counselor to the database
    const createdCounsellor = await newCounsellor.save();
    // Respond with the created counselor's details
    res.status(201).json(createdCounsellor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT
exports.editProfile = async (req, res) => {
  try {
    const updateFields = {};

    if (req.body.email) {
      updateFields.email = req.body.email;
    }

    if (req.body.phone_no) {
      updateFields.phone_no = req.body.phone_no;
    }

    if (req.body.personal_info) {
      updateFields.personal_info = {};

      if (req.body.personal_info.name) {
        updateFields.personal_info.name = req.body.personal_info.name;
      }

      if (req.body.personal_info.profile_pic) {
        updateFields.personal_info.profile_pic = req.body.personal_info.profile_pic;
      }

      if (req.body.personal_info.gender) {
        updateFields.personal_info.gender = req.body.personal_info.gender;
      }

      if (req.body.personal_info.location) {
        updateFields.personal_info.location = {};

        if (req.body.personal_info.location.city) {
          updateFields.personal_info.location.city = req.body.personal_info.location.city;
        }

        if (req.body.personal_info.location.state) {
          updateFields.personal_info.location.state = req.body.personal_info.location.state;
        }

        if (req.body.personal_info.location.country) {
          updateFields.personal_info.location.country = req.body.personal_info.location.country;
        }
      }
    }

    if (req.body.qualifications) {
      updateFields.qualifications = req.body.qualifications;
    }

    if (req.body.specializations) {
      updateFields.specializations = req.body.specializations;
    }

    if (req.body.languages_spoken) {
      updateFields.languages_spoken = req.body.languages_spoken;
    }

    if (req.body.client_focus) {
      updateFields.client_focus = req.body.client_focus;
    }

    if (req.body.work_experience) {
      updateFields.work_experience = req.body.work_experience;
    }

    if (req.body.total_appointed_sessions) {
      updateFields.total_appointed_sessions = req.body.total_appointed_sessions;
    }

    if (req.body.reward_points) {
      updateFields.reward_points = req.body.reward_points;
    }

    if (req.body.emergency_contact) {
      updateFields.emergency_contact = req.body.emergency_contact;
    }

    const updatedUser = await Counsellor.findByIdAndUpdate(req.id, updateFields);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


