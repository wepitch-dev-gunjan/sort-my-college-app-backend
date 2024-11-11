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
      console.log(data);
  
      const user = data;
      const ep = await Accommodation.findOne({ _id: accommodation_id });
      console.log(ep);
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