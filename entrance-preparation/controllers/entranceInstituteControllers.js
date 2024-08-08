const { default: axios } = require("axios");
const {
  week,
  getDayFromDate,
  convertTo24HourFormat,
  getSlotsFromTotalSlots,
} = require("../helpers/instituteHelpers");
const EntranceCourse = require("../models/EntranceCourse");
const EntranceInstitute = require("../models/EntranceInstitute");
const UserFeedbacks = require("../models/UserFeedbacks");
const { uploadImage } = require("../services/cloudinary");
const { BACKEND_URL } = process.env;

// ep panel controllers
exports.getProfile = async (req, res) => {
  try {
    const { institute_id } = req;

    // Assuming you have some logic to identify the user's profile, for example, using req.user
    // You can customize this query according to your needs
    const profile = await EntranceInstitute.findOne({ _id: institute_id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // You can customize the response data structure as per your requirements
    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { institute_id } = req; // Assuming institute_id is passed as a parameter
    const { about, ...body } = req.body; // Extract about field from the request body

    for (const timing of body.timings) {
      if (!week.includes(timing.day))
        return res.status(400).send({
          error: "Invalid day field",
        });

      const startTime = timing.start_time.split(" ");

      console.log(convertTo24HourFormat(timing.end_time));

      if (
        convertTo24HourFormat(timing.start_time) >
          convertTo24HourFormat(timing.end_time) &&
        convertTo24HourFormat(timing.end_time) !== 0
      )
        return res.status(400).send({
          error: "Can't go further than 24 hours",
        });
    }

    // Find the profile by institute_id
    const profile = await EntranceInstitute.findById(institute_id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update the about field if it's included in the request body
    if (about !== undefined) {
      profile.about = about;
    }
    // Update other fields in the profile
    Object.keys(body).forEach((key) => {
      profile[key] = body[key];
    });
    profile.status = "PENDING";
    profile.verified = false;

    // Save the updated profile
    await profile.save();

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error editing profile:", error);
    res.status(500).json({ message: "Internal edit profile server error" });
  }
};

// admin panel controllers
// exports.getInstitutesForAdmin = async (req, res) => {
//   try {
//     // Assuming you have some logic to authenticate the admin user and retrieve necessary information
//     // You can customize this query according to your needs
//     console.log("Request Query: ", req.query);
//     const search = req.query;
//     const queryObject = {};
//     if(search) {
//       queryObject.$or = [
//         {name: { $regex: new RegExp(search, "i")}},
//       ];
//     }
//     console.log("Query Object: ", queryObject)
//     const institutes = await EntranceInstitute.find(queryObject);
//     // console.log("Searched: ", institutes)
//     if (!institutes || institutes.length === 0) {
//       return res.status(404).json({ message: "No institutes found" });
//     }

//     const massagedInstitutes = institutes.map((institute) => ({
//       _id: institute._id,
//       name: institute.name,
//       profile_pic: institute.profile_pic,
//       email: institute.email,
//       status: institute.status,
//     }));

//     // You can customize the response data structure as per your requirements
//     res.status(200).json(massagedInstitutes);
//   } catch (error) {
//     console.error("Error fetching institutes:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };



// exports.getInstitutesForAdmin = async (req, res) => {
//   try {
//     console.log("Request Query: ", req.query);

//     const search = req.query.search; // Directly access the search parameter
//     console.log("Search Parameter: ", search);

//     let queryObject = {};

//     if (search) {
//       const regex = new RegExp(search, "i");
//       queryObject = {
//         $or: [
//           { name: { $regex: regex } },
//           { registrant_full_name: { $regex: regex } },
//           { registrant_contact_number: { $regex: regex } },
//           { registrant_email: { $regex: regex } },
//           { "address.building_number": { $regex: regex } },
//           { "address.area": { $regex: regex } },
//           { "address.city": { $regex: regex } },
//           { "address.state": { $regex: regex } },
//           { "address.pin_code": { $regex: regex } },
//         ],
//       };
//       console.log(
//         "Query Object: ",
//         JSON.stringify(queryObject, (key, value) =>
//           key === "$regex" ? value.toString() : value
//         )
//       );
//     } else {
//       console.log("Search parameter is empty");
//     }

//     const institutes = await EntranceInstitute.find(queryObject);

//     if (search && (!institutes || institutes.length === 0)) {
//       // If search input is present and no institutes found, do not return "No matches found"
//       console.log(
//         "No matches found for the search input, returning all institutes instead."
//       );
//       queryObject = {}; // Reset the queryObject to fetch all institutes
//       institutes = await EntranceInstitute.find(queryObject);
//     }

//     if (!institutes || institutes.length === 0) {
//       return res.status(404).json({ message: "No institutes found" });
//     }

//     const massagedInstitutes = institutes.map((institute) => ({
//       _id: institute._id,
//       name: institute.name,
//       profile_pic: institute.profile_pic,
//       email: institute.email,
//       status: institute.status,
//     }));

//     res.status(200).json(massagedInstitutes);
//   } catch (error) {
//     console.error("Error fetching institutes:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.getInstitutesForAdmin = async (req, res) => {
  try {
    console.log("Request Query: ", req.query);

    const search = req.query.search && req.query.search.trim(); // Directly access the search parameter and trim whitespace
    console.log("Search Parameter: ", search);

    let queryObject = {};

    if (search) {
      const regex = new RegExp(search, "i");
      queryObject = {
        $or: [
          { name: { $regex: regex } },
          { registrant_full_name: { $regex: regex } },
          { registrant_contact_number: { $regex: regex } },
          { registrant_email: { $regex: regex } },
          { "address.building_number": { $regex: regex } },
          { "address.area": { $regex: regex } },
          { "address.city": { $regex: regex } },
          { "address.state": { $regex: regex } },
          { "address.pin_code": { $regex: regex } },
        ],
      };
      console.log(
        "Query Object: ",
        JSON.stringify(queryObject, (key, value) =>
          key === "$regex" ? value.toString() : value
        )
      );
    } else {
      console.log("Search parameter is empty or only whitespace");
    }

    let institutes = await EntranceInstitute.find(queryObject);

    if (search && (!institutes || institutes.length === 0)) {
      // If search input is present and no institutes found, do not return "No matches found"
      console.log(
        "No matches found for the search input, returning all institutes instead."
      );
      queryObject = {}; // Reset the queryObject to fetch all institutes
      institutes = await EntranceInstitute.find(queryObject);
    }

    if (!institutes || institutes.length === 0) {
      return res.status(404).json({ message: "No institutes found" });
    }

    const massagedInstitutes = institutes.map((institute) => ({
      _id: institute._id,
      name: institute.name,
      profile_pic: institute.profile_pic,
      email: institute.email,
      status: institute.status,
    }));

    res.status(200).json(massagedInstitutes);
  } catch (error) {
    console.error("Error fetching institutes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.getInstituteForAdmin = async (req, res) => {
  try {
    const { institute_id } = req.params;

    // Assuming you have some logic to authenticate the admin user and retrieve necessary information
    // You can customize this query according to your needs
    const institute = await EntranceInstitute.findOne({ _id: institute_id });

    if (!institute) {
      return res.status(404).json({ message: "Institute not found" });
    }

    // You can customize the response data structure as per your requirements
    res.status(200).json(institute);
  } catch (error) {
    console.error("Error fetching institute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editInstituteForAdmin = async (req, res) => {
  try {
    const { institute_id } = req.params;
    const updateData = req.body;

    // Update the institute using findByIdAndUpdate method
    const updatedInstitute = await EntranceInstitute.findByIdAndUpdate(
      institute_id,
      updateData,
      { new: true }
    );

    if (!updatedInstitute) {
      return res.status(404).json({ message: "Institute not found" });
    }
    updatedInstitute.verified = false;
    updatedInstitute.status = "PENDING";

    res.status(200).json(updatedInstitute);
  } catch (error) {
    console.error("Error editing institute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteInstituteForAdmin = async (req, res) => {
  try {
    const { institute_id } = req.params;

    // Delete the institute by ID
    const deletedInstitute = await EntranceInstitute.findByIdAndDelete(
      institute_id
    );

    if (!deletedInstitute) {
      return res.status(404).json({ message: "Institute not found" });
    }

    res.status(200).json({ message: "Institute deleted successfully" });
  } catch (error) {
    console.error("Error deleting institute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.rejectInstitute = async (req, res) => {
  try {
    const { institute_id } = req.params;
    const institute = await EntranceInstitute.findOne({ _id: institute_id });

    if (!institute) {
      return res.status(404).send({ error: "Institute Not Found" });
    }

    if (!institute.verified) {
      return res
        .status(400)
        .send({ error: "Institute is already not verified" });
    }

    institute.status = "REJECTED";
    institute.verified = false;

    await institute.save();

    res.status(200).send({
      message: "Institute Successfully Rejected",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// for Users
exports.getInstitutesForUser = async (req, res) => {
  try {
    const queryObject = {};
    queryObject.verified = true;

    const institutes = await EntranceInstitute.find(queryObject);

    if (!institutes || institutes.length === 0) {
      return res.status(404).json({ message: "Institute not found" });
    }

    // Fetch courses for each institute
    const institutesWithCourses = await Promise.all(
      institutes.map(async (institute) => {
        const courses = await EntranceCourse.find({ institute: institute._id });

        const massagedCourses = courses.map((course) => ({
          _id: course._id,
          name: course.name,
          description: course.description,
          duration: course.duration,
          fees: course.fees,
        }));
        const currentYear = new Date().getFullYear();
        const establishedYear = new Date(
          institute.year_established_in
        ).getFullYear();
        const yearsOfExperience = currentYear - establishedYear;
        const feedbacks = await UserFeedbacks.find({
          feedback_to: institute._id,
        });
        const totalRating = feedbacks.reduce(
          (sum, feedback) => sum + feedback.rating,
          0
        );
        const rating = feedbacks.length ? totalRating / feedbacks.length : 0;

        return {
          _id: institute._id,
          name: institute.name,
          profile_pic: institute.profile_pic,
          address: institute.address,
          year_established_in: institute.year_established_in,
          years_of_experience: yearsOfExperience,
          institute_timings: institute.timings,
          courses: massagedCourses,
          rating: rating,
          cover_image:institute.cover_image,
        };
      })
    );

    res.status(200).json(institutesWithCourses);
  } catch (error) {
    console.error("Error fetching institute:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getInstituteForUser = async (req, res) => {
  try {
    const { institute_id } = req.params;
    const { user_id } = req; // Assuming user ID is available in the request

    const institute = await EntranceInstitute.findOne({ _id: institute_id });

    if (!institute) {
      return res.status(404).json({ message: "Institute not found" });
    }

    // Fetch courses for the institute
    const courses = await EntranceCourse.find({ institute: institute._id });

    const massagedCourses = courses.map((course) => ({
      _id: course._id,
      type: course.type,
      name: course.name,
      description: course.description,
      duration: course.duration,
      fees: course.fees,
    }));

    // Calculate years of experience
    const currentYear = new Date().getFullYear();
    const establishedYear = new Date(
      institute.year_established_in
    ).getFullYear();
    const yearsOfExperience = currentYear - establishedYear;

    // Fetch feedbacks
    const feedbacks = await UserFeedbacks.find({ feedback_to: institute._id });

    // Calculate the rating
    const totalRating = feedbacks.reduce(
      (sum, feedback) => sum + feedback.rating,
      0
    );
    const rating = feedbacks.length ? totalRating / feedbacks.length : 0;

    // Fetch user details for each feedback
    const feedbackDetails = await Promise.all(
      feedbacks.map(async (feedback) => {
        try {
          const { data } = await axios.get(
            `${BACKEND_URL}/user/ep/${feedback.feedback_from}`
          );
          return {
            rating: feedback.rating,
            comment: feedback.comment,
            userName: data.name,
            profile_pic: data.profile_pic,
            
          };
        } catch (error) {
          console.error(
            `Error fetching user details for feedback ${feedback.feedback_from}:`,
            error
          );
          return {
            rating: feedback.rating,
            comment: feedback.comment,
            user: {
              name: "Unknown",
              profile_pic: "",
            },
          };
        }
      })
    );

    // Check if the user is following the institute

    // Prepare the response object
    const instituteWithDetails = {
      _id: institute._id,
      name: institute.name,
      profile_pic: institute.profile_pic,
      address: institute.address,
      year_established_in: institute.year_established_in,
      years_of_experience: yearsOfExperience,
      institute_timings: institute.timings,
      courses: massagedCourses,
      rating: rating,
      feedbacks: feedbackDetails,
      cover_image: institute.cover_image,
    };

    res.status(200).json(instituteWithDetails);
  } catch (error) {
    console.error("Error fetching institute for user: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getInstituteEnquiryFormForUser = async (req, res) => {
  try {
    const { institute_id } = req.params;
    const { date } = req.query;

    if (!date)
      return res.status(400).send({
        error: "Date not specified",
      });

    const institute = await EntranceInstitute.findOne({ _id: institute_id });

    if (!institute) {
      return res.status(404).json({ message: "Institute not found !" });
    }

    const { timings } = institute;

    const currentDay = getDayFromDate(date);
    const currentDayTiming = timings.find(
      (timing) => timing.day === currentDay
    );

    const startTime = convertTo24HourFormat(currentDayTiming.start_time);
    const endTime = convertTo24HourFormat(currentDayTiming.end_time);

    const totalSlots =
      endTime - startTime < 0
        ? 24 - Math.abs(endTime - startTime)
        : endTime - startTime;

    const slots = getSlotsFromTotalSlots(startTime, totalSlots);

    res.status(200).json(slots);
  } catch (error) {
    console.error("Error fetching institute for user: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.findOneInstitute = async (req, res) => {
  try {
    const { institute_id } = req.query;

    const institute = await EntranceInstitute.findOne({ _id: institute_id });

    if (!institute) {
      return res.status(404).json({ message: "Institute not found !" });
    }

    res.status(200).json(institute);
  } catch (error) {
    console.error("Error fetching institute for user: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.verifyInstitute = async (req, res) => {
  try {
    const { institute_id } = req.params;
    const institute = await EntranceInstitute.findOne({ _id: institute_id });
    if (!institute) {
      return res.status(404).send({ error: "Institute Not Found" });
    }
    try {
      const { institute_id } = req.params;
      const institute = await EntranceInstitute.findOne({ _id: institute_id });
      if (!institute) {
        return res.status(404).send({ error: "Institute Not Found" });
      }

      if (institute.verified) {
        return res.status(400).send({ error: "Institute already verified" });
      }
      if (institute.verified) {
        return res.status(400).send({ error: "Institute already verified" });
      }

      institute.status = "APPROVED";
      institute.verified = true;
      await institute.save();
      res.status(200).send({
        message: "Institute verfified succesfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal Server Error" });
    }
    institute.status = "APPROVED";
    institute.verified = true;
    await institute.save();
    res.status(200).send({
      message: "Institute verfified succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
// for upload cover Image
exports.uploadCoverImage = async (req, res) => {
  try {
    const { file, institute_id } = req;

    if (!file) {
      return res.status(400).send({
        error: "File can't be empty",
      });
    }

    const institute = await EntranceInstitute.findById(institute_id);

    if (!institute) {
      return res.status(404).send({ error: "institute not found" });
    }

    const fileName = `institute-cover-image-${Date.now()}.jpeg`;
    const folderName = "institute-cover-images";

    institute.cover_image = await uploadImage(
      file.buffer,
      fileName,
      folderName
    );
    await institute.save();

    res.status(200).send({
      message: "Cover Image uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
// upload proifle pic
exports.uploadProfilePic = async (req, res) => {
  try {
    const { file, institute_id } = req;

    if (!file) {
      return res.status(400).send({
        error: "File can't be empty",
      });
    }

    const institute = await EntranceInstitute.findById(institute_id);

    if (!institute) {
      return res.status(404).send({ error: "institute not found" });
    }

    const fileName = `institute-profile-pic-${Date.now()}.jpeg`;
    const folderName = "institute-profile-pics";

    institute.profile_pic = await uploadImage(
      file.buffer,
      fileName,
      folderName
    );
    await institute.save();

    res.status(200).send({
      message: "Profile pic uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.followInstitute = async (req, res) => {
  try {
    const { institute_id } = req.params;
    const { id } = req;

    const institute = await EntranceInstitute.findOne({ _id: institute_id });
    if (!institute)
      return res.status(404).send({
        error: "Institute not found",
      });

    const isFollowing = institute.followers.includes(id);
    if (isFollowing)
      return res.status(400).send({
        error: "User is already following the institute",
      });

    institute.followers.push(id);
    await institute.save();
    res.status(200).send({
      status: "true",
      message: "User has followed the institute",
      followersCount: institute.followers.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
exports.unfollowInstitute = async (req, res) => {
  try {
    const { institute_id } = req.params;
    const { id } = req;

    const institute = await EntranceInstitute.findOne({ _id: institute_id });
    if (!institute)
      return res.status(404).send({
        error: "Institute not found",
      });

    const isFollowing = institute.followers.includes(id);
    if (!isFollowing)
      return res.status(400).send({
        error: "User is already not following the institute",
      });

    // Corrected filter method
    institute.followers = institute.followers.filter(
      (user_id) => user_id.toString() !== id
    );

    await institute.save();
    res.status(200).send({
      status: "false",
      message: "User has unfollowed the institute",
      followersCount: institute.followers.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editInstituteProfile = async (req, res) => {
  try {
    const { file } = req;
    const { institute_id } = req.params;
    console.log("file", institute_id);

    if (!file) {
      return res.status(400).send({
        error: "File can't be empty",
      });
    }

    const institute = await EntranceInstitute.findById(institute_id);

    if (!institute) {
      return res.status(404).send({ error: "institute not found" });
    }

    const fileName = `institute-profile-pic-${Date.now()}.jpeg`;
    const folderName = "institute-profile-pics";

    institute.profile_pic = await uploadImage(
      file.buffer,
      fileName,
      folderName
    );
    await institute.save();

    res.status(200).send({
      message: "Profile pic uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
