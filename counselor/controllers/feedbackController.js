const { default: axios } = require("axios");
const Counsellor = require("../models/Counsellor");
const Feedback = require("../models/Feedback");
require("dotenv").config();

const { BACKEND_URL } = process.env;

exports.createFeedback = async (req, res) => {
  try {
    const { id } = req;
    let { counsellor_id, rating, message } = req.body;

    if (!rating) rating = 0;
    rating = parseFloat(rating);
    if (!message) message = "";

    const { data } = await axios.get(`${BACKEND_URL}/user/users`, {
      params: { user_id: id },
    });

    const user = data;
    if (!user) {
      return res.status(404).send({
        error: "User not found",
      });
    }

    const counsellor = await Counsellor.findOne({ _id: counsellor_id });

    if (!counsellor) {
      return res.status(404).send({
        error: "Counsellor not found",
      });
    }

    let feedback = await Feedback.findOne({
      feedback_from: user._id,
      feedback_to: counsellor_id,
    });

    if (feedback)
      return res.status(400).send({
        error: "Feedback is already given by the user",
      });

    feedback = new Feedback({
      feedback_from: user._id,
      feedback_to: counsellor_id,
      user_name: user.name,
      rating,
      message,
    });

    await feedback.save();

    res.status(200).send({
      message: "Feedback has been successfully added",
      data: feedback,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const { counsellor_id, user_id, page = 1, limit = 10 } = req.query;
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

    const [counsellor, user] = await Promise.all([
      Counsellor.findOne({ _id: counsellor_id }),
      axios.get(`${BACKEND_URL}/user/users`, { params: { user_id } }),
    ]);

    if (!counsellor) {
      return res.status(404).json({ error: "Counsellor not found" });
    }

    if (!user.data) {
      return res.status(404).json({ error: "User not found" });
    }

    const skip = (pageNumber - 1) * limitNumber;
    const query = {};
    if (user_id) query.feedback_from = user_id;
    if (counsellor_id) query.feedback_to = counsellor_id;

    const feedbacks = await Feedback.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .exec();

    const totalFeedbacks = await Feedback.countDocuments(query);
    const totalPages = Math.ceil(totalFeedbacks / limitNumber);

    res.status(200).json({ feedbacks, totalPages, currentPage: pageNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getFeedback = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.editFeedback = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
