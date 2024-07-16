const { default: axios } = require("axios");
const EntranceInstitute = require("../models/EntranceInstitute");
const UserFeedbacks = require("../models/UserFeedbacks");

exports.createFeedback = async (req, res) => {
  try {
    const { id } = req;
    let { institute_id, rating, message } = req.body;

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
    const ep = await EntranceInstitute.findOne({ _id: institute_id });
    if (!ep) {
      return res.status(404).send({
        error: "ep not found",
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
      feedback_to: couinstitute_idnsellor_id,
      user_name: user.name,
      rating,
      message,
    });

    await UserFeedbacks.save();

    res.status(200).send({
      message: "Feedback has been successfully added",
      data: feedback,
    });
  } catch (error) {}
};
