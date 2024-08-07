const { default: axios } = require("axios");
const Counsellor = require("../models/Counsellor");
const Course = require("../models/Course");
const Feed = require("../models/Feed");
const Feedback = require("../models/Feedback");
const Follower = require("../models/Follower");
const Session = require("../models/Session");
const { uploadImage } = require("../services/cloudinary");
const { convertTo12HourFormat } = require("../utils");
const moment = require("moment-timezone");
require("dotenv").config();
const { BACKEND_URL } = process.env;

// SMCMA-86
exports.register = async (req, res) => {
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
    } = req.body;

    // Search for courses in the Course database based on the values in courses_focused array
    const existingCourses = await Course.find({
      course_name: { $in: courses_focused },
    });
    const existingCourseNames = existingCourses.map(
      (course) => course.course_name
    );
    // Create new entries for missing courses
    if (courses_focused) {
      const missingCourses = courses_focused.filter(
        (course) => !existingCourseNames.includes(course)
      );
      for (const course of missingCourses) {
        const newCourse = new Course({
          course_name: course,
        });
        await newCourse.save();
      }
    }

    const counsellor = await Counsellor.findOne({ email });
    if (counsellor)
      return res.status(400).send({
        error: "Email already exists",
      });

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
    if (languages_spoken)
      messagedCounsellor.languages_spoken = languages_spoken;
    if (experience_in_years)
      messagedCounsellor.experience_in_years = experience_in_years;
    if (how_will_i_help) messagedCounsellor.how_will_i_help = how_will_i_help;
    if (degree_focused) messagedCounsellor.degree_focused = degree_focused;
    if (locations_focused)
      messagedCounsellor.locations_focused = locations_focused;
    if (courses_focused) messagedCounsellor.courses_focused = courses_focused;

    // Create a new counselor object
    const newCounsellor = new Counsellor(messagedCounsellor);

    // Save the new counselor to the database
    const createdCounsellor = await newCounsellor.save();

    // Respond with the created counselor's details
    res.status(201).json(createdCounsellor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
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
    } = req.body;

    // Search for courses in the Course database based on the values in courses_focused array
    const existingCourses = await Course.find({
      course_name: { $in: courses_focused },
    });
    const existingCourseNames = existingCourses.map(
      (course) => course.course_name
    );
    // Create new entries for missing courses
    if (courses_focused) {
      const missingCourses = courses_focused.filter(
        (course) => !existingCourseNames.includes(course)
      );
      for (const course of missingCourses) {
        const newCourse = new Course({
          course_name: course,
        });
        await newCourse.save();
      }
    }

    const counsellor = await Counsellor.findOne({ email });
    if (counsellor)
      return res.status(400).send({
        error: "Email already exists",
      });

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
    if (languages_spoken)
      messagedCounsellor.languages_spoken = languages_spoken;
    if (experience_in_years)
      messagedCounsellor.experience_in_years = experience_in_years;
    if (how_will_i_help) messagedCounsellor.how_will_i_help = how_will_i_help;
    if (degree_focused) messagedCounsellor.degree_focused = degree_focused;
    if (locations_focused)
      messagedCounsellor.locations_focused = locations_focused;
    if (courses_focused) messagedCounsellor.courses_focused = courses_focused;

    // Create a new counselor object
    const newCounsellor = new Counsellor(messagedCounsellor);

    // Save the new counselor to the database
    const createdCounsellor = await newCounsellor.save();

    // Respond with the created counselor's details
    res.status(201).json(createdCounsellor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCounsellor = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const { id } = req;

    const counsellor = await Counsellor.findOne({ _id: counsellor_id });

    if (!counsellor) {
      return res.status(404).send({
        error: "No counsellor found with the provided id",
      });
    }

    // Calculate total sessions attended
    const sessions = await Session.find({ session_counsellor: counsellor._id });
    const sessionsLength = sessions.length;
    const bookedSessions = sessions.filter(
      (session) => session.session_status == "Booked"
    );
    const count = bookedSessions.length;

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
      group_session_price = Math.min(
        ...counsellor.group_sessions.map((session) => session.price)
      );
    }

    // Calculate minimum price of personal session
    let personal_session_price = null;
    if (counsellor.personal_sessions) {
      personal_session_price = Math.min(
        ...counsellor.personal_sessions.map((session) => session.price)
      );
    }

    // client testimonials
    const client_testimonials = await Feedback.find({
      feedback_to: counsellor_id,
    });

    // rating
    const allRatingsCount = client_testimonials.reduce(
      (accumulator, testimonial) => accumulator + testimonial.rating,
      0
    );

    const average_rating =
      allRatingsCount / client_testimonials.length
        ? (allRatingsCount / client_testimonials.length).toFixed(2).toString()
        : "0";
    // reviews
    const reviews = client_testimonials.length;

    // if followed by the user or not
    const follower = await Follower.findOne({
      followed_by: id,
      followed_to: counsellor_id,
    });

    const following = Boolean(follower);

    const messagedCounsellor = {
      ...counsellor._doc,
      sessions: sessionsLength,
      age,
      group_session_price,
      personal_session_price,
      reviews,
      average_rating,
      client_testimonials,
      following,
      booked_sessions: count,
    };

    res.status(200).send(messagedCounsellor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getCounsellorForAdmin = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });

    if (!counsellor) {
      return res.status(404).send({
        error: "No counsellor found with the provided id",
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
      group_session_price = Math.min(
        ...counsellor.group_sessions.map((session) => session.price)
      );
    }

    // Calculate minimum price of personal session
    let personal_session_price = null;
    if (counsellor.personal_sessions) {
      personal_session_price = Math.min(
        ...counsellor.personal_sessions.map((session) => session.price)
      );
    }

    const messagedCounsellor = {
      ...counsellor._doc,
      followers_count,
      total_sessions_attended,
      age,
      group_session_price,
      personal_session_price,
    };

    res.status(200).send(messagedCounsellor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const updateFields = {};

    if (req.body.name) {
      updateFields.name = req.body.name;
    }

    if (req.body.email) {
      updateFields.email = req.body.email;
    }

    if (req.body.phone_no) {
      updateFields.phone_no = req.body.phone_no;
    }

    if (req.body.profile_pic) {
      updateFields.profile_pic = req.body.profile_pic;
    }

    if (req.body.cover_image) {
      updateFields.cover_image = req.body.cover_image;
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

    if (req.body.date_of_birth) {
      updateFields.date_of_birth = req.body.date_of_birth;
    }

    if (req.body.recepient_name) {
      updateFields.recepient_name = req.body.recepient_name;
    }
    if (req.body.bank_name) {
      updateFields.bank_name = req.body.bank_name;
    }

    if (req.body.branch) {
      updateFields.branch = req.body.branch;
    }

    if (req.body.account_type) {
      updateFields.account_type = req.body.account_type;
    }

    if (req.body.account_number) {
      updateFields.account_number = req.body.account_number;
    }

    if (req.body.ifsc_code) {
      updateFields.ifsc_code = req.body.ifsc_code;
    }

    updateFields.status = "PENDING";
    updateFields.verified = false;

    const updatedCounselor = await Counsellor.findByIdAndUpdate(
      counsellor_id,
      updateFields,
      { new: true }
    );

    if (!updatedCounselor) {
      return res.status(404).json({ error: "Counselor not found" });
    }

    // console.log(updatedCounselor);
    res.status(200).json(updatedCounselor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteCounsellor = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const counsellor = await Counsellor.findByIdAndDelete(counsellor_id);

    if (!counsellor) {
      return res.status(404).send({
        error: "Counsellor not found",
      });
    }

    res.send({ message: "Counsellor deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getCounsellors = async (req, res) => {
  try {
    const {
      locations_focused,
      degree_focused,
      courses_focused,
      page = 1,
      limit = 5,
    } = req.query;

    const queryObject = {};

    if (degree_focused) {
      queryObject.degree_focused = degree_focused;
    }

    if (locations_focused) {
      queryObject.locations_focused = locations_focused;
    }

    if (courses_focused) {
      queryObject.courses_focused = courses_focused;
    }

    queryObject.verified = true;

    const skip = (page - 1) * limit;

    const counsellors = await Counsellor.find(
      Object.keys(queryObject).length === 0 ? {} : queryObject
    )
      .sort({ reward_points: -1 })
      .skip(skip)
      .limit(limit);

    if (counsellors.length === 0) {
      return res.status(404).send({ error: "No counselors found" });
    }

    const massagedCounsellors = await Promise.all(
      counsellors.map(async (counsellor) => {
        const sessions = await Session.find({
          session_counsellor: counsellor._id,
        }).sort({ session_date: 1, session_time: 1 });

        const client_testimonials = await Feedback.find({
          feedback_to: counsellor._id,
        });

        // rating
        const allRatingsCount = client_testimonials.reduce(
          (accumulator, testimonial) => accumulator + testimonial.rating,
          0
        );

        const average_rating =
          allRatingsCount / client_testimonials.length
            ? (allRatingsCount / client_testimonials.length)
                .toFixed(2)
                .toString()
            : "0";

        // Filter out past sessions
        const currentTime = moment().tz("Asia/Kolkata");
        const upcomingSessions = sessions.filter((session) => {
          const sessionDate = moment(session.session_date).tz("Asia/Kolkata");
          const isToday = sessionDate.isSame(currentTime, "day");
          const sessionTimeInMinutes = session.session_time;
          const currentTimeInMinutes =
            currentTime.hours() * 60 + currentTime.minutes();
          return (
            sessionDate.isAfter(currentTime) ||
            (isToday && sessionTimeInMinutes > currentTimeInMinutes)
          );
        });

        if (upcomingSessions.length === 0) {
          return {
            _id: counsellor._id,
            name: counsellor.name,
            profile_pic: counsellor.profile_pic,
            designation: counsellor.designation,
            qualifications: counsellor.specializations,
            next_session: "No sessions available",
            average_rating,
            courses_focused: counsellor.courses_focused,
            experience_in_years: counsellor.experience_in_years,
            total_sessions: sessions.length,
            reward_points: counsellor.reward_points,
            reviews: client_testimonials.length,
          };
        }

        const nextSession = upcomingSessions[0];

        // Determine the appropriate message for the next session
        const sessionDate = moment(nextSession.session_date).tz("Asia/Kolkata");

        const daysDifference = Math.abs(
          sessionDate.date() - currentTime.date()
        );

        let nextSessionMessage;
        if (daysDifference === 0) {
          nextSessionMessage = `Next session at ${convertTo12HourFormat(
            nextSession.session_time
          )}`;
        } else if (daysDifference === 1) {
          nextSessionMessage = "Next session tomorrow";
        } else if (daysDifference <= 7) {
          nextSessionMessage = `Next session on ${sessionDate.format("dddd")}`;
        } else {
          nextSessionMessage = `Next session on ${sessionDate.format(
            "MMMM Do YYYY"
          )}`;
        }

        return {
          _id: counsellor._id,
          name: counsellor.name,
          profile_pic: counsellor.profile_pic,
          designation: counsellor.designation,
          qualifications: counsellor.specializations,
          next_session: nextSessionMessage,
          average_rating,
          courses_focused: counsellor.courses_focused,
          experience_in_years: counsellor.experience_in_years,
          total_sessions: sessions.length,
          reward_points: counsellor.reward_points,
          reviews: client_testimonials.length,
        };
      })
    );

    res.status(200).send(massagedCounsellors);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getCounsellorsForAdmin = async (req, res) => {
  try {
    const {
      search,
      locations_focused,
      degree_focused,
      courses_focused,
      status,
      sortBy, // New parameter for sorting
      sortOrder, // New parameter for sorting order
    } = req.query;

    const queryObject = {};

    if (search) {
      queryObject.$or = [
        { name: { $regex: new RegExp(search, "i") } },
        { email: { $regex: new RegExp(search, "i") } },
        { phone_no: { $regex: new RegExp(search, "i") } },
        { gender: { $regex: new RegExp(search, "i") } },
        { location: { $regex: new RegExp(search, "i") } },
        { nationality: { $regex: new RegExp(search, "i") } },
        { designation: { $regex: new RegExp(search, "i") } },
        { qualifications: { $regex: new RegExp(search, "i") } },
        { status: { $regex: new RegExp(search, "i") } },
      ];
    }

    if (degree_focused) {
      queryObject.degree_focused = degree_focused;
    }

    if (status) {
      queryObject.status = status;
    }

    if (locations_focused) {
      queryObject.locations_focused = locations_focused;
    }

    if (courses_focused) {
      queryObject.courses_focused = courses_focused;
    }

    const counsellors = await Counsellor.find(queryObject);

    if (!counsellors.length) {
      return res.status(200).send([]);
    }

    // Sorting logic based on sortBy and sortOrder parameters
    let sortedCounsellors = [...counsellors];
    if (sortBy) {
      if (sortOrder === "asc") {
        sortedCounsellors.sort((a, b) => a[sortBy] - b[sortBy]);
      } else if (sortOrder === "desc") {
        sortedCounsellors.sort((a, b) => b[sortBy] - a[sortBy]);
      }
    }

    // Massage the data as needed and send it back
    const massagedCounsellors = sortedCounsellors.map((counsellor) => ({
      _id: counsellor._id,
      name: counsellor.name,
      email: counsellor.email,
      nationality: counsellor.nationality,
      profile_pic: counsellor.profile_pic,
      designation: counsellor.designation,
      qualifications: counsellor.specializations,
      next_session: counsellor.next_session,
      average_rating: counsellor.average_rating,
      experience_in_years: counsellor.experience_in_years,
      total_sessions: counsellor.sessions.length,
      reward_points: counsellor.reward_points,
      reviews: counsellor.client_testimonials.length,
      verified: counsellor.verified,
      outstanding_balance: counsellor.outstanding_balance,
      status: counsellor.status,
    }));

    res.status(200).send(massagedCounsellors);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getProfilePic = async (req, res) => {
  try {
    const { counsellor_id } = req.params;

    const counsellor = await Counsellor.findById(counsellor_id);
    if (!counsellor)
      return res.status(404).send({ error: "Counsellor not found" });

    if (!counsellor.profile_pic)
      return res.status(404).send({ error: "ProfilePic not found" });

    res.status(200).send(counsellor.profile_pic);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.uploadProfilePic = async (req, res) => {
  try {
    const { file, counsellor_id } = req;

    if (!file) {
      return res.status(400).send({
        error: "File can't be empty",
      });
    }

    const counsellor = await Counsellor.findById(counsellor_id);

    if (!counsellor) {
      return res.status(404).send({ error: "Counsellor not found" });
    }

    const fileName = `counsellor-profile-pic-${Date.now()}.jpeg`;
    const folderName = "counsellor-profile-pics";

    counsellor.profile_pic = await uploadImage(
      file.buffer,
      fileName,
      folderName
    );
    await counsellor.save();

    res.status(200).send({
      message: "Profile pic uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.uploadCoverImage = async (req, res) => {
  try {
    const { file, counsellor_id } = req;

    if (!file) {
      return res.status(400).send({
        error: "File can't be empty",
      });
    }

    const counsellor = await Counsellor.findById(counsellor_id);

    if (!counsellor) {
      return res.status(404).send({ error: "Counsellor not found" });
    }

    const fileName = `counsellor-cover-image-${Date.now()}.jpeg`;
    const folderName = "counsellor-cover-images";

    counsellor.cover_image = await uploadImage(
      file.buffer,
      fileName,
      folderName
    );
    await counsellor.save();

    res.status(200).send({
      message: "Cover Image uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteProfilePic = async (req, res) => {
  try {
    const { cousellor_id } = req.params;

    const counsellor = await Counsellor.findById(cousellor_id);
    if (!counsellor)
      return res.status(404).send({ error: "Counsellor not found" });

    const profile_pic = await Counsellor.findOneAndDelete(profile_pic);

    if (!profile_pic)
      return res.status(404).send({ error: "Profile pic not found" });

    res.status(200).send({ message: "Profile pic deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getReviewsCounsellor = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });

    if (!counsellor)
      return res.status(400).send({
        error: "Counsellor not found",
      });

    const reviews = counsellor.client_testimonials;
    res.status(200).send(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.createFeed = async (req, res) => {
  try {
    const { file, caption } = req.body;
    const { counsellor_id } = req.params;

    const counsellor = await Counsellor.findById(counsellor_id);
    if (!counsellor)
      return res.status(404).send({ error: "Counsellor not found" });

    const newFeed = new Feed({
      feed_owner: counsellor_id,
      feed_link: file,
      feed_caption: caption,
    });

    await newFeed.save();

    res.status(200).send({ message: "Feed created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getTotalRatings = async (req, res) => {
  try {
    const { counsellor_id } = req.params;

    // Find the counsellor by ID
    const counsellor = await Counsellor.findById(counsellor_id);

    if (!counsellor) {
      return res.status(404).json({ error: "Counsellor not found" });
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
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.postReviewCounsellor = async (req, res) => {
  try {
    const { user_id } = req;
    const { rating, comment } = req.body;
    const obj = {};

    if (rating) obj.rating = rating;

    if (comment) obj.comment = comment;

    if (user_id) obj.user_id = user_id;

    const { counsellor_id } = req.params;

    const counsellor = await Counsellor.findOne({ _id: counsellor_id });
    if (!counsellor)
      return res.status(404).send({ error: "Counsellor not found" });

    if (
      counsellor.client_testimonials.some(
        (testimonial) => testimonial.user_id === user_id
      )
    ) {
      return res
        .status(200)
        .send({ message: " you are already posted a review before" });
    }

    counsellor.client_testimonials.push(obj);

    await counsellor.save();

    res.status(200).send({ message: "Review posted succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.verifyCounsellor = async (req, res) => {
  try {
    const { counsellor_id } = req.params;

    const counsellor = await Counsellor.findOne({ _id: counsellor_id });
    if (!counsellor)
      return res.status(404).send({
        error: "Counsellor not found",
      });

    if (counsellor.verified)
      return res.status(400).send({
        error: "Counsellor already verified",
      });

    counsellor.status = "APPROVED";
    counsellor.verified = true;
    await counsellor.save();
    const { data } = await axios.post(
      `${BACKEND_URL}/notification/counsellor/verify`,
      {
        to: counsellor.email,
        username: counsellor.name,
      }
    );

    res.status(200).send({
      message: "Counsellor successfully verified",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.rejectCounsellor = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const { reason } = req.body;

    const counsellor = await Counsellor.findOne({ _id: counsellor_id });
    if (!counsellor)
      return res.status(404).send({
        error: "Counsellor not found",
      });
    if (counsellor.verified === "PENDING") {
      counsellor.status = "REJECTED";
      counsellor.verified = false;
      await counsellor.save();

      const { data } = await axios.post(
        `${BACKEND_URL}/notification/counsellor/reject`,
        {
          to: counsellor.email,
          username: counsellor.name,
          reason,
        }
      );

      return res.status(200).send({
        message: "Counsellor successfully rejected",
      });
    }

    // if (!counsellor.verified)
    //   return res.status(400).send({
    //     error: "Counsellor is not verified or already rejected",
    //   });
    if (counsellor.verified == "PENDING") {
      counsellor.status = "REJECTED";
      counsellor.verified = false;
      await counsellor.save();

      const { data } = await axios.post(
        `${BACKEND_URL}/notification/counsellor/reject`,
        {
          to: counsellor.email,
          username: counsellor.name,
          reason,
        }
      );

      res.status(200).send({
        message: "Counsellor successfully rejected",
      });
    }

    counsellor.status = "REJECTED";
    counsellor.verified = false;
    await counsellor.save();

    const { data } = await axios.post(
      `${BACKEND_URL}/notification/counsellor/reject`,
      {
        to: counsellor.email,
        username: counsellor.name,
        reason,
      }
    );

    res.status(200).send({
      message: "Counsellor successfully rejected",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.findOneCounsellor = async (req, res) => {
  try {
    const { email, counsellor_id } = req.query;
    const query = {};
    if (email) query.email = email;
    if (counsellor_id) query._id = counsellor_id;

    const counsellor = await Counsellor.findOne(query);

    if (!counsellor) {
      return res.status(400).send({ error: "Counsellor not found" });
    }

    res.status(200).send(counsellor);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const { counsellor_id } = req;
    const followersCount = await Follower.countDocuments({
      followed_to: counsellor_id,
    });

    const sessionsCount = await Session.countDocuments({
      session_counsellor: counsellor_id,
    });
    const { data } = await axios.get(
      `${BACKEND_URL}/admin/payment/getincomeofcounsellor/${counsellor_id}`
    );

    res.status(200).json({
      totalFollowers: followersCount,
      totalSessions: sessionsCount,
      dynamicIncome: data.totalIncome,
      //dynamic income
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.incrementActivityPoints = async (req, res) => {
  try {
    const { counsellor_id } = req;
    const counsellor = await Counsellor.findById(counsellor_id); // Corrected to use findById

    if (!counsellor) {
      return res.status(404).send({
        error: "Counsellor not found",
      });
    }

    const lastCheckinDate = new Date(counsellor.last_checkin_date)
      .toISOString()
      .slice(0, 10);
    const currentDate = new Date().toISOString().slice(0, 10); // Corrected to get current date properly

    // console.log(lastCheckinDate, currentDate);

    if (lastCheckinDate !== currentDate) {
      counsellor.activity_points++;
      counsellor.last_checkin_date = new Date(); // Corrected to set current date
      await counsellor.save();
      return res.status(200).send({
        message: "Activity points updated successfully",
      });
    } else {
      return res.status(200).send({
        message: "Activity points not updated",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};

exports.clearOutstandingBalance = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });

    if (!counsellor)
      return res.status(404).send({
        error: "Counsellor not found",
      });

    if (counsellor.outstanding_balance === 0)
      return res.status(404).send({
        error: "Outstanding balance is zero",
      });

    counsellor.outstanding_balance = 0;

    await counsellor.save();

    res.status(200).send({
      message: "Balanced clear succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};

exports.updateOutstandingBalance = async (req, res) => {
  try {
    const { counsellor_id } = req.params;
    const { amount } = req.body;
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });

    if (!counsellor)
      return res.status(404).send({
        error: "Counsellor not found",
      });

    const { data } = await axios.get(
      `${BACKEND_URL}/admin/payments/${counsellor_id}/outstanding-balance`
    );

    counsellor.outstanding_balance = data.outstandingBalance;

    await counsellor.save();

    res.status(200).send({
      message: "Balanced clear succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error: "Internal server error",
    });
  }
};

exports.editProfilePic = async (req, res) => {
  try {
    const { file } = req;
    const { counsellor_id } = req.params;

    if (!file) {
      return res.status(400).send({
        error: "File can't be empty",
      });
    }

    const counsellor = await Counsellor.findById(counsellor_id);

    if (!counsellor) {
      return res.status(404).send({ error: "Counsellor not found" });
    }

    const fileName = `counsellor-profile-pic-${Date.now()}.jpeg`;
    const folderName = "counsellor-profile-pics";

    counsellor.profile_pic = await uploadImage(
      file.buffer,
      fileName,
      folderName
    );
    await counsellor.save();

    res.status(200).send({
      message: "Profile pic uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
