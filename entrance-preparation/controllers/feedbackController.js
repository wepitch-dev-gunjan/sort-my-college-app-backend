const { default: axios } = require("axios");
const EntranceInstitute = require("../models/EntranceInstitute");
const UserFeedbacks = require("../models/UserFeedbacks");
const { BACKEND_URL } = process.env;


exports.createFeedback = async (req, res) => {
  try {
    const { id } = req;
    console.log("User Id:", id);
    let { institute_id, rating, comment } = req.body;

    if (!rating) rating = 0;
    rating = parseFloat(rating);
    if (!comment) comment = "";
    console.log("api");

    const url = `${BACKEND_URL}/user/ep/${id}`;
    console.log(`Fetching user data from URL: ${url}`);
    const { data } = await axios.get(url);
    console.log(data);

    const user = data;
    const ep = await EntranceInstitute.findOne({ _id: institute_id });
    console.log(ep);
    if (!ep) {
      return res.status(404).send({
        error: "Institute not found",
      });
    }
    if (!user) {
      return res.status(404).send({
        error: "User not found",
      });
    }
    let feedback = await UserFeedbacks.findOne({
      feedback_from: user._id,
      feedback_to: institute_id,
    });

    if (feedback)
      return res.status(400).send({
        error: "Feedback is already given by the user",
      });

    feedback = new UserFeedbacks({
      feedback_from: user._id,
      feedback_to: institute_id,
      user_name: user.name,
      rating,
      comment,
    });

    await feedback.save();

    res.status(200).send({
      message: "Feedback has been successfully added",
      data: feedback,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).send({
      error: "An error occurred while creating feedback",
    });
  }
};

// exports.getFeedbacks = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const { ep_id } = req.params;
//     const { user_id } = req.body;
//     const pageNumber = parseInt(page, 10);
//     const limitNumber = parseInt(limit, 10);

//     if (
//       isNaN(pageNumber) ||
//       isNaN(limitNumber) ||
//       pageNumber < 1 ||
//       limitNumber < 1
//     ) {
//       return res
//         .status(400)
//         .json({ error: "Invalid page or limit parameters." });
//     }

//     const ep = await EntranceInstitute.findOne({ _id: ep_id });

//     if (!ep) {
//       return res.status(404).json({ error: "Institute not found" });
//     }

//     const url = `${BACKEND_URL}/user/ep/${user_id}`;
//     console.log(`Fetching user data from URL: ${url}`);
//     const { data } = await axios.get(url);
//     console.log(data);
//     const user = data;

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const skip = (pageNumber - 1) * limitNumber;
//     const query = {};
//     if (user_id) query.feedback_from = user_id;
//     if (ep_id) query.feedback_to = ep_id;

//     const feedbacks = await UserFeedbacks.find(query)
//       .sort({ updatedAt: -1 })
//       .skip(skip)
//       .limit(limitNumber)
//       .exec();

//     const totalFeedbacks = await UserFeedbacks.countDocuments(query);
//     const totalPages = Math.ceil(totalFeedbacks / limitNumber);

//     res
//       .status(200)
//       .json({ feedbacks, totalPages, currentPage: pageNumber, user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

exports.getFeedbacks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { institute_id } = req.params;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ error: "Invalid page or limit parameters." });
    }

    const institute = await EntranceInstitute.findOne({ _id: institute_id });
    if (!institute) {
      return res.status(404).json({ error: "Institute not found" });
    }

    const skip = (pageNumber - 1) * limitNumber;
    const query = { feedback_to: institute_id };

    const feedbacks = await UserFeedbacks.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .exec();

    const totalFeedbacks = await UserFeedbacks.countDocuments(query);
    const totalPages = Math.ceil(totalFeedbacks / limitNumber);

    // Fetch user details for each feedback
    const feedbacksWithUser = await Promise.all(
      feedbacks.map(async (feedback) => {
        const userUrl = `${BACKEND_URL}/user/ep/${feedback.feedback_from}`;
        const { data: user } = await axios.get(userUrl);
        return {
          ...feedback.toObject(), // Convert feedback to a plain object
          user_name: user.name,   // Add user name to feedback
          profile_pic: user.profile_pic, 
        };
      })
    );

    res.status(200).json({ feedbacks: feedbacksWithUser, totalPages, currentPage: pageNumber });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getReviewsForEp = async (req, res) => {
  try {
    const { institute_id } = req;
    const { search = "" } = req.query;

    // Convert the search term to lowercase for case-insensitive comparison
    const lowerCaseSearch = search.toLowerCase();

    // Fetch the reviews for the institute
    const reviews = await UserFeedbacks.find({ feedback_to: institute_id });

    // Fetch the reviewer details one by one
    const reviewsWithUserDetails = [];
    for (const review of reviews) {
      try {
        const { data: user } = await axios.get(`${BACKEND_URL}/user/ep/${review.feedback_from}`);

        // Perform case-insensitive search across relevant fields with null/undefined checks
        if (
          (user.name && user.name.toLowerCase().includes(lowerCaseSearch)) ||
          (review.comment && review.comment.toLowerCase().includes(lowerCaseSearch))
        ) {
          reviewsWithUserDetails.push({
            _id: review._id,
            rating: review.rating,
            comment: review.comment,
            user_name: user.name,
            user_profile_pic: user.profile_pic,
          });
        }
      } catch (err) {
        console.error(`Failed to fetch details for user with ID: ${review.feedback_from}`, err);
      }
    }

    if (!reviewsWithUserDetails.length) {
      return res.status(404).json({ message: "No reviews found" });
    }

    res.status(200).json(reviewsWithUserDetails);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

