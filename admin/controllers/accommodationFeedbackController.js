const { default: axios } = require("axios");
const Accommodation = require("../models/Accommodation");
const AccommodationFeedback = require("../models/AccommodationFeedback");
const { BACKEND_URL } = process.env;

exports.createAccommodationFeedback = async (req, res) => {
  try {
    const { id } = req;
    console.log("User Id:", id);
    let { accommodation_id, rating, comment } = req.body;

    if (!rating) rating = 0;
    rating = parseFloat(rating);
    if (!comment) comment = "";
    console.log("api");

    const url = `${BACKEND_URL}/user/admin/${id}`;
    console.log(`Fetching user data from URL: ${url}`);
    const { data } = await axios.get(url);

    const user = data;
    const ep = await Accommodation.findOne({ _id: accommodation_id });
    if (!ep) {
      return res.status(404).send({
        error: "Accommodation not found",
      });
    }
    if (!user) {
      return res.status(404).send({
        error: "User not found",
      });
    }
    let feedback = await AccommodationFeedback.findOne({
      feedback_from: user._id,
      feedback_to: accommodation_id,
    });

    if (feedback)
      return res.status(400).send({
        error: "Feedback is already given by the user",
      });

    feedback = new AccommodationFeedback({
      feedback_from: user._id,
      feedback_to: accommodation_id,
      user_name: user.name,
      rating,
      comment,
    });

    await feedback.save();

    const aggregationResult = await AccommodationFeedback.aggregate([
      { $match: { feedback_to: accommodation_id } },
      {
        $group: {
          _id: "$feedback_to",
          totalRatings: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    const ratingStats = aggregationResult[0] || { totalRatings: 0, averageRating: 0 };

    await Accommodation.updateOne(
      { _id: accommodation_id },
      {
        $set: {
          rating: ratingStats.averageRating.toFixed(2),
          reviews_count: ratingStats.totalRatings,
        },
      }
    );

    res.status(200).send({
      message: "Feedback has been successfully added",
      data: feedback,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).send({
      error: "An error occurred while creating feedback!!",
    });
  }
};

exports.getAccommodationFeedbacks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { accommodation_id } = req.params;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ error: "Invalid page or limit parameters." });
    }

    const accommodation = await Accommodation.findOne({ _id: accommodation_id });
    if (!accommodation) {
      return res.status(404).json({ error: "Accommodation not found" });
    }

    const skip = (pageNumber - 1) * limitNumber;
    const query = { feedback_to: accommodation_id };

    const feedbacks = await AccommodationFeedback.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .exec();

    const totalFeedbacks = await AccommodationFeedback.countDocuments(query);
    const totalPages = Math.ceil(totalFeedbacks / limitNumber);

    // Fetch user details for each feedback
    const feedbacksWithUser = await Promise.all(
      feedbacks.map(async (feedback) => {
        const userUrl = `${BACKEND_URL}/user/admin/${feedback.feedback_from}`;
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