const { default: axios } = require("axios");
const Counsellor = require("../models/Counsellor");
const Feedback = require("../models/Feedback");
require('dotenv').config();

const { BACKEND_URL } = process.env;

exports.createFeedback = async (req, res) => {
  try {
    const { user_id } = req;
    let { rating, message } = req.body;

    if (!rating) rating = 0;
    if (!message) message = '';

    const userResponse = await axios.get(`${BACKEND_URL}/user/users`, {
      params: {
        user_id
      }
    });

    const user = userResponse.data; // Extract user data from the response

    if (!user) {
      return res.status(404).send({
        error: "User not found"
      });
    }

    const feedback = new Feedback({
      giver: user._id, // Assuming user._id is the user's unique identifier
      rating,
      message
    });

    await feedback.save();

    res.status(200).send({
      message: "Feedback has been successfully added",
      data: feedback
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};


exports.getFeedbacks = async (req, res) => {
  try {
    const { counsellor_id, user_id, page = 1, limit = 10 } = req.query;
    const counsellor = await Counsellor.findOne({ _id: counsellor_id });
    if (!counsellor) return res.status(404).send({
      error: "Counsellor not found"
    })

    const user = await axios.get(`${BACKEND_URL}/user/users`, {
      params: {
        user_id
      }
    })
    if (!user) return res.status(404).send({
      error: "User not found"
    })

    // Validate page and limit to be positive integers
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ error: 'Invalid page or limit parameters.' });
    }

    // Calculate skip value for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Retrieve feedbacks for the specified user with pagination
    const feedbacks = await Feedback.find({ 'giver._id': user_id })
      .skip(skip)
      .limit(limitNumber)
      .exec();

    // Prepare the response
    const response = feedbacks.map((feedback) => ({
      profile_pic: feedback.giver.profile_pic,
      name: feedback.giver.name,
      rating: feedback.rating,
      message: feedback.message,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getFeedback = async (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.editFeedback = async (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

exports.deleteFeedback = async (req, res) => {
  try {

  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};