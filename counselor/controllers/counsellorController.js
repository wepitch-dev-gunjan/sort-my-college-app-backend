const { uploadToS3 } = require('../helpers/feedHelpers');
const { upload } = require('../middlewares/formMiddlewares');
const Counsellor = require('../models/Counsellor');

// GET
exports.getCounsellor = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });

    if (!counsellor) {
      return res.status(404).send({
        eerror: "Unauthorised user"
      })
    }

    res.status(200).send(counsellor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

exports.getCounsellors = async (req, res) => {
  try {
    const { locations_focused, degree_focused, courses_focused } = req.query;

    const queryObject = {};

    if (degree_focused) {
      queryObject.degree_focused = { $in: degree_focused };
    }

    if (locations_focused) {
      queryObject.locations_focused = { $in: locations_focused };
    }

    if (courses_focused) {
      queryObject.courses_focused = { $in: courses_focused };
    }

    const counsellors = await Counsellor.find(queryObject);

    if (counsellors.length === 0) {
      return res.status(404).send({ error: "No counselors found" });
    }

    res.status(200).send(counsellors);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.getProfilePic = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.uploadProfilePic = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.deleteProfilePic = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.getFollowers = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const counsellor = await Counsellor.find({ _id: counsellor_id });

    if (!counsellor) return res.status(400).send({
      error: "Counsellor not found"
    });

    const followers = counsellor.followers;
    res.status(200).send(followers);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" })
  }
}

exports.getReviewsCounsellor = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const counsellor = await Counsellor.find({ _id: counsellor_id });

    if (!counsellor) return res.status(400).send({
      error: "Counsellor not found"
    });

    const reviews = counsellor.reviews;
    res.status(200).send(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" })
  }
}

exports.getSessions = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.getSession = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.createFeed = async (req, res) => {
  try {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { feed_link } = req.body;

      // Additional validation for feed_link if needed
      // ...

      try {
        const s3CdnLink = await uploadToS3(req.file);
        const newFeed = await saveFeedToDatabase(s3CdnLink);

        res.status(201).json({ message: 'Feed created successfully', feed: newFeed });
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

exports.getFeeds = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.getFeed = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.getFeedComments = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.getTotalRatings = async (req, res) => {
  try {
    const { counsellor_id } = req.params;

    // Find the counsellor by ID
    const counsellor = await Counsellor.findById(counsellor_id);

    if (!counsellor) {
      return res.status(404).json({ error: 'Counsellor not found' });
    }

    // Calculate total ratings based on client testimonials
    let sumOfRatings = 0;
    let ratingsCount = 0;
    let userGivenRatingsCount = 0;

    // Iterate through client testimonials and sum up the ratings
    for (const testimonial of counsellor.client_testimonials) {
      if (testimonial.rating && testimonial.rating !== 0) {
        sumOfRatings += testimonial.rating;
        ratingsCount++;
      }
    }

    const avgRatings = sumOfRatings / ratingsCount;

    // Return the total ratings in the response
    res.status(200).json({ avgRatings, ratingsCount });
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
      work_experience,
      total_appointed_sessions,
      reward_points,
      client_testimonials,
      total_ratings,
      average_rating,
      degree_focused,
      locations_focused,
      courses_focused,
    } = req.body;

    // Create a new counselor object
    const newCounsellor = new Counsellor({
      email,
      personal_info,
      qualifications,
      specializations,
      languages_spoken,
      work_experience,
      total_appointed_sessions,
      reward_points,
      client_testimonials,
      total_ratings,
      average_rating,
      degree_focused,
      locations_focused,
      courses_focused,
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

exports.followCounsellor = async (req, res) => {
  try {
    const { counsellor_id } = req.params;

    // Find the counsellor by ID
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });

    if (!counsellor) {
      return res.status(404).json({ error: 'Counsellor not found' });
    }

    const { user_id } = req.body;

    if (counsellor.followers.includes(user_id)) {
      return res.status(400).json({ error: 'User is already following this counsellor' });
    }

    counsellor.followers.push(user_id);

    await counsellor.save();

    res.status(200).json({ message: 'User is now following the counsellor' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.unfollowCounsellor = async (req, res) => {
  try {
    const { counsellor_id } = req.params;

    // Find the counsellor by ID
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });


    if (!counsellor) {
      return res.status(404).json({ error: 'Counsellor not found' });
    }

    // Assuming you have user information in req.user (replace with your actual user data)
    const { user_id } = req.body;

    // Check if the user is already following the counsellor
    const isFollowing = counsellor.followers.includes(user_id);

    if (!isFollowing) {
      return res.status(400).json({ error: 'User is not following this counsellor' });
    }

    // Remove the user's ID from the followers array
    counsellor.followers = counsellor.followers.filter((followerId) => followerId !== user_id);

    await counsellor.save();

    res.status(200).json({ message: 'User has unfollowed the counsellor' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.cancelSession = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.bookSession = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.cancelSession = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.rescheduleSession = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.unlikeFeed = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.editFeedComment = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.hideFeedComment = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.unhideFeedComment = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.postReviewCounsellor = async (req, res) => {
  try {
    const { rating, comment, user_id } = req.body;
    const obj = {};

    if (rating)
      obj.rating = rating;

    if (comment)
      obj.comment = comment;

    if (user_id)
      obj.user_id = user_id;

    const { counsellor_id } = req.params;

    const counsellor = await Counsellor.findById(counsellor_id);
    if (!counsellor) return res.status(404).send({ error: "Counsellor not found" });

    console.log(counsellor.client_testimonials);
    if (counsellor.client_testimonials.some(testimonial => testimonial.user_id === user_id)) {
      return res.status(200).send({ message: " you are already posted a review before" });
    }

    counsellor.client_testimonials.push(obj);

    await counsellor.save();

    res.status(200).send({ message: "Review posted succesfully" })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.likeFeed = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.saveFeed = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.unsaveFeed = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.postFeedComment = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.deleteFeedComment = (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}




