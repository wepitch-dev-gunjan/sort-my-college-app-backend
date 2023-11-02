const { uploadToS3 } = require('../helpers/feedHelpers');
const { upload } = require('../middlewares/formMiddlewares');
const Comment = require('../models/Comment');
const Counsellor = require('../models/Counsellor');
const Course = require('../models/Course');
const Feed = require('../models/Feed');

// SMCMA-86
exports.createCounsellor = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      name,
      email,
      phone_no,
      profile_pic,
      cover_image,
      gender,
      location,
      destination,
      qualifications,
      languages_spoken,
      experience_in_years,
      how_will_i_help,
      degree_focused,
      locations_focused,
      courses_focused,
    } = req.body;

    // Search for courses in the Course database based on the values in courses_focused array
    const existingCourses = await Course.find({ course_name: { $in: courses_focused } });
    const existingCourseNames = existingCourses.map(course => course.course_name);
    // Create new entries for missing courses
    if (courses_focused) {
      const missingCourses = courses_focused.filter(course => !existingCourseNames.includes(course));
      for (const course of missingCourses) {
        const newCourse = new Course({
          course_name: course,
        });
        await newCourse.save();
      }
    }

    const messagedCounsellor = {};

    if (name) messagedCounsellor.name = name;
    if (email) messagedCounsellor.email = email;
    if (phone_no) messagedCounsellor.phone_no = phone_no;
    if (profile_pic) messagedCounsellor.profile_pic = profile_pic;
    if (cover_image) messagedCounsellor.cover_image = cover_image;
    if (gender) messagedCounsellor.gender = gender;
    if (location) messagedCounsellor.location = location;
    if (destination) messagedCounsellor.destination = destination;
    if (qualifications) messagedCounsellor.qualifications = qualifications;
    if (languages_spoken) messagedCounsellor.languages_spoken = languages_spoken;
    if (experience_in_years) messagedCounsellor.experience_in_years = experience_in_years;
    if (how_will_i_help) messagedCounsellor.how_will_i_help = how_will_i_help;
    if (degree_focused) messagedCounsellor.degree_focused = degree_focused;
    if (locations_focused) messagedCounsellor.locations_focused = locations_focused;
    if (courses_focused) messagedCounsellor.courses_focused = courses_focused;

    // Create a new counselor object
    const newCounsellor = new Counsellor(messagedCounsellor);

    // Save the new counselor to the database
    const createdCounsellor = await newCounsellor.save();

    // Respond with the created counselor's details
    res.status(201).json(createdCounsellor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getCounsellor = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });

    if (!counsellor) {
      return res.status(404).send({
        error: "Unauthorised user"
      });
    }

    // Calculate followers count
    const followers_count = counsellor.followers.length;

    // Calculate total sessions attended
    let total_sessions_attended = 0;
    if (counsellor.sessions) {
      total_sessions_attended = counsellor.sessions.length;
    }

    // Calculate age from date of birth
    let age = null;
    if (counsellor.date_of_birth) {
      const birthDate = new Date(counsellor.date_of_birth);
      const ageDiff = Date.now() - birthDate.getTime();
      age = new Date(ageDiff).getUTCFullYear() - 1970;
    }

    // Calculate minimum price of group session
    let group_session_price = null;
    if (counsellor.group_sessions) {
      group_session_price = Math.min(...counsellor.group_sessions.map(session => session.price));
    }

    // Calculate minimum price of personal session
    let personal_session_price = null;
    if (counsellor.personal_sessions) {
      personal_session_price = Math.min(...counsellor.personal_sessions.map(session => session.price));
    }

    const messagedCounsellor = {
      name: counsellor.name,
      email: counsellor.email,
      average_rating: counsellor.average_rating,
      followers_count,
      experience_in_years: counsellor.experience_in_years,
      total_sessions_attended,
      reviews: counsellor.reviews,
      how_will_i_help: counsellor.how_will_i_help,
      qualifications: counsellor.qualifications,
      languages_spoken: counsellor.languages_spoken,
      location: counsellor.location,
      gender: counsellor.gender,
      age,
      client_testimonials: counsellor.client_testimonials,
      group_session_price,
      personal_session_price,
    };

    res.status(200).send(messagedCounsellor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const updateFields = {};

    if (req.body.email) {
      updateFields.email = req.body.email;
    }

    if (req.body.phone_no) {
      updateFields.phone_no = req.body.phone_no;
    }

    if (req.body.profile_pic) {
      updateFields.profile_pic = req.body.profile_pic;
    }

    if (req.body.gender) {
      updateFields.gender = req.body.gender;
    }

    if (req.body.location) {
      updateFields.location = {};

      if (req.body.location.pin_code) {
        updateFields.location.pin_code = req.body.location.pin_code;
      }

      if (req.body.location.city) {
        updateFields.location.city = req.body.location.city;
      }

      if (req.body.location.state) {
        updateFields.location.state = req.body.location.state;
      }

      if (req.body.location.country) {
        updateFields.location.country = req.body.location.country;
      }
    }

    if (req.body.designation) {
      updateFields.designation = req.body.designation;
    }

    if (req.body.qualifications) {
      updateFields.qualifications = req.body.qualifications;
    }

    if (req.body.next_session_time) {
      updateFields.next_session_time = req.body.next_session_time;
    }

    if (req.body.languages_spoken) {
      updateFields.languages_spoken = req.body.languages_spoken;
    }

    if (req.body.experience_in_years) {
      updateFields.experience_in_years = req.body.experience_in_years;
    }

    if (req.body.total_appointed_sessions) {
      updateFields.total_appointed_sessions = req.body.total_appointed_sessions;
    }

    if (req.body.reward_points) {
      updateFields.reward_points = req.body.reward_points;
    }

    if (req.body.client_testimonials) {
      updateFields.client_testimonials = req.body.client_testimonials;
    }

    if (req.body.average_rating) {
      updateFields.average_rating = req.body.average_rating;
    }

    if (req.body.sessions) {
      updateFields.sessions = req.body.sessions;
    }

    if (req.body.how_will_i_help) {
      updateFields.how_will_i_help = req.body.how_will_i_help;
    }

    if (req.body.emergency_contact) {
      updateFields.emergency_contact = req.body.emergency_contact;
    }

    if (req.body.followers) {
      updateFields.followers = req.body.followers;
    }

    if (req.body.degree_focused) {
      updateFields.degree_focused = req.body.degree_focused;
    }

    if (req.body.locations_focused) {
      updateFields.locations_focused = req.body.locations_focused;
    }

    if (req.body.courses_focused) {
      updateFields.courses_focused = req.body.courses_focused;
    }

    const updatedUser = await Counsellor.findByIdAndUpdate(req.id, updateFields, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteCounsellor = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const counsellor = await Counsellor.findByIdAndDelete(counsellor_id);

    if (!counsellor) {
      return res.status(404).send({
        error: 'Counsellor not found'
      });
    }

    res.send({ message: 'Counsellor deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
// end SMCMA-86

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


    const massagedCounsellors = counsellors.map(counsellor => {
      return {
        name: counsellor.personal_info.name,
        designation: counsellor.designation,
        specializations: counsellor.specializations,
        city: counsellor.personal_info.city,
        next_session: counsellor.next_session,
        average_rating: counsellor.average_rating,
        experience_in_years: counsellor.experience_in_years,
        total_sessions: counsellor.sessions.length,
        reward_points: counsellor.reward_points,
        reviews: counsellor.client_testimonials.length,
      }
    })

    res.status(200).send(massagedCounsellors);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.getProfilePic = async (req, res) => {
  try {
    const { cousellor_id } = req.params;

    const counsellor = await Counsellor.findById(cousellor_id);
    if (!counsellor) return res.status(404).send({ error: "Counsellor not found" });

    if (!counsellor.profile_pic) return res.status(404).send({ error: "ProfilePic not found" });

    res.status(200).send(counsellor.profile_pic);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
// const { cousellor_id } = req.params;
// const { profile_pic } = req.body;

// const counsellor = await Counsellor.findById(cousellor_id);
// if (!counsellor) return res.status(404).send({ error: "Counsellor not found" });

// const newProfilePic = new Profile_pic({
//   profile_pic,
// });

// await newProfilePic.save();

// res.status(200).send({ message: 'Profile pic uploaded successfully' });
exports.uploadProfilePic = async (req, res) => {
  try {
    // validate counsellor
    const { counellor_id } = req.params;

    const counsellor = await Counsellor.findById(counsellor_id);
    if (!counsellor) return res.status(404).send({ error: "Counsellor not found" });

    // fetch profile_pic from the request form data

    // validate profile_pic

    // update profile_pic of the counsellor with provided counsellor_id

    // send response
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.deleteProfilePic = async (req, res) => {
  try {
    const { cousellor_id } = req.params;

    const counsellor = await Counsellor.findById(cousellor_id);
    if (!counsellor) return res.status(404).send({ error: "Counsellor not found" });

    const profile_pic = await Counsellor.findOneAndDelete(profile_pic);

    if (!profile_pic) return res.status(404).send({ error: "Profile pic not found" });

    res.status(200).send({ message: "Profile pic deleted successfully" });
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
    const { file, caption } = req.body;
    const { counsellor_id } = req.params;

    const counsellor = await Counsellor.findById(counsellor_id);
    if (!counsellor) return res.status(404).send({ error: 'Counsellor not found' });

    const newFeed = new Feed({
      feed_owner: counsellor_id,
      feed_link: file,
      feed_caption: caption,
    });

    await newFeed.save();

    res.status(200).send({ message: 'Feed created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getFeeds = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const { feed_visibility } = req.query;

    if (!feed_visibility) feed_visibility = true;
    const counsellor = await Counsellor.findById(counsellor_id);
    if (!counsellor) return res.status(404).send({ error: 'Counsellor not found' });

    const feeds = await Feed.find({ feed_owner: counsellor_id, feed_visibility });
    res.status(200).send(feeds);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.getFeed = async (req, res) => {
  try {
    const { feed_id } = req.params;

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    res.status(200).send(feed);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.getFeedComments = async (req, res) => {
  try {
    const { feed_id } = req.params;

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    const comments = await Comment.find({ feed_id });


    res.status(200).send(comments);
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

exports.getLikes = async (req, res) => {
  try {
    const { feed_id } = req.params;

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: 'Feed not found' });

    const likes = feed.feed_likes.length;
    res.status(200).send({ likes });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
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

exports.unlikeFeed = async (req, res) => {
  try {
    const { feed_id } = req.params;
    const { user_id } = req.body; // change it after auth

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    if (!feed.feed_likes.includes(user_id)) return res.status(404).send({ error: "Feed already unliked" });

    feed.feed_likes = feed.feed_likes.filter(e => e != user_id);

    await feed.save();
    res.status(200).send({ message: "Feed has been unliked" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.editFeedComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { comment_text } = req.body;

    const comment = await Comment.findById(comment_id);
    if (!comment) return res.status(404).send({ error: "Comment not found" });

    if (comment_text) comment.comment_text = comment_text;

    comment.save();

    res.status(200).send({ message: "Comment has been updated" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.hideFeedComment = async (req, res) => {
  try {
    const { comment_id } = req.params;

    const comment = await Comment.findById(comment_id);
    if (!comment) return res.status(404).send({ error: "Comment not found" });

    if (comment.comment_visibility === true) comment.comment_visibility = false;

    await comment.save();
    res.status(200).send({ message: "Comment has been hidden successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.unhideFeedComment = async (req, res) => {
  try {
    const { comment_id } = req.params;

    const comment = await Comment.findById(comment_id);
    if (!comment) return res.status(404).send({ error: "Comment not found" });

    if (comment.comment_visibility === false) comment.comment_visibility = true;

    await comment.save();
    res.status(200).send({ message: "Comment has been unhide successfully" });
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

exports.likeFeed = async (req, res) => {
  try {
    const { feed_id } = req.params;
    const { user_id } = req.body; // change it after auth

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    if (feed.feed_likes.includes(user_id)) return res.status(404).send({ error: "Feed already liked" });
    feed.feed_likes.push(user_id);

    await feed.save();
    res.status(200).send({ message: "Feed has been liked" });
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

exports.postFeedComment = async (req, res) => {
  try {
    const { feed_id } = req.params;
    const { comment_text } = req.body;

    if (!comment_text) return res.status(404).send({ error: "Comment text is neccessary" });

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    const comment = new Comment({
      comment_text,
      feed_id
    });

    await comment.save();
    res.status(200).send({ message: "Comment sent", comment });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.deleteFeedComment = async (req, res) => {
  try {
    const { comment_id } = req.params;

    const comment = await Comment.findByIdAndDelete(comment_id);

    if (!comment) return res.status(404).send({ error: "Comment not found" });

    res.status(200).send({ message: "Comment deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
}

exports.editFeed = async (req, res) => {
  try {
    const { file, caption } = req.body;
    const { feed_id } = req.params;

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: 'Feed not found' });

    if (file) feed.feed_link = file;
    if (caption) feed.feed_caption = caption;

    await feed.save();

    res.status(200).send({ message: 'Feed edited successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteFeed = async (req, res) => {
  try {
    const { feed_id } = req.params;

    const feed = await Feed.findOneAndDelete({ _id: feed_id });

    if (!feed) return res.status(404).send({ error: "Feed not found" });

    res.status(200).send({ message: "Feed deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.hideFeed = async (req, res) => {
  try {
    const { feed_id } = req.params;

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    if (feed.feed_visibility === false) return res.status(405).send({ error: "Feed is already hidden" });

    if (feed.feed_visibility === true) feed.feed_visibility = false;

    await feed.save();

    res.status(200).send({ message: "Feed has been hidden successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.unhideFeed = async (req, res) => {
  try {
    const { feed_id } = req.params;

    const feed = await Feed.findById(feed_id);
    if (!feed) return res.status(404).send({ error: "Feed not found" });

    if (feed.feed_visibility === true) return res.status(405).send({ error: "Feed is already visible" });

    if (feed.feed_visibility === false) feed.feed_visibility = true;

    await feed.save();

    res.status(200).send({ message: "Feed has been unhide successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

// Course controllers
exports.getCourses = async (req, res) => {
  try {
    const { counsellor_id } = req.params;

    // Assuming you have a 'Counsellor' model defined somewhere else
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });
    if (!counsellor) {
      return res.status(404).send({
        error: "Counsellor not found"
      });
    }

    const courses = await Course.find({
      course_counsellors: counsellor_id
    });

    if (courses.length === 0) {
      return res.status(404).send({
        error: "No courses found for this counsellor"
      });
    }

    const massagedCourses = courses.map(course => {
      return {
        course_name: course.course_name
      }
    })

    res.status(200).send(massagedCourses);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();

    if (!courses) return res.status(404).send({
      error: "Courses not found"
    });

    const massagedCourses = courses.map(course => {
      return {
        course_name: course.course_name
      }
    })

    res.status(200).send(massagedCourses);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { course_name } = req.body;
    if (!course_name) return res.status(400).send({
      error: "Course name is required"
    })

    let course = await Course.findOne({ course_name });
    if (course) return res.status(400).send({
      error: "Course with the same name already exists"
    })

    course = new Course({
      course_name
    })

    const savedCourse = await course.save();

    res.status(200).send({
      message: "Course saved successfully",
      course: savedCourse
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.addCounsellorInCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const { counsellor_id } = req.body;
    if (!counsellor_id) return res.status(400).send({
      error: "Counsellor should be provided"
    });

    const course = await Course.findOne({ _id: course_id });
    if (!course) {
      return res.status(404).send({
        error: "Course not found"
      });
    }

    const counsellor = await Counsellor.findOne({ _id: counsellor_id });
    if (!counsellor) return res.status(404).send({
      error: "Counsellor not found"
    });

    counsellor.courses_focused.push(course.course_name);

    if (course.course_counsellors.includes(counsellor_id)) {
      return res.status(400).send({
        error: "Counsellor already exists in the course"
      });
    }

    course.course_counsellors.push(counsellor_id);
    await course.save();
    await counsellor.save();

    res.status(200).send({
      message: "Counsellor added to the course successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};





