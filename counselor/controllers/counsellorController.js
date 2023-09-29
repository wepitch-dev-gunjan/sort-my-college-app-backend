/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
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
    // Create an object to hold the fields to update
    const updateFields = {};

    // Check if the email field exists in the request body
    if (req.body.email) {
      updateFields.email = req.body.email;
    }

    // Check if the phone_no field exists in the request body
    if (req.body.phone_no) {
      updateFields.phone_no = req.body.phone_no;
    }

    // Check if the personal_info object exists in the request body
    if (req.body.personal_info) {
      updateFields.personal_info = {};

      // Check if name exists in personal_info
      if (req.body.personal_info.name) {
        updateFields.personal_info.name = req.body.personal_info.name;
      }

      // Check if profile_pic exists in personal_info
      if (req.body.personal_info.profile_pic) {
        updateFields.personal_info.profile_pic = req.body.personal_info.profile_pic;
      }

      // Check if gender exists in personal_info
      if (req.body.personal_info.gender) {
        updateFields.personal_info.gender = req.body.personal_info.gender;
      }

      // Check if location exists in personal_info
      if (req.body.personal_info.location) {
        updateFields.personal_info.location = {};

        // Check if city exists in location
        if (req.body.personal_info.location.city) {
          updateFields.personal_info.location.city = req.body.personal_info.location.city;
        }

        // Check if state exists in location
        if (req.body.personal_info.location.state) {
          updateFields.personal_info.location.state = req.body.personal_info.location.state;
        }

        // Check if country exists in location
        if (req.body.personal_info.location.country) {
          updateFields.personal_info.location.country = req.body.personal_info.location.country;
        }
      }
    }

    // Check and update qualifications
    if (req.body.qualifications) {
      updateFields.qualifications = req.body.qualifications;
    }

    // Check and update specializations
    if (req.body.specializations) {
      updateFields.specializations = req.body.specializations;
    }

    // Check and update languages_spoken
    if (req.body.languages_spoken) {
      updateFields.languages_spoken = req.body.languages_spoken;
    }

    // Check and update client_focus
    if (req.body.client_focus) {
      updateFields.client_focus = req.body.client_focus;
    }

    // Check and update next_appointment
    if (req.body.next_appointment) {
      updateFields.next_appointment = req.body.next_appointment;
    }

    // Check and update work_experience
    if (req.body.work_experience) {
      updateFields.work_experience = req.body.work_experience;
    }

    // Check and update total_appointed_sessions
    if (req.body.total_appointed_sessions) {
      updateFields.total_appointed_sessions = req.body.total_appointed_sessions;
    }

    // Check and update reward_points
    if (req.body.reward_points) {
      updateFields.reward_points = req.body.reward_points;
    }

    // Check and update emergency_contact
    if (req.body.emergency_contact) {
      updateFields.emergency_contact = req.body.emergency_contact;
    }

    // Find the user by their ID and update their profile information.
    // Be sure to add any necessary validation or error handling specific to your application.
    const updatedUser = await Counsellor.findByIdAndUpdate(req.id, updateFields, {
      new: true, // Return the updated user object.
      runValidators: true, // Run validation defined in your model.
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


