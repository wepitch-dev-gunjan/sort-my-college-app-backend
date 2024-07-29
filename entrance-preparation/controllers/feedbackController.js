const { default: axios } = require("axios");
const EntranceInstitute = require("../models/EntranceInstitute");
const UserFeedbacks = require("../models/UserFeedbacks");
const { BACKEND_URL } = process.env;
exports.createFeedback = async (req, res) => {
  try {
    let { institute_id, rating, comment, user_id } = req.body;
    console.log(user_id);

    if (!rating) rating = 0;
    rating = parseFloat(rating);
    if (!comment) comment = "";
    console.log("api");

    const url = `${BACKEND_URL}/user/ep/${user_id}`;
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

exports.getFeedbacks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { ep_id } = req.params;
    const { user_id } = req.body;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      return res
        .status(400)
        .json({ error: "Invalid page or limit parameters." });
    }

    const ep = await EntranceInstitute.findOne({ _id: ep_id });

    if (!ep) {
      return res.status(404).json({ error: "Institute not found" });
    }

    const url = `${BACKEND_URL}/user/ep/${user_id}`;
    console.log(`Fetching user data from URL: ${url}`);
    const { data } = await axios.get(url);
    console.log(data);
    const user = data;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const skip = (pageNumber - 1) * limitNumber;
    const query = {};
    if (user_id) query.feedback_from = user_id;
    if (ep_id) query.feedback_to = ep_id;

    const feedbacks = await UserFeedbacks.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .exec();

    const totalFeedbacks = await UserFeedbacks.countDocuments(query);
    const totalPages = Math.ceil(totalFeedbacks / limitNumber);

    res
      .status(200)
      .json({ feedbacks, totalPages, currentPage: pageNumber, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
