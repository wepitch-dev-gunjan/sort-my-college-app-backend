const { Schema, model } = require("mongoose");

const accommodationFeedbackSchema = new Schema(
  {
    feedback_to: {
      type: String,
      required: true,
    },
    feedback_from: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      reuired: true,
    },
  },
  {
    timestamps: true,
  },
  {
    strict: false,
  }
);

module.exports = model("AccommodationFeedback", accommodationFeedbackSchema);
